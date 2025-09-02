import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [fullLocation, setFullLocation] = useState(null);
  const navigate = useNavigate();

  // Detect location for artisan
  useEffect(() => {
  if (role === 'artisan') {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      setLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationAllowed(true);
      },
      () => setLocationAllowed(false)
    );
  } else {
    setLocation(null);
    setLocationAllowed(true);
  }
}, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let payload = { name, email, password, phone, address };

// Send location if available
if (role === 'artisan' && locationAllowed && location) {
  payload.location = { lat: parseFloat(location.lat), lng: parseFloat(location.lng) };
}

      const endpoint = role === 'artisan' 
        ? '/auth/artisan/register' 
        : '/auth/customer/register';

      const res = await api.post(endpoint, payload);

      // Store full location from backend response
      if (role === 'artisan') setFullLocation(res.data.user.location);

      alert(res.data.message || 'Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <Link to="/" style={backLinkStyle}>← Back to Home</Link>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />

        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />

        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />

        <label>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
          <option value="customer">Customer</option>
          <option value="artisan">Artisan</option>
        </select>

        <label>Phone:</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />

        {(role === 'customer' || role === 'artisan') && (
          <>
            <label>{role === 'artisan' ? 'Office Address (optional if location allowed)' : 'Address:'}</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
          </>
        )}

        {!locationAllowed && role === 'artisan' && !address && (
          <p style={{ color: 'red' }}>Allow location access or type your office address to register as an artisan</p>
        )}

        {fullLocation && role === 'artisan' && (
          <div style={{ marginBottom: 20, color: '#333' }}>
            <strong>Detected Location:</strong> {fullLocation.name}, {fullLocation.city}, {fullLocation.state}, {fullLocation.country}
          </div>
        )}

        <button
          type="submit"
          disabled={role === 'artisan' && !locationAllowed && !address}
          style={{ ...buttonStyle, opacity: role === 'artisan' && !locationAllowed && !address ? 0.6 : 1 }}
        >
          Register
        </button>

        <p style={{ textAlign: 'center', marginTop: 15 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' };
const formStyle = { background: '#fff', padding: 40, borderRadius: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.1)', width: 400 };
const inputStyle = { width: '100%', padding: 10, margin: '8px 0 20px', borderRadius: 5, border: '1px solid #ccc', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 12, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer', marginBottom: 15 };
const backLinkStyle = { display: 'block', marginBottom: 20, color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' };

export default Register;