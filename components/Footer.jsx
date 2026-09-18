"use client";
import React from 'react';
import './Footer.css';
const pandaLogo = '/assets/panda.jpeg';

const Footer = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            <div className="container footer-container">

                {/* Section 1: Logo & Description */}
                <div className="footer-section brand-section">
                    <div className="footer-brand-row">
                        <img src={pandaLogo} alt="Panda's Kitchen" className="footer-logo-img" />
                        <span className="footer-brand-name">Panda's Kitchen</span>
                    </div>
                    <p className="brand-desc">
                        Crafting warm, homemade memories in every bite.
                        From our kitchen to your heart,
                        experience the joy of fresh goodness.
                    </p>
                </div>

                {/* Section 2: Quick Links */}
                <div className="footer-section links-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li onClick={() => scrollToSection('picked-for-you')}>Picked for You</li>
                        <li onClick={() => scrollToSection('appetizers')}>Appetizers</li>
                        <li onClick={() => scrollToSection('breakfast-burgers')}>Breakfast Burgers</li>
                        <li onClick={() => scrollToSection('regular-burgers')}>Regular Burgers</li>
                        <li onClick={() => scrollToSection('ultra-max-burgers')}>Ultra Max Burgers</li>
                    </ul>
                </div>

                {/* Section 3: Follow Us */}
                <div className="footer-section social-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Section 4: Stay Updated */}
                <div className="footer-section subscribe-section">
                    <h3>Stay Updated</h3>
                    <div className="subscribe-box">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Panda's Kitchen. Homemade Fresh Goodness.</p>
            </div>
        </footer>
    );
};

export default Footer;