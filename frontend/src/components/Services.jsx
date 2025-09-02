import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

const serviceEnum = [
  'Plumbing', 'Electrical Work', 'Carpentry', 'Painting', 'Cleaning', 'Gardening',
  'Masonry', 'Roofing', 'Tiling', 'Welding', 'HVAC', 'Generator Repairer', 'Pest Control',
  'Locksmith', 'Mechanic', 'Auto Detailing', 'Electronics Repair', 'Furniture Making',
  'Interior Design', 'Exterior Design', 'Pool Maintenance', 'Landscape Design',
  'Home Renovation', 'Appliance Repair', 'Glass Installation/Repair', 'Flooring',
  'Plastering', 'Gutter Cleaning/Installation', 'Concrete Work', 'Drywall Installation',
  'Sewing/Tailoring', 'Fashion Design', 'Jewelry Making', 'Catering Services',
  'Baking/Pastry', 'Barber/Hairdresser', 'Beauty Therapy', 'Massage Therapy', 'Tattoo Artist',
  'Makeup Artist', 'Photography', 'Videography', 'Music Lessons', 'Dance Instructor',
  'Fitness Trainer', 'Yoga Instructor', 'Dog Walking/Pet Care', 'Pet Grooming',
  'Carpet Cleaning', 'Window Cleaning', 'Chimney Sweeping', 'Solar Panel Installation',
  'IT Services', 'Web Development', 'Graphic Design', '3D Printing', 'Other'
];

// Turn enum into array of objects with default description
const services = serviceEnum.map((name, index) => ({
  id: index + 1,
  name,
  description: `Professional ${name} services.`
}));

const Services = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [artisans, setArtisans] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = async (serviceName) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in first.');
      navigate('/login'); // ✅ SPA navigation
      return;
    }

    setSelectedService(serviceName);
    setModalOpen(true);

    try {
      const res = await axios.get(`/artisans?service=${encodeURIComponent(serviceName)}`);
      setArtisans(res.data);
    } catch (err) {
      console.error('Error fetching artisans:', err);
      alert('Failed to fetch artisans. Please try again.');
    }
  };

  const filteredArtisans = artisans.filter(a =>
    a.location.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
    a.location.state.toLowerCase().includes(searchLocation.toLowerCase()) ||
    a.location.name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <section id="services" style={styles.section}>
      <h2 style={styles.title}>Services You Can Get</h2>

      <p style={styles.instruction}>
        Click on any service card to see available artisans (login required).
      </p>

      <div style={styles.grid}>
        {services.map((s, index) => (
          <div
            key={s.id}
            style={styles.card}
            onClick={() => handleCardClick(s.name)}
          >
            <div style={{ ...styles.placeholder, backgroundColor: colors[index % colors.length] }}>
              {s.name.charAt(0)}
            </div>
            <h3 style={styles.cardTitle}>{s.name}</h3>
            <p style={styles.cardDesc}>{s.description}</p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div style={modalStyles.overlay} onClick={() => setModalOpen(false)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Artisans for "{selectedService}"</h3>
            <input
              type="text"
              placeholder="Search by city, state, or neighborhood"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              style={modalStyles.input}
            />
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Duration (mins)</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtisans.map(a => (
                  <tr key={a._id}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.phone}</td>
                    <td>{`${a.location.name}, ${a.location.city}, ${a.location.state}`}</td>
                    <td>{`$${a.price}`}</td>
                    <td>{a.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={modalStyles.closeButton} onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

const colors = ['#FF6B6B', '#4ECDC4', '#556270', '#C7F464', '#FF6B6B', '#C44D58', '#556270', '#4ECDC4', '#C7F464', '#FF6B6B'];

const styles = {
  section: { padding: '100px 20px', backgroundColor: '#f5f5f5', textAlign: 'center' },
  title: { fontSize: '36px', fontWeight: '700', marginBottom: '20px', color: '#222' },
  instruction: { fontSize: '18px', color: '#555', marginBottom: '40px' },
  grid: { display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', padding: '0 40px' },
  card: { backgroundColor: '#fff', padding: '30px 20px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' },
  placeholder: { width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#fff', margin: '0 auto 20px auto', fontWeight: '700' },
  cardTitle: { fontSize: '22px', fontWeight: '600', margin: '20px 0 12px 0', color: '#111' },
  cardDesc: { fontSize: '16px', color: '#555', lineHeight: '1.7' },
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  input: {
    padding: '8px',
    marginBottom: '20px',
    width: '100%',
    fontSize: '16px',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Services;