const ArtisanCard = ({ artisan }) => {
  return (
    <div className="card">
      <h3>{artisan.name}</h3>
      <p>Phone: {artisan.phone}</p>
      <p>Services: {artisan.services?.length}</p>
      {artisan.portfolio?.map((img, idx) => (
        <img key={idx} src={`http://localhost:5000/${img}`} alt="portfolio" width={100} />
      ))}
    </div>
  );
};

export default ArtisanCard;