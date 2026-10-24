"use client";
import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
    return null;
};

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={closePopup}>&times;</button>

                <div className="popup-badge">Special Announcement</div>

                <div className="popup-body">
                    <h2>Panda's Kitchen <br /> Turns 3! 🎉</h2>
                    <p className="announcement-text">
                        In 5 days, we’re celebrating our 3rd anniversary with exciting offers and surprises.
                    </p>
                    <div className="popup-actions">
                        <button className="cta-btn" onClick={closePopup}>View Upcoming Offers</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;
