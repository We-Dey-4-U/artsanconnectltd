const steps = [
  { title: 'Register', desc: 'Create your account to start booking services.', icon: '📝' },
  { title: 'Search', desc: 'Find local artisans easily by service or location.', icon: '🔍' },
  { 
    title: 'Select & Request', 
    desc: 'Choose the artisan, select the service you need, and place your request.', 
    icon: '✅' 
  },
  { title: 'Book', desc: 'Schedule a convenient time for the service.', icon: '📅' },
  { title: 'Connect & Review', desc: 'Communicate directly with the artisan and leave feedback after the service.', icon: '💬' },
];

const HowItWorks = () => (
  <section className="section-container">
    <h2 className="section-title">How It Works</h2>
    <div className="steps-grid">
      {steps.map((step, idx) => (
        <div key={idx} className="step-card">
          <div className="step-icon">{step.icon}</div>
          <h3 className="step-title">{step.title}</h3>
          <p className="step-desc">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;