"use client";
import React from 'react';
import axios from 'axios';
import './Extras.css';

const EXTRAS_API = '/api/extras';

const Extras = ({
    id,
    title = 'Extras',
    categories = [],
    showFilterButtons = true,
    showTitle = true,
}) => {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get(EXTRAS_API);
                const data = Array.isArray(res.data) ? res.data : [];
                setItems(data);
            } catch (err) {
                console.error('Error fetching extras:', err);
                setItems([]);
            }
        };

        fetchItems();
    }, []);

    const normalizedCategories = categories.map((category) => category.toLowerCase());
    const visibleItems = normalizedCategories.length
        ? items.filter((item) => normalizedCategories.includes(String(item.category || '').toLowerCase()))
        : items;

    const handleOrder = (url) => {
        window.open(url || 'https://www.ubereats.com', '_blank');
    };

    return (
        <section id={id} className="extras-section">
            <div className="container">
                {showTitle && title && <h2 className="extras-title">{title}</h2>}

                {showFilterButtons && categories.length > 1 && (
                    <div className="extras-buttons-container">
                        {categories.map((category) => (
                            <button key={category} className="extras-category-btn active" type="button">
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                <div className="extras-content-grid">
                    {visibleItems.map((item) => (
                        <article key={item._id} className="extras-card">
                            <div
                                className="extras-card-image"
                                style={{ backgroundImage: `url(${item.imageUrl})` }}
                                aria-hidden="true"
                            />
                            <div className="extras-card-body">
                                <h3>{item.title}</h3>
                                <p>{item.subtitle}</p>
                                <div className="extras-price">LKR {Number(item.price).toLocaleString()}</div>
                                <div className="extras-buttons">
                                    <button className="order-btn uber" type="button" onClick={() => handleOrder(item.uberLink)}>
                                        Order with Uber
                                    </button>
                                    <button className="order-btn pickme" type="button" onClick={() => handleOrder(item.pickMeLink)}>
                                        Order with PickMe
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}

                    {visibleItems.length === 0 && (
                        <p style={{ textAlign: 'center', width: '100%', color: '#999', gridColumn: '1 / -1' }}>
                            Currently no items in this category.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Extras;