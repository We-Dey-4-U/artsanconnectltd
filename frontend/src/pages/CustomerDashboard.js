import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNearbyArtisans } from '../api/artisanApi';
import { createOrder, getOrders } from '../api/orderApi';
import axios from '../api/axiosConfig';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [artisans, setArtisans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [serviceId, setServiceId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Review form state
  const [feedback, setFeedback] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Pagination state
  const [artisanPage, setArtisanPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const itemsPerPage = 5;

  const formatLocation = (location) => {
    if (!location) return 'Unknown State, Unknown Country';
    const state = location.state || 'Unknown State';
    const country = location.country || 'Unknown Country';
    return `${state}, ${country}`;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const data = await getNearbyArtisans(coords.latitude, coords.longitude);
        setArtisans(data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch nearby artisans');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch your orders');
      } finally {
        setOrderLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openOrderModal = (artisan) => {
    setSelectedArtisan(artisan);
    setServiceId('');
    setScheduledDate('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedArtisan(null);
    setModalOpen(false);
  };

  const handleOrder = async () => {
    if (!selectedArtisan || !serviceId || !scheduledDate) {
      alert('Please select artisan, service, and date');
      return;
    }
    const payload = {
      artisanId: selectedArtisan._id,
      customerId: user._id,
      serviceId,
      scheduledDate,
    };
    try {
      await createOrder(payload);
      alert('Order placed successfully!');
      closeModal();
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Order creation failed:", err.response?.data || err.message);
      alert('Failed to place order');
    }
  };

  const submitReview = async () => {
    if (!feedback.trim()) return alert('Please write your feedback');
    setReviewLoading(true);
    try {
      await axios.post('/reviews', {
        name: user.name,
        role: 'Customer',
        feedback: feedback.trim(),
        customerId: user._id,
      });
      alert('Thank you for your feedback!');
      setFeedback('');
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredArtisans = artisans.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchesService = a.services?.some((s) =>
      s.name.toLowerCase().includes(term)
    );
    const matchesLocation =
      a.location &&
      ((a.location.state || '').toLowerCase().includes(term) ||
        (a.location.country || '').toLowerCase().includes(term));
    const matchesAddress = (a.address || '').toLowerCase().includes(term);
    return matchesService || matchesLocation || matchesAddress;
  });

  // Pagination slices
  const artisanStart = (artisanPage - 1) * itemsPerPage;
  const artisanEnd = artisanStart + itemsPerPage;
  const displayedArtisans = filteredArtisans.slice(artisanStart, artisanEnd);

  const orderStart = (orderPage - 1) * itemsPerPage;
  const orderEnd = orderStart + itemsPerPage;
  const displayedOrders = orders.slice(orderStart, orderEnd);

  if (loading) return <p>Loading nearby artisans...</p>;

  return (
    <div style={{ backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Welcome, {user?.name}</h1>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <label>Search Services, Location, or Address: </label>
          <input
            type="text"
            placeholder="Type service, state, country, or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', width: '300px', maxWidth: '100%', marginLeft: '10px' }}
          />
        </div>

        {/* Nearby Artisans */}
        <h2>Search For Nearby Artisans</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Office Address</th>
                <th style={thStyle}>Services</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedArtisans.length ? (
                displayedArtisans.map((a) => (
                  <tr key={a._id}>
                    <td style={tdStyle}>{a.name}</td>
                    <td style={tdStyle}>{a.phone || 'N/A'}</td>
                    <td style={tdStyle}>{formatLocation(a.location)}</td>
                    <td style={tdStyle}>{a.address || 'N/A'}</td>
                    <td style={tdStyle}>
                      {a.services?.length ? a.services.map((s) => s.name).join(', ') : 'No services'}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => openOrderModal(a)}>Select Artisan</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>
                    No artisans match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Artisan Pagination */}
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            disabled={artisanPage === 1}
            onClick={() => setArtisanPage(artisanPage - 1)}
          >
            Previous
          </button>
          <span>Page {artisanPage} of {Math.ceil(filteredArtisans.length / itemsPerPage)}</span>
          <button
            disabled={artisanPage === Math.ceil(filteredArtisans.length / itemsPerPage)}
            onClick={() => setArtisanPage(artisanPage + 1)}
          >
            Next
          </button>
        </div>

        {/* Orders */}
        <h2>Your Requests</h2>
        {orderLoading ? (
          <p>Loading your orders...</p>
        ) : orders.length ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px', marginBottom: '10px' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Address</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Service</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={tdStyle}>{order.artisan?.name || 'N/A'}</td>
                      <td style={tdStyle}>{order.artisan?.phone || 'N/A'}</td>
                      <td style={tdStyle}>{order.artisan?.address || 'N/A'}</td>
                      <td style={tdStyle}>
                        {order.artisan?.location
                          ? `${order.artisan.location.state || 'Unknown State'}, ${order.artisan.location.country || 'Unknown Country'}`
                          : 'Unknown Location'}
                      </td>
                      <td style={tdStyle}>{order.service?.name || 'N/A'}</td>
                      <td style={tdStyle}>View</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Pagination */}
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                disabled={orderPage === 1}
                onClick={() => setOrderPage(orderPage - 1)}
              >
                Previous
              </button>
              <span>Page {orderPage} of {Math.ceil(orders.length / itemsPerPage)}</span>
              <button
                disabled={orderPage === Math.ceil(orders.length / itemsPerPage)}
                onClick={() => setOrderPage(orderPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>You have no orders yet.</p>
        )}

        {/* Order Modal */}
        {modalOpen && selectedArtisan && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h3>Place Order for {selectedArtisan.name}</h3>

              <label>Select Service:</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={inputStyle}
              >
                <option value="">-- Select a Service --</option>
                {selectedArtisan.services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} - ₦{s.price} ({s.duration} mins)
                  </option>
                ))}
              </select>

              <label>Scheduled Date:</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                style={inputStyle}
              />

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={handleOrder} style={placeButtonStyle}>Place Order</button>
                <button onClick={closeModal} style={cancelButtonStyle}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <div style={reviewContainerStyle}>
          <h2>Leave a Review</h2>
          <textarea
            placeholder="Share your experience with an artisan..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={reviewTextAreaStyle}
          />
          <button
            onClick={submitReview}
            disabled={reviewLoading}
            style={submitReviewButtonStyle}
          >
            {reviewLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// --- Styles ---
const thStyle = { border: '1px solid #ccc', padding: '8px', backgroundColor: '#e0f7fa' };
const tdStyle = { border: '1px solid #ccc', padding: '8px' };
const inputStyle = { display: 'block', margin: '10px 0', padding: '8px', width: '100%' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '400px', maxHeight: '90%', overflowY: 'auto' };
const placeButtonStyle = { padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelButtonStyle = { padding: '10px 20px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const reviewContainerStyle = { marginTop: '40px', padding: '20px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' };
const reviewTextAreaStyle = { width: '100%', padding: '10px', borderRadius: '5px', minHeight: '100px', border: '1px solid #ccc', resize: 'vertical' };
const submitReviewButtonStyle = { marginTop: '10px', padding: '10px 20px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default CustomerDashboard;