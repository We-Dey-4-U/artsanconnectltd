const Services = () => {
  const services = [
    { id: 1, name: 'Plumbing', description: 'Fix leaks, install pipes, and handle water-related issues.' },
    { id: 2, name: 'Electrical Work', description: 'Install and repair electrical systems safely.' },
    { id: 3, name: 'Carpentry', description: 'Furniture making, repairs, and custom woodwork.' },
    { id: 4, name: 'Painting', description: 'Interior and exterior painting services for homes and offices.' },
    { id: 5, name: 'Cleaning', description: 'House, office, and commercial cleaning services.' },
    { id: 6, name: 'Tailoring', description: 'Custom clothing, alterations, and repairs.' },
    { id: 7, name: 'Masonry', description: 'Construction, brickwork, and other masonry services.' },
    { id: 8, name: 'Gardening & Landscaping', description: 'Lawn care, planting, and garden maintenance.' },
    { id: 9, name: 'AC & Appliance Repair', description: 'Repair and maintenance for air conditioners and appliances.' },
    { id: 10, name: 'Home Decor & Interior Design', description: 'Design and decoration services for a beautiful living space.' },
  ];

  return (
    <section id="services" style={styles.section}>
      <h2 style={styles.title}>Services You Can Get</h2>
      <div style={styles.grid}>
        {services.map((s, index) => (
          <div key={s.id} style={styles.card}>
            <div style={{...styles.placeholder, backgroundColor: colors[index % colors.length]}}>
              {s.name.charAt(0)}
            </div>
            <h3 style={styles.cardTitle}>{s.name}</h3>
            <p style={styles.cardDesc}>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const colors = ['#FF6B6B', '#4ECDC4', '#556270', '#C7F464', '#FF6B6B', '#C44D58', '#556270', '#4ECDC4', '#C7F464', '#FF6B6B'];

const styles = {
  section: {
    padding: '100px 20px',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '50px',
    color: '#222',
  },
  grid: {
    display: 'grid',
    gap: '30px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    padding: '0 40px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px 20px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  placeholder: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: '#fff',
    margin: '0 auto 20px auto',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '600',
    margin: '20px 0 12px 0',
    color: '#111',
  },
  cardDesc: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.7',
  },
};

export default Services;