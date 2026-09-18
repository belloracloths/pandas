"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get('/api/feedback');
                setReviews(res.data);
            } catch (err) {
                console.error('Error fetching feedback:', err);
            }
        };
        fetchFeedback();
    }, []);

    return (
        <section className="feedback-section" id="feedback">
            <div className="container">
                <div className="feedback-header">
                    <span className="section-eyebrow">Testimonials</span>
                    <h2 className="section-title">What Our <span>Customers</span> Say</h2>
                </div>

                {reviews.length === 0 ? (
                    <div className="feedback-grid">
                        <div className="feedback-empty">No reviews yet. Be the first!</div>
                    </div>
                ) : (
                    <div className="feedback-grid">
                        {reviews.map(review => (
                            <div key={review._id} className="feedback-card">
                                <div className="feedback-card-top">
                                    <div className="feedback-avatar">
                                        {review.customerName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="feedback-name">{review.customerName}</div>
                                        <div className="feedback-date">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="stars">
                                    {[...Array(review.rating || 5)].map((_, i) => (
                                        <span key={i} className="star">★</span>
                                    ))}
                                </div>
                                <p className="feedback-text">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Feedback;