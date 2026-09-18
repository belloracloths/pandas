"use client";
import React from 'react';
import axios from 'axios';
import './MenuSections.css';

const BADGE_COLORS = {
    red:    '#e74c3c',
    green:  '#27ae60',
    blue:   '#2980b9',
    orange: '#e67e22',
    purple: '#8e44ad',
    gold:   '#f39c12',
};

import { sectionsData } from '../lib/constants';
const oldSectionsData = [
    { id: 'picked-for-you',    title: 'Picked For You',      subtitle: "Our chef's special recommendations" },
    { id: 'breakfast-burgers', title: 'Breakfast Burgers',    subtitle: 'Available until 11:00 AM daily' },
    { id: 'regular-burgers',   title: 'All Day Burgers',      subtitle: null },
    { id: 'ultra-max-burgers', title: 'Ultra Max Burgers',    subtitle: null }
];

export const MenuCategory = ({ data, titleClass }) => {
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                const productsArray = Array.isArray(res.data) ? res.data : [];
                const filtered = productsArray.filter(p => p.category === data.title);
                setProducts(filtered);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchProducts();
    }, [data.title]);

    const handleItemOrder = (url) => {
        window.open(url || 'https://www.ubereats.com', '_blank');
    };

    return (
        <section className="menu-section" id={data.id}>
            <div className="container">
                <div className="section-header">
                    <h2 className={`section-title ${titleClass}`}>{data.title}</h2>
                    {data.subtitle && <p className="section-subtitle">{data.subtitle}</p>}
                </div>

                <div className="menu-grid">
                    {products.map((item) => (
                        <div key={item._id} className="menu-card">

                            {/* Image with top-left badge */}
                            <div className="card-image-wrapper">
                                <div
                                    className="card-image-placeholder"
                                    style={{
                                        backgroundImage: `url(${item.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                                {item.badge && item.badge.trim() !== '' && (
                                    <span
                                        className="card-badge"
                                        style={{ background: BADGE_COLORS[item.badgeColor] || BADGE_COLORS.red }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="card-content">
                                <h3 className="card-title">{item.title}</h3>

                                {/* Price row: current + strikethrough original */}
                                <div className="card-price-row">
                                    <span className="card-price">LKR {Number(item.price).toLocaleString()}</span>
                                    {item.originalPrice && (
                                        <span className="card-original-price">
                                            LKR {Number(item.originalPrice).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Bottom badge */}
                                {item.bottomBadge && item.bottomBadge.trim() !== '' && (
                                    <span
                                        className="card-bottom-badge"
                                        style={{ background: BADGE_COLORS[item.bottomBadgeColor] || BADGE_COLORS.red }}
                                    >
                                        {item.bottomBadge}
                                    </span>
                                )}

                                <p className="card-description">{item.subtitle}</p>

                                <div className="card-buttons">
                                    <button className="order-btn uber" onClick={() => handleItemOrder(item.uberLink)}>
                                        Order with Uber
                                    </button>
                                    <button className="order-btn pickme" onClick={() => handleItemOrder(item.pickMeLink)}>
                                        Order with PickMe
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1', color: '#999' }}>
                            Currently no items in this category.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

const MenuSections = () => (
    <div className="menu-sections-wrapper">
        {sectionsData.map((section) => (
            <MenuCategory key={section.id} data={section} />
        ))}
    </div>
);

export default MenuSections;
