"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './About.css';

const features = [
    { label: 'Fresh Ingredients Daily' },
    { label: 'Homemade Recipes' },
    { label: 'Fast Delivery' },
    { label: 'Zero Artificial Flavors' },
];

const About = () => {
    const [story, setStory] = useState('');

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get('/api/settings/our-story');
                setStory(res.data.value);
            } catch {
                setStory("Panda's Kitchen began with a simple belief: food should be honest, fresh, and made with love. Every burger patty is hand-pressed, every sauce is crafted in-house, and we ensure zero artificial flavors.");
            }
        };
        fetchStory();
    }, []);

    return (
        <section className="about-section" id="about">
            <div className="container">
                <div className="about-inner">
                    <div className="about-image">
                        <img
                            src="https://placehold.co/600x600/FFE8DC/FF6B35?text=Our+Kitchen"
                            alt="Our Story"
                        />
                        <div className="about-image-badge">
                            <strong>5★</strong>
                            <span>Rated Kitchen</span>
                        </div>
                    </div>
                    <div className="about-content">
                        <span className="section-eyebrow">Who We Are</span>
                        <h2 className="section-title">Our <span>Story</span></h2>
                        <div className="about-text">
                            <p>{story}</p>
                        </div>
                        <div className="about-features">
                            {features.map((f, i) => (
                                <div key={i} className="about-feature">
                                    <div className="about-feature-dot" />
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;