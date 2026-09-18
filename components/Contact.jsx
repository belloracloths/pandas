"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';

const ClockIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const UberIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08A7.2 7.2 0 0 1 12 20.2z" />
    </svg>
);

const PickmeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const Contact = () => {
    const [contact, setContact] = useState({
        phone: '+94 77 123 4567',
        email: 'hello@pandaskitchen.lk',
        address: '123 Main Street, Colombo, Sri Lanka'
    });

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await axios.get('/api/settings/contact-details');
                if (res.data && res.data.value) {
                    setContact(res.data.value);
                }
            } catch (err) {
                console.error('Error fetching contact details:', err);
            }
        };
        fetchContact();
    }, []);

    return (
        <section className="contact-section" id="contact">
            <div className="container contact-container">
                <div className="contact-info">
                    <span className="contact-eyebrow">Reach Out</span>
                    <h2 className="contact-title">Get in Touch</h2>
                    <p className="contact-desc">We'd love to hear from you. Visit us or reach out anytime.</p>

                    <div className="info-list">
                        <div className="info-item">
                            <div className="info-icon">
                                <ClockIcon />
                            </div>
                            <div className="info-text">
                                <h4>Opening Hours</h4>
                                <p>8:00 AM – 11:00 PM (Daily)</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <PhoneIcon />
                            </div>
                            <div className="info-text">
                                <h4>Call Us</h4>
                                <p>{contact.phone}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <MailIcon />
                            </div>
                            <div className="info-text">
                                <h4>Email</h4>
                                <p>{contact.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-actions">
                        <p className="order-label">Order Now via</p>
                        <div className="partners">
                            <button
                                className="partner-btn uber"
                                onClick={() => window.open('https://www.ubereats.com', '_blank')}
                            >
                                <UberIcon />
                                Uber Eats
                            </button>
                            <button
                                className="partner-btn pickme"
                                onClick={() => window.open('https://pickme.lk/food', '_blank')}
                            >
                                <PickmeIcon />
                                PickMe Food
                            </button>
                        </div>
                    </div>
                </div>

                                <div className="contact-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.2419550729464!2d79.9027327!3d6.8615797999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25be75cba37e1%3A0x5c9ba0fc74f1f83d!2sPanda's%20Kitchen!5e0!3m2!1sen!2slk!4v1780193926478!5m2!1sen!2slk"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '20px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Panda's Kitchen Location"
                    />
                </div>
            </div>
        </section>
    );
};

export default Contact;