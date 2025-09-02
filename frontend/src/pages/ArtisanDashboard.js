import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  uploadPortfolio, 
  addArtisanService, 
  uploadServiceImages, 
  getArtisanOrders, 
  getArtisanServices 
} from '../api/artisanApi';

const ArtisanDashboard = () => {
  const { user, token } = useContext(AuthContext);

  const [portfolio, setPortfolio] = useState([]);
  const [message, setMessage] = useState('');
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState(60);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?._id && token) {
      setPortfolio(user.portfolio || []);
      fetchServices();
      fetchOrders();
    }
  }, [user, token]);

  const fetchServices = async () => {
    if (!user?._id || !token) return;
    try {
      const res = await getArtisanServices(user._id, token);
      setServices(res.services || []);
    } catch (err) {
      console.error('Failed to fetch services:', err.response?.data || err.message);
    }
  };

  const fetchOrders = async () => {
    if (!user?._id || !token) return;
    try {
      const res = await getArtisanOrders(user._id, token);
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data || err.message);
    }
  };

  const handlePortfolioChange = e => setPortfolioFiles(Array.from(e.target.files));

  const handleUploadPortfolio = async () => {
    if (!portfolioFiles.length || !user?._id || !token) return;
    try {
      const res = await uploadPortfolio(user._id, portfolioFiles, token);
      setPortfolio(res.portfolio);
      setMessage('Portfolio uploaded successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage('Failed to upload portfolio');
    }
  };

  const handleAddService = async e => {
    e.preventDefault();
    if (!name || !price) {
      setMessage('Service name and price are required');
      return;
    }
    if (!user?._id || !token) {
      setMessage('User not loaded yet.');
      return;
    }

    try {
      const serviceData = { 
        name, 
        description, 
        price: Number(price), 
        duration: Number(duration) 
      };
      await addArtisanService(user._id, serviceData, token);
      fetchServices();
      setName('');
      setDescription('');
      setPrice('');
      setDuration(60);
      setMessage('Service added successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage('Failed to add service');
    }
  };

  const handleServiceImageUpload = async (serviceId, files) => {
    if (!files.length || !user?._id || !token) return;
    try {
      const res = await uploadServiceImages(user._id, serviceId, files, token);
      setServices(prev =>
        prev.map(s => (s._id === serviceId ? { ...s, images: res.images } : s))
      );
      setMessage('Service images uploaded successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage('Failed to upload service images');
    }
  };

  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>Loading user...</p>;

  return (
    <div style={{ backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.title}>Welcome, {user.name}</h1>

        {/* Portfolio Section */}
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Upload Portfolio</h2>
          <div style={styles.uploadRow}>
            <input type="file" multiple onChange={handlePortfolioChange} style={styles.inputFile} />
            <button onClick={handleUploadPortfolio} style={styles.button}>Upload</button>
          </div>
          <div style={styles.imageGrid}>
            {portfolio.map((img, idx) => (
              <img 
                key={idx} 
                src={`http://localhost:5000/${img}`} 
                alt="portfolio" 
                style={styles.portfolioImage} 
              />
            ))}
          </div>
        </section>

        {/* Add Service Section */}
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Add Service</h2>
          <form onSubmit={handleAddService} style={styles.form}>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Service Name" 
              required 
              style={styles.input} 
            />
            <input 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Description" 
              style={styles.input} 
            />
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              placeholder="Price" 
              required 
              style={styles.input} 
            />
            <input 
              type="number" 
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              placeholder="Duration (mins)" 
              required 
              style={styles.input} 
            />
            <button type="submit" style={styles.button}>Add Service</button>
          </form>
        </section>

        {/* List Services */}
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Your Services</h2>
          {services.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.th}>Images</th>
                    <th style={styles.th}>Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service._id}>
                      <td style={styles.td}>{service.name}</td>
                      <td style={styles.td}>{service.description}</td>
                      <td style={styles.td}>${service.price}</td>
                      <td style={styles.td}>{service.duration} mins</td>
                      <td style={styles.td}>
                        <div style={styles.imageGrid}>
                          {service.images?.map((img, idx) => (
                            <img
                              key={idx}
                              src={`http://localhost:5000/${img}`}
                              alt="service"
                              style={styles.serviceImage}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <input
                          type="file"
                          multiple
                          onChange={e =>
                            handleServiceImageUpload(service._id, Array.from(e.target.files))
                          }
                          style={styles.inputFile}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No services added yet.</p>
          )}
        </section>

        {/* Customer Orders Section */}
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Customer Requests</h2>
          {orders.length ? (
            <div style={styles.orderGrid}>
              {orders.map(order => (
                <div key={order._id} style={styles.orderCard}>
                  <h4 style={styles.orderTitle}>Customer: {order.customer?.name}</h4>
                  <p><strong>Email:</strong> {order.customer?.email}</p>
                  <p><strong>Phone:</strong> {order.customer?.phone}</p>
                  <hr style={styles.hr} />
                  <p><strong>Service:</strong> {order.service?.name}</p>
                  <p><strong>Description:</strong> {order.service?.description}</p>
                  <p><strong>Price:</strong> ${order.service?.price}</p>
                  <p><strong>Duration:</strong> {order.service?.duration} mins</p>
                  <hr style={styles.hr} />
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Scheduled:</strong> {new Date(order.scheduledDate).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders yet.</p>
          )}
        </section>

        {message && <p style={styles.message}>{message}</p>}
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px',backgroundColor: '#f0f8ff', margin: '20px auto', padding: '0 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#2c3e50' },
  title: { textAlign: 'center', marginBottom: '30px', fontSize: '32px', fontWeight: '700' },
  subtitle: { color: '#34495e', marginBottom: '15px', fontSize: '22px', fontWeight: '600', borderBottom: '2px solid #2980b9', display: 'inline-block', paddingBottom: '5px' },
  section: { marginBottom: '50px' },
  form: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' },
  input: { padding: '12px', flex: '1 1 220px', border: '1px solid #ccc', borderRadius: '8px', transition: '0.3s', outline: 'none', fontSize: '16px' },
  inputFile: { margin: '10px 0', cursor: 'pointer' },
  button: { padding: '12px 25px', background: 'linear-gradient(135deg, #2980b9, #6dd5fa)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  imageGrid: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' },
  portfolioImage: { width: '150px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  serviceImage: { width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', minWidth: '700px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { borderBottom: '2px solid #2980b9', padding: '10px', textAlign: 'left', backgroundColor: '#f7f9fc', fontWeight: '700' },
  td: { borderBottom: '1px solid #ddd', padding: '10px', verticalAlign: 'top' },
  orderGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  orderCard: { border: '1px solid #ddd', borderRadius: '12px', padding: '20px', flex: '1 1 320px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', backgroundColor: 'white', transition: '0.3s' },
  orderTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
  hr: { margin: '10px 0', border: '0', borderTop: '1px solid #ccc' },
  message: { color: '#27ae60', fontWeight: 'bold', marginTop: '20px', textAlign: 'center', fontSize: '18px' },
  uploadRow: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }
};

export default ArtisanDashboard;