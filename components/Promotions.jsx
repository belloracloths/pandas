"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Promotions.css';

const Promotions = ({ isSimple }) => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get('/api/offers');
                setOffers(res.data.filter(o => o.type === 'Special'));
            } catch (err) {
                console.error('Error fetching promotions:', err);
            }
        };
        fetchOffers();
    }, []);

    const handleOrder = (url) => window.open(url || 'https://www.ubereats.com', '_blank');

    const Cards = (
        <div className="promo-grid">
            {offers.length === 0 ? (
                <div className="promo-empty">No special offers available right now. Check back soon!</div>
            ) : (
                offers.map((offer, index) => (
                    <div key={offer._id} className="promo-card">
                        {/* Full bleed image */}
                        <div className="promo-image" style={{ backgroundImage: `url(${offer.imageUrl})` }} />

                        {/* Dark overlay */}
                        <div className="promo-overlay" />

                        {/* Content */}
                        <div className="promo-text">
                            {offer.subtitle && (
                                <div className="promo-badge">{offer.subtitle}</div>
                            )}
                            <div className="promo-content">
                                <h3>{offer.title}</h3>
                                {offer.content && <p className="promo-desc">{offer.content}</p>}
                            </div>

                            {offer.price > 0 && (
                                <div className="promo-price-row">
                                    <span className="promo-price">LKR {Number(offer.price).toLocaleString()}</span>
                                    <span className="promo-price-label">Special<br/>Price</span>
                                </div>
                            )}

                            <div className="promo-buttons">
                                <button className="promo-btn uber" onClick={() => handleOrder(offer.uberLink)}>
                                    Order on Uber Eats
                                </button>
                                <button className="promo-btn pickme" onClick={() => handleOrder(offer.pickMeLink)}>
                                    PickMe Food
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    if (isSimple) return Cards;

    return (
        <section className="promotions-section" id="combo-deals">
            <div className="container">
                <div className="promotions-header">
                    <span className="section-eyebrow">Exclusive Deals</span>
                    <h2 className="section-title">Special <span>Offers</span></h2>
                </div>
                {Cards}
            </div>
        </section>
    );
};

export default Promotions;