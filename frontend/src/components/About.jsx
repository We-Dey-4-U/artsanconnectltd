import React from 'react';

const About = () => {
  return (
    <section id="about" style={styles.container}>
      <h2 style={styles.title}>About Artisan Connect</h2>
      <div style={styles.content}>
        <img
          src="/images/artisan2.png"
          alt="Artisans at work"
          style={styles.image}
        />
         <p style={styles.text}>
        Artisan Connect is your ultimate platform to discover, connect with, and hire trusted local artisans with ease. Customers can search for artisans based on their location, city, or specialty, ensuring you find the right professional nearby. Each artisan is verified and registered with accurate contact and location details, so you can hire confidently. After completing a service, customers can leave reviews and ratings, helping others choose reliable professionals. Whether it’s an electrician, plumber, painter, or carpenter, Artisan Connect makes finding, booking, and reviewing local services fast, safe, and efficient—all from the comfort of your home.
         </p>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: '80px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '40px',
    color: '#333',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: '400px',
    maxWidth: '100%',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    objectFit: 'cover',
  },
  text: {
    fontSize: '18px',
    color: '#555',
    lineHeight: '1.8',
    maxWidth: '500px',
    textAlign: 'left',
  },
  // Media query for smaller screens
  '@media (max-width: 768px)': {
    content: {
      flexDirection: 'column',
      textAlign: 'center',
    },
    text: {
      textAlign: 'center',
    },
  },
};

export default About;