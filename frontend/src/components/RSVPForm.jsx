import React, { useState } from 'react';
import { Heart, Send, Check } from 'lucide-react';

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'true',
    guests: '1',
    dietaryRequirements: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill in both name and email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attending: formData.attending === 'true',
          guests: formData.attending === 'true' ? Number(formData.guests) : 1
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit RSVP. Please try again.');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setErrorMessage('Could not connect to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rsvp-section">
        <div className="rsvp-success">
          <Heart className="success-icon" size={60} fill="#cda34f" />
          <h3 className="gold-text" style={{ fontSize: '28px', marginBottom: '15px' }}>Thank You!</h3>
          <p style={{ fontSize: '15px', color: '#fcfbf7', lineHeight: '1.6' }}>
            {formData.attending === 'true' 
              ? `We are delighted to celebrate with you, ${formData.name}! Your RSVP has been saved.`
              : `We are sorry you can't make it, ${formData.name}. Thank you for letting us know.`
            }
          </p>
          <button 
            className="gold-btn" 
            style={{ marginTop: '25px', padding: '8px 20px', fontSize: '11px' }}
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                attending: 'true',
                guests: '1',
                dietaryRequirements: '',
                message: ''
              });
              setIsSubmitted(false);
            }}
          >
            Submit Another RSVP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-section" id="rsvp-section">
      <h2 className="rsvp-title">RSVP</h2>
      <p className="rsvp-desc">
        Please respond by August 5th, 2026. We look forward to celebrating with you!
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {errorMessage && (
          <div style={{ color: '#ff8a8a', fontSize: '13px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="First and last name"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Will you be attending?</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="attending-yes"
                name="attending"
                value="true"
                checked={formData.attending === 'true'}
                onChange={handleChange}
              />
              <label htmlFor="attending-yes" className="radio-label">
                Joyfully Accept
              </label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="attending-no"
                name="attending"
                value="false"
                checked={formData.attending === 'false'}
                onChange={handleChange}
              />
              <label htmlFor="attending-no" className="radio-label">
                Regretfully Decline
              </label>
            </div>
          </div>
        </div>

        {formData.attending === 'true' && (
          <>
            <div className="form-group" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <label className="form-label" htmlFor="guests">Number of Guests (including yourself)</label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="form-input"
                style={{ appearance: 'none', WebkitAppearance: 'none' }}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
              </select>
            </div>

            <div className="form-group" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <label className="form-label" htmlFor="dietaryRequirements">Dietary Requirements</label>
              <textarea
                id="dietaryRequirements"
                name="dietaryRequirements"
                value={formData.dietaryRequirements}
                onChange={handleChange}
                placeholder="Vegetarian, vegan, allergies, etc. (leave blank if none)"
                rows="2"
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="message">Blessings / Message for Felix & Festin</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share a warm wish or note..."
            rows="3"
            className="form-input"
            style={{ resize: 'none' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="gold-btn" 
          style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              Send Response <Send size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
