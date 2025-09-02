import { Link } from 'react-router-dom';

const CTA = () => (
  <section style={styles.ctaSection}>
    <div style={styles.overlay}>
      <div style={styles.content}>
        <h2 style={styles.title}>Ready to Find Your Trusted Artisan?</h2>
        <p style={styles.text}>Connect with verified local artisans for your home, office, and business needs.</p>
        <Link to="/register" style={styles.btnPrimary}>Get Started</Link>
      </div>
    </div>
  </section>
);

const styles = {
  ctaSection: {
    position: 'relative',
    backgroundImage: 'url("/images/tailorbarbar.png")', // replace with a nice banner image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    textAlign: 'center',
    maxWidth: '700px',
    zIndex: 2,
  },
  title: {
    fontSize: '2rem',
    marginBottom: '15px',
  },
  text: {
    fontSize: '1.1rem',
    marginBottom: '25px',
  },
  btnPrimary: {
    padding: '12px 30px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    transition: '0.3s',
  },
};

export default CTA;