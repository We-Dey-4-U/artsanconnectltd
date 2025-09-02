import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Add URLs of images showing artisan works
const heroImages = [
  '/images/artisan1.jpg',
  '/images/electrician.png',
  '/images/tailorbarbar.png',
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroImages.length);
    }, 5000); // change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ ...styles.hero, backgroundImage: `url(${heroImages[currentIndex]})` }}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <h1>Connect with Skilled Artisans Near You</h1>
          <p>Find the right professional for your home, office, or project anytime, anywhere.</p>
          <div style={styles.buttons}>
            <Link to="/register" style={styles.btnPrimary}>Get Started</Link>
            <Link to="/login" style={styles.btnSecondary}>Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 20px',        // reduced from 120px to 60px
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    color: '#fff',
    transition: 'background-image 1s ease-in-out',
    minHeight: '350px',          // reduced from 500px to 350px
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    maxWidth: '700px',
    zIndex: 2,
  },
  buttons: { marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' },
  btnPrimary: { padding: '12px 30px', backgroundColor: '#4CAF50', color: '#fff', textDecoration: 'none', borderRadius: '5px' },
  btnSecondary: { padding: '12px 30px', backgroundColor: '#2196F3', color: '#fff', textDecoration: 'none', borderRadius: '5px' },
};

export default Hero;