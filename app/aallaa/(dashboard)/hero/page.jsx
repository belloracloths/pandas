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


const ManageHero = () => {
    const showToast = (msg, type) => alert(msg);
    const [slides, setSlides] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [formData, setFormData] = useState({ order: 0, image: null });
    const [isUploading, setIsUploading] = useState(false);
    const API_URL = '/api/hero';
    useEffect(() => { fetchSlides(); }, []);
    const fetchSlides = async () => {
        try { const res = await axios.get(API_URL); setSlides(res.data); } catch (err) { console.error(err); }
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); setIsUploading(true);
        const data = new FormData();
        data.append('order', formData.order);
        if (formData.image) data.append('image', formData.image);
        if (formData.uberLink) data.append('uberLink', formData.uberLink);
        if (formData.pickMeLink) data.append('pickMeLink', formData.pickMeLink);
        try {
            if (editingSlide) { await axios.put(`${API_URL}/${editingSlide._id}`, data); }
            else { await axios.post(API_URL, data); }
            setIsModalOpen(false); setEditingSlide(null); setFormData({ order: 0, image: null });
            fetchSlides(); showToast('Slide saved!', 'success');
        } catch { showToast('Failed to save.', 'error'); } finally { setIsUploading(false); }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Delete this slide?')) {
            try { await axios.delete(`${API_URL}/${id}`); fetchSlides(); showToast('Deleted.', 'success'); }
            catch { showToast('Failed to delete.', 'error'); }
        }
    };
    const openEditModal = (slide) => {
        setEditingSlide(slide);
        setFormData({ order: slide.order, image: null, uberLink: slide.uberLink || '', pickMeLink: slide.pickMeLink || '' });
        setIsModalOpen(true);
    };
    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Hero Slider <span className="admin-count-badge">{slides.length} slides</span></h1>
                <button className="admin-btn admin-btn-primary" onClick={() => { setEditingSlide(null); setIsModalOpen(true); }}>+ Add New Slide</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Preview</th><th>Order</th><th>Uber Link</th><th>PickMe Link</th><th>Actions</th></tr></thead>
                    <tbody>
                        {slides.map(slide => (
                            <tr key={slide._id}>
                                <td><img src={slide.imageUrl} alt="" style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #F0E6CC' }} /></td>
                                <td><span className="cell-price" style={{ fontSize: '0.9rem' }}>#{slide.order}</span></td>
                                <td style={{ fontSize: '0.78rem', color: '#94A3B8', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.uberLink || '—'}</td>
                                <td style={{ fontSize: '0.78rem', color: '#94A3B8', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.pickMeLink || '—'}</td>
                                <td>
                                    <div className="admin-btn-icon-group">
                                        <button className="admin-btn-icon edit" title="Edit" onClick={() => openEditModal(slide)}><EditIcon /></button>
                                        <button className="admin-btn-icon delete" title="Delete" onClick={() => handleDelete(slide._id)}><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {slides.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🖼️</div><div className="admin-empty-text">No slides yet. Add your first hero slide!</div></div>}
            </div>
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group"><label>Display Order</label><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Image</label><input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} /></div>
                            <div className="admin-form-group"><label>Uber Eats Link</label><input type="text" value={formData.uberLink || ''} placeholder="https://..." onChange={(e) => setFormData({ ...formData, uberLink: e.target.value })} /></div>
                            <div className="admin-form-group"><label>PickMe Food Link</label><input type="text" value={formData.pickMeLink || ''} placeholder="https://..." onChange={(e) => setFormData({ ...formData, pickMeLink: e.target.value })} /></div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading} style={{ flex: 1 }}>{isUploading ? <><span className="spinner"></span>Uploading...</> : (editingSlide ? 'Save Changes' : 'Add Slide')}</button>
                                <button type="button" className="admin-btn" style={{ background: '#F1F5F9', color: '#64748B' }} onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageHero;
