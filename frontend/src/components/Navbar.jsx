import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}><Link to="/" style={styles.logoText}>Artisan Connect</Link></div>
      <ul style={styles.menu}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><a href="#about" style={styles.link}>About</a></li>
        <li><a href="#services" style={styles.link}>Services</a></li>
        {!user && (
          <>
            <li><Link to="/login" style={styles.button}>Login</Link></li>
            <li><Link to="/register" style={styles.buttonAlt}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  logoText: { fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#333' },
  menu: { display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#333', fontWeight: '500' },
  button: { textDecoration: 'none', padding: '8px 16px', backgroundColor: '#2196F3', color: '#fff', borderRadius: '5px' },
  buttonAlt: { textDecoration: 'none', padding: '8px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '5px' },
};

export default Navbar;