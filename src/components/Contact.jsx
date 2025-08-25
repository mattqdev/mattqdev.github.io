// src/components/Contact.jsx
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FaDiscord, FaEnvelope, FaTwitter } from 'react-icons/fa';
import robloxIcon from '../assets/icons/roblox.svg';


const Contact = () => {
  const [state, handleSubmit] = useForm("mgvzyykz");
  if (state.succeeded) {
    return <p style={{textAlign:"center", padding:15}}>Message Sent!</p>;
  }

  return (
    <section id="contact" className="section-footer" style={{ background: '#0a0a10' }}>
      <div className="container">
        <div className="section-title">
          <h2>Contact Me</h2>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <a href="mailto:mattqdevv@gmail.com">mattqdevv@gmail.com</a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <FaDiscord />
              </div>
              <div className="contact-details">
                <h3>Discord</h3>
                <a href="https://discord.gg/ETgCMSps4c" target="_blank" rel="noopener noreferrer">
                  @mattqdev
                </a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <FaTwitter />
              </div>
              <div className="contact-details">
                <h3>Twitter/X</h3>
                <a href="https://x.com/mattqdev" target="_blank" rel="noopener noreferrer">
                  @mattqdev
                </a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <img draggable="false" src={robloxIcon} alt="Roblox Icon" className='contact-icon-svg red-filter'/>
              </div>
              <div className="contact-details">
                <h3>Roblox</h3>
                <a href="https://www.roblox.com/users/2992118050" target="_blank" rel="noopener noreferrer">
                  MattQ Profile
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <form onSubmit={handleSubmit} method="POST">
              <div className="form-group">
                <input type="text" name="name" placeholder="Your Name (optional)" />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Your Email (optional)" />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                />
              </div>
              <div className="form-group">
                <input type="text" name="subject" placeholder="Subject" />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Your Message (suggestion, bug report or anything)" required></textarea>
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                />
              </div>
              <button type="submit" className="btn" disabled={state.submitting}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
