import { useEffect, useState, useRef } from 'react';
import axios from '../api/axiosConfig';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get('/reviews');
        setTestimonials(res.data);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);

  // Duplicate testimonials for seamless scrolling
  const scrollingTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationFrame;
    let start = null;

    const speed = 0.05; // pixels per ms

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const translateX = -(elapsed * speed) % (marquee.scrollWidth / 2);
      marquee.style.transform = `translateX(${translateX}px)`;
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [scrollingTestimonials]);

  return (
    <section className="section-container bg-light" style={{ overflow: 'hidden' }}>
      <h2 className="section-title">What Our Customers Say</h2>

      {testimonials.length ? (
        <div
          className="testimonial-marquee"
          ref={marqueeRef}
          style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}
        >
          {scrollingTestimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <p className="testimonial-feedback">"{t.feedback}"</p>
              <h4 className="testimonial-name">{t.name}</h4>
              <span className="testimonial-role">{t.role}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to share your feedback!</p>
      )}

      <style>{`
        .testimonial-card {
          background: #1e3a8a;
          color: #fff;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          width: 280px; /* moderate fixed width */
          max-width: 280px;
          flex-shrink: 0;
        }

        .testimonial-feedback {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
          word-break: break-word;
          white-space: normal; /* allow wrapping */
        }

        .testimonial-name {
          font-weight: bold;
          margin: 0;
        }

        .testimonial-role {
          font-size: 12px;
          opacity: 0.8;
        }

        @media (max-width: 600px) {
          .testimonial-card {
            width: 200px;
            max-width: 200px;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;