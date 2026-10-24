"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hero.css';



const FALLBACK_UBER   = 'https://www.ubereats.com';
const FALLBACK_PICKME = 'https://pickme.lk/food';

const Hero = () => {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await axios.get('/api/hero');
                setSlides(res.data?.length > 0 ? res.data : []);
            } catch {
                setSlides([]);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [slides.length]);

    const getSlideClass = (index) => {
        if (slides.length === 1) return 'carousel-slide active';
        const diff = (index - currentIndex + slides.length) % slides.length;
        if (diff === 0) return 'carousel-slide active';
        if (diff === 1) return 'carousel-slide right';
        if (diff === slides.length - 1) return 'carousel-slide left';
        return 'carousel-slide hidden';
    };

    const currentSlide = slides[currentIndex];
    const uberLink   = currentSlide?.uberLink?.trim()   || FALLBACK_UBER;
    const pickMeLink = currentSlide?.pickMeLink?.trim() || FALLBACK_PICKME;

    return (
        <div className="hero-section">
            <div className="container">
                <div className="hero-layout">
                    {/* Left: Text */}
                    <div className="hero-text">
                        <span className="hero-eyebrow">Fresh &amp; Homemade Daily</span>
                        <h1 className="hero-heading">
                            Crafting Timeless <br />
                            Flavors, One <br />
                            Bite at a Time
                        </h1>
                        <p className="hero-desc">
                            Every burger is made with care, every sauce crafted in-house. Zero artificial flavors. Just delicious, honest goodness.
                        </p>
                        <div className="hero-actions">
                            <button className="hero-partner-btn uber" onClick={() => window.open(uberLink, '_blank')} aria-label="Order on Uber Eats">
                                <img src="/assets/uber.png" alt="Order on Uber Eats" />
                            </button>
                            <button className="hero-partner-btn pickme" onClick={() => window.open(pickMeLink, '_blank')} aria-label="Order on PickMe Food">
                                <img src="/assets/pick_me.png" alt="Order on PickMe Food" />
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div>
                                <span className="hero-stat-num">50+</span>
                                <span className="hero-stat-label">Menu Items</span>
                            </div>
                            <div>
                                <span className="hero-stat-num">4.8★</span>
                                <span className="hero-stat-label">Avg Rating</span>
                            </div>
                            <div>
                                <span className="hero-stat-num">Daily</span>
                                <span className="hero-stat-label">Fresh Made</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Carousel */}
                    <div className="hero-visual">
                        <div className="hero-circle" />
                        <div className="carousel-container">
                            {slides.map((slide, index) => (
                                <div key={slide._id} className={getSlideClass(index)}>
                                    <div
                                        className="carousel-image"
                                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="hero-price-tag">From LKR 800</div>
                    </div>
                </div>
            </div>

            {slides.length > 1 && (
                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Hero;