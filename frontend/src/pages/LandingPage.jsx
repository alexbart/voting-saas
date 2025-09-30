// frontend/src/pages/LandingPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // In production: send to backend API like /api/contact
    toast.success('Thank you! We’ll contact you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header — NO user info, NO logout */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">🗳️ Voting SaaS</Link>
          <div>
            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container py-5 flex-grow-1">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold">Secure, Adaptable Online Voting</h1>
            <p className="lead text-muted">
              For schools, boards, associations, and more. Launch elections in minutes.
            </p>
            <div className="mt-4">
              <Link to="/register" className="btn btn-success btn-lg">Get Started</Link>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="bg-light p-4 rounded shadow">
              <h5>For Organizations</h5>
              <ul className="list-unstyled mt-3">
                <li>🏫 School elections</li>
                <li>🏢 Board decisions</li>
                <li>🏘️ Community votes</li>
                <li>🔐 End-to-end secure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div id="contact" className="mt-5 pt-5 border-top">
          <h2 className="mb-4">Request a Custom Voting Setup</h2>
          <div className="row">
            <div className="col-md-6">
              <form onSubmit={handleContactSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Tell us about your organization"
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-outline-success">Send Request</button>
              </form>
            </div>
            <div className="col-md-6">
              <h5>Why Choose Us?</h5>
              <ul className="list-unstyled">
                <li>✅ GDPR & Data Protection compliant</li>
                <li>✅ Real-time results</li>
                <li>✅ Multi-context (school, board, etc.)</li>
                <li>✅ Full audit trail</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center text-muted">
          <p className="mb-0">&copy; {new Date().getFullYear()} Voting SaaS</p>
        </div>
      </footer>
    </div>
  );
}