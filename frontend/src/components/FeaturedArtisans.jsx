const featuredArtisans = [
  { name: 'John Doe', service: 'Electrician', image: '/images/artisan1.jpg' },
  { name: 'Jane Smith', service: 'Painter', image: '/images/artisan2.jpg' },
  { name: 'Samuel Lee', service: 'Carpenter', image: '/images/artisan3.jpg' },
];

const FeaturedArtisans = () => (
  <section className="section-container">
    <h2 className="section-title">Featured Artisans</h2>
    <div className="artisans-grid">
      {featuredArtisans.map((artisan, idx) => (
        <div key={idx} className="artisan-card">
          <img src={artisan.image} alt={artisan.name} className="artisan-img" />
          <h3 className="artisan-name">{artisan.name}</h3>
          <p className="artisan-service">{artisan.service}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedArtisans;