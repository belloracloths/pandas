"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, extras: 0, feedback: 0, offers: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const navigate = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, extras, feedback, offers] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/extras'),
                    axios.get('/api/feedback'),
                    axios.get('/api/offers'),
                ]);
                setStats({
                    products: products.data.length,
                    extras: extras.data.length,
                    feedback: feedback.data.length,
                    offers: offers.data.length,
                });
                setRecentProducts(products.data.slice(0, 6));
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    const StatIcons = {
        menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
        extras: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
        review: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
        offer: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    };
    const statCards = [
        { label: 'Menu Items', value: stats.products, icon: StatIcons.menu, color: 'yellow' },
        { label: 'Extras & Sides', value: stats.extras, icon: StatIcons.extras, color: 'blue' },
        { label: 'Customer Reviews', value: stats.feedback, icon: StatIcons.review, color: 'green' },
        { label: 'Active Offers', value: stats.offers, icon: StatIcons.offer, color: 'red' },
    ];

    const QIcons = {
        add: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
        hero: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
        star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
        tag: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
        list: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
        gear: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    };
    const quickActions = [
        { label: 'Add Menu Item', icon: QIcons.add, path: '/aallaa/menu' },
        { label: 'Manage Hero', icon: QIcons.hero, path: '/aallaa/hero' },
        { label: 'View Feedback', icon: QIcons.star, path: '/aallaa/feedback' },
        { label: 'Add Offer', icon: QIcons.tag, path: '/aallaa/limited-offer' },
        { label: 'Manage Extras', icon: QIcons.list, path: '/aallaa/extras' },
        { label: 'Manage Beverages', icon: QIcons.list, path: '/aallaa/beverages' },
        { label: 'Manage Options', icon: QIcons.list, path: '/aallaa/options' },
        { label: 'Special Offers', icon: QIcons.tag, path: '/aallaa/special-offers' },
        { label: 'Settings', icon: QIcons.gear, path: '/aallaa/settings' },
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-greeting">
                <h1>{greeting}, Admin</h1>
                <p>Here's what's happening at Panda's Kitchen today.</p>
            </div>

            <div className="admin-stat-grid">
                {statCards.map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
                        <div>
                            <div className="admin-stat-num">{s.value}</div>
                            <div className="admin-stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="admin-section-header">
                    <span className="admin-section-title">Quick Actions</span>
                </div>
                <div className="admin-quick-grid">
                    {quickActions.map((q, i) => (
                        <div key={i} className="admin-quick-btn" onClick={() => navigate.push(q.path)}>
                            <div className="admin-quick-icon">{q.icon}</div>
                            <span className="admin-quick-label">{q.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {recentProducts.length > 0 && (
                <div>
                    <div className="admin-section-header">
                        <span className="admin-section-title">Recent Menu Items</span>
                        <span className="admin-section-link" onClick={() => navigate.push('/aallaa/menu')}>View All →</span>
                    </div>
                    <div className="admin-mini-grid">
                        {recentProducts.map(p => (
                            <div key={p._id} className="admin-mini-card">
                                <img src={p.imageUrl} alt={p.title} className="admin-mini-img" />
                                <div className="admin-mini-body">
                                    <div className="admin-mini-title">{p.title}</div>
                                    <div className="admin-mini-cat">{p.category}</div>
                                    <div className="admin-mini-price">LKR {Number(p.price).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
