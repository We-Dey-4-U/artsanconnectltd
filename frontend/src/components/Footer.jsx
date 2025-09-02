import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = e => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Brand & About */}
        <div style={styles.brand}>
          <h2 style={styles.brandTitle}>Artisan Connect</h2>
          <p style={styles.brandDesc}>Connecting you with skilled professionals for every project.</p>
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Links</h3>
          <a href="#about" style={styles.link}>About</a>
          <a href="#services" style={styles.link}>Services</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </div>

        {/* Services */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Our Services</h3>
          <p style={styles.link}>Plumbing</p>
          <p style={styles.link}>Electrical Work</p>
          <p style={styles.link}>Carpentry</p>
          <p style={styles.link}>Cleaning</p>
        </div>

        {/* Newsletter */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Subscribe</h3>
          <form onSubmit={handleSubscribe} style={styles.form}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btn}>Subscribe</button>
          </form>
        </div>
      </div>

      {/* Social Media */}
      <div style={styles.social}>
        <a href="#" style={styles.socialIcon}><FaFacebookF /></a>
        <a href="#" style={styles.socialIcon}><FaTwitter /></a>
        <a href="#" style={styles.socialIcon}><FaInstagram /></a>
        <a href="#" style={styles.socialIcon}><FaLinkedinIn /></a>
      </div>

      {/* Copyright */}
      <p style={styles.copy}>&copy; {new Date().getFullYear()} Artisan Connect. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#111',
    color: '#fff',
    padding: '60px 20px 30px 20px',
    textAlign: 'center',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto 30px auto',
    textAlign: 'left',
  },
  brand: {},
  brandTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  brandDesc: { fontSize: '14px', lineHeight: '1.6', color: '#ccc' },
  section: {},
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '15px' },
  link: { display: 'block', color: '#ccc', textDecoration: 'none', marginBottom: '8px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '5px', border: 'none', fontSize: '14px' },
  btn: { padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: '#fff', fontWeight: '600', cursor: 'pointer' },
  social: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' },
  socialIcon: { color: '#fff', fontSize: '18px', textDecoration: 'none' },
  copy: { fontSize: '13px', color: '#777' },
};

export default Footer;