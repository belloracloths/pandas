"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const EditIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const DeleteIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
);


const ManageFeedback = () => {
    const showToast = (msg, type) => alert(msg);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [formData, setFormData] = useState({ customerName: '', comment: '', rating: 5 });
    const API_URL = '/api/feedback';
    useEffect(() => { fetchFeedbacks(); }, []);
    const fetchFeedbacks = async () => {
        try { const res = await axios.get(API_URL); setFeedbacks(res.data); }
        catch { setFeedbacks([]); }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFeedback) { await axios.put(`${API_URL}/${editingFeedback._id}`, formData); }
            else { await axios.post(API_URL, formData); }
            setIsModalOpen(false); setEditingFeedback(null); setFormData({ customerName: '', comment: '', rating: 5 });
            fetchFeedbacks(); showToast('Feedback saved!', 'success');
        } catch { showToast('Failed to save.', 'error'); }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Delete this feedback?')) {
            try { await axios.delete(`${API_URL}/${id}`); fetchFeedbacks(); showToast('Deleted.', 'success'); }
            catch { showToast('Failed to delete.', 'error'); }
        }
    };
    const StarRating = ({ rating }) => (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= rating ? '#FFC83D' : '#E2E8F0', fontSize: '1rem' }}>★</span>
            ))}
        </div>
    );
    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Happy Customers <span className="admin-count-badge">{feedbacks.length} reviews</span></h1>
                <button className="admin-btn admin-btn-primary" onClick={() => { setEditingFeedback(null); setFormData({ customerName: '', comment: '', rating: 5 }); setIsModalOpen(true); }}>+ Add Review</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Customer</th><th>Rating</th><th>Comment</th><th>Actions</th></tr></thead>
                    <tbody>
                        {feedbacks.map(fb => (
                            <tr key={fb._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFC83D, #ff8c00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#1C1C2E', fontSize: '0.9rem' }}>
                                            {fb.customerName?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="cell-title">{fb.customerName}</span>
                                    </div>
                                </td>
                                <td><StarRating rating={fb.rating} /></td>
                                <td style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '300px' }}>{fb.comment?.length > 80 ? fb.comment.slice(0, 80) + '...' : fb.comment}</td>
                                <td>
                                    <div className="admin-btn-icon-group">
                                        <button className="admin-btn-icon edit" title="Edit" onClick={() => { setEditingFeedback(fb); setFormData({ customerName: fb.customerName, comment: fb.comment, rating: fb.rating }); setIsModalOpen(true); }}><EditIcon /></button>
                                        <button className="admin-btn-icon delete" title="Delete" onClick={() => handleDelete(fb._id)}><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {feedbacks.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">💬</div><div className="admin-empty-text">No reviews yet.</div></div>}
            </div>
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingFeedback ? 'Edit Review' : 'Add New Review'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group"><label>Customer Name</label><input type="text" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Comment</label><textarea required rows="4" value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Rating (1–5)</label><input type="number" min="1" max="5" required value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} /></div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Save Review</button>
                                <button type="button" className="admin-btn" style={{ background: '#F1F5F9', color: '#64748B' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageFeedback;
