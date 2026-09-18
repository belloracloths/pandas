"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SpecialOffer.css';

const SpecialOffer = () => {
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await axios.get('/api/offers');
                const limitedOffers = res.data.filter(o => o.type === 'Limited Time');
                if (limitedOffers.length > 0) {
                    setOffer(limitedOffers[limitedOffers.length - 1]); // Latest
                }
            } catch (err) {
                console.error('Error fetching special offer:', err);
            }
        };
        fetchOffer();
    }, []);

    if (!offer) {
        return (
            <section className="special-offer-section bg-yellow" id="limited-offer">
                <div className="container">
                    <div className="special-offer-card">
                        <div className="special-offer-content">
                            <h2 className="title-black">Limited Time Offer</h2>
                            <h3 className="title-black">Fresh Homemade Burgers Weekly!</h3>
                            <p>Stay tuned for our upcoming limited time specials. Pure, home-style goodness coming your way.</p>
                            <button className="claim-btn">Order Now</button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="special-offer-section bg-yellow" id="limited-offer">
            <div className="container">
                <div className="special-offer-card">
                    <div className="offer-content">
                        {offer.subtitle && (
                            <h4 className="subtitle-black" style={{ textTransform: 'uppercase', color: '#333', letterSpacing: '2px', marginBottom: '10px', fontSize: '1.2rem', opacity: 0.8 }}>
                                {offer.subtitle}
                            </h4>
                        )}
                        <h2 className="title-amber" style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
                            {offer.title}
                        </h2>
                        <div className="offer-body-text" style={{ fontSize: '1.2rem', margin: '20px 0', fontWeight: '500', whiteSpace: 'pre-wrap', color: '#444', maxWidth: '500px' }}>
                            {offer.content}
                        </div>
                        <button
                            className="claim-btn"
                            onClick={() => window.open(offer.uberLink || 'https://www.ubereats.com', '_blank')}
                        >
                            Order Now
                        </button>
                    </div>
                    <div
                        className="special-offer-image"
                        style={{ backgroundImage: `url(${offer.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffer;
