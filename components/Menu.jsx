"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';

const CATEGORY_META = {
    'Picked For You':    { time: 'Chef\'s Choice' },
    'Appetizers':        { time: 'All Day' },
    'Breakfast Burgers': { time: 'Until 11:00 AM' },
    'Regular Burgers':   { time: 'All Day' },
    'Ultra Max Burgers': { time: 'All Day' },
};

const BADGE_COLORS = {
    red:    '#e74c3c',
    green:  '#27ae60',
    blue:   '#2980b9',
    orange: '#e67e22',
    purple: '#8e44ad',
    gold:   '#f39c12',
};

const FALLBACK_UBER   = 'https://www.ubereats.com';
const FALLBACK_PICKME = 'https://pickme.lk/food';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Picked For You');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = Object.keys(CATEGORY_META);
    const filtered = products.filter(p => p.category === activeCategory);

    return (
        <section className="menu-section" id="menu">
            <div className="container">
                <h2 className="section-title">Our Menu</h2>
                <p className="section-subtitle">Homemade Fresh Goodness in Every Bite</p>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                            <span className="category-time">{CATEGORY_META[cat].time}</span>
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                {loading ? (
                    <div className="menu-loading">Loading menu...</div>
                ) : filtered.length === 0 ? (
                    <div className="menu-empty">No items available in this category yet.</div>
                ) : (
                    <div className="menu-grid">
                        {filtered.map(item => (
                            <div key={item._id} className="menu-card">
                                {/* Image with badge overlay */}
                                <div className="menu-card-img">
                                    <img src={item.imageUrl} alt={item.title} />
                                    {item.badge && (
                                        <span
                                            className="menu-badge"
                                            style={{ background: BADGE_COLORS[item.badgeColor] || BADGE_COLORS.red }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Card Details */}
                                <div className="menu-details">
                                    <h3>{item.title}</h3>
                                    <p>{item.subtitle}</p>
                                    <span className="price">LKR {Number(item.price).toLocaleString()}</span>
                                    <div className="menu-card-actions">
                                        <button
                                            className="order-btn uber"
                                            onClick={() => window.open(item.uberLink || FALLBACK_UBER, '_blank')}
                                        >
                                            Uber Eats
                                        </button>
                                        <button
                                            className="order-btn pickme"
                                            onClick={() => window.open(item.pickMeLink || FALLBACK_PICKME, '_blank')}
                                        >
                                            PickMe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Menu;