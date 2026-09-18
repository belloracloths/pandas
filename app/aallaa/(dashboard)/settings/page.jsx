"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageSettings = () => {
    const [story, setStory] = useState('');
    const [contact, setContact] = useState({ phone: '', email: '', address: '' });
    const [message, setMessage] = useState('');

    const API_URL = '/api/settings';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const storyRes = await axios.get(`${API_URL}/our-story`);
            setStory(storyRes.data.value);

            const contactRes = await axios.get(`${API_URL}/contact-details`);
            setContact(contactRes.data.value);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStorySave = async () => {
        try {
            await axios.post(API_URL, { key: 'our-story', value: story });
            setMessage('Story updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleContactSave = async () => {
        try {
            await axios.post(API_URL, { key: 'contact-details', value: contact });
            setMessage('Contact details updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Manage Story & Contact</h1>
                {message && <div style={{ color: 'var(--admin-success)', fontWeight: 'bold' }}>{message}</div>}
            </div>

            <div className="admin-card">
                <h2>Our Story</h2>
                <div className="admin-form-group">
                    <label>Story Content</label>
                    <textarea
                        rows="10"
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="Write your brand story here..."
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={handleStorySave}>Save Story</button>
            </div>

            <div className="admin-card">
                <h2>Contact Details</h2>
                <div className="admin-form-group">
                    <label>Phone Number</label>
                    <input type="text" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>Email Address</label>
                    <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>Physical Address</label>
                    <textarea value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={handleContactSave}>Save Contact Details</button>
            </div>
        </div>
    );
};

export default ManageSettings;
