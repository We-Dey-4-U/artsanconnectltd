const faqs = [
  { q: 'How do I book an artisan?', a: 'Search for your service, select an artisan, and schedule a time.' },
  { q: 'How is payment handled?', a: 'Payment is discussed and agreed directly between you and the artisan during negotiation.' },
  { q: 'Can I review artisans?', a: 'Absolutely! After service completion, you can leave feedback.' },
];

const FAQ = () => (
  <section className="section-container">
    <h2 className="section-title">Frequently Asked Questions</h2>
    <div className="faq-grid">
      {faqs.map((f, idx) => (
        <div key={idx} className="faq-card">
          <h4 className="faq-question">{f.q}</h4>
          <p className="faq-answer">{f.a}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FAQ;