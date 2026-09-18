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

const ExtraItemManager = ({ category, label, showToast }) => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', subtitle: '', price: '', image: null, uberLink: '', pickMeLink: '' });
    const [isUploading, setIsUploading] = useState(false);
    const API_URL = '/api/extras';

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get(API_URL);
            setItems(res.data.filter(i => i.category === category));
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsUploading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('price', formData.price);
        data.append('category', category);
        data.append('uberLink', formData.uberLink || '');
        data.append('pickMeLink', formData.pickMeLink || '');
        if (formData.image) data.append('image', formData.image);
        try {
            if (editingItem) { await axios.put(`${API_URL}/${editingItem._id}`, data); }
            else { await axios.post(API_URL, data); }
            setIsModalOpen(false); setEditingItem(null);
            setFormData({ title: '', subtitle: '', price: '', image: null, uberLink: '', pickMeLink: '' });
            fetchItems(); showToast('Item saved!', 'success');
        } catch { showToast('Failed to save.', 'error'); } finally { setIsUploading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            try { await axios.delete(`${API_URL}/${id}`); fetchItems(); showToast('Deleted.', 'success'); }
            catch { showToast('Failed to delete.', 'error'); }
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Manage {label} <span className="admin-count-badge">{items.length} items</span></h1>
                <button className="admin-btn admin-btn-primary" onClick={() => { setEditingItem(null); setFormData({ title: '', subtitle: '', price: '', image: null, uberLink: '', pickMeLink: '' }); setIsModalOpen(true); }}>+ Add New Item</button>
            </div>
            <div className="admin-card">
                <table className="admin-table">
                    <thead><tr><th>Product</th><th>Description</th><th>Price</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <img src={item.imageUrl} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #F0E6CC' }} />
                                        <div className="cell-title">{item.title}</div>
                                    </div>
                                </td>
                                <td style={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: '200px' }}>{item.subtitle?.length > 50 ? item.subtitle.slice(0, 50) + '...' : item.subtitle}</td>
                                <td><span className="cell-price">LKR {Number(item.price).toLocaleString()}</span></td>
                                <td>
                                    <div className="admin-btn-icon-group">
                                        <button className="admin-btn-icon edit" title="Edit" onClick={() => { setEditingItem(item); setFormData({ ...item, image: null }); setIsModalOpen(true); }}><EditIcon /></button>
                                        <button className="admin-btn-icon delete" title="Delete" onClick={() => handleDelete(item._id)}><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div className="admin-empty">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/></svg>
                        <div className="admin-empty-text">No {label} yet. Add your first item!</div>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingItem ? `Edit ${label} Item` : `Add New ${label} Item`}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group"><label>Title</label><input type="text" required placeholder="Item name" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Description</label><textarea required rows="3" placeholder="Short description" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Price (LKR)</label><input type="number" required placeholder="e.g. 450" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                            <hr className="admin-form-divider" />
                            <div className="admin-form-group"><label>Uber Eats Link</label><input type="text" placeholder="https://..." value={formData.uberLink || ''} onChange={(e) => setFormData({ ...formData, uberLink: e.target.value })} /></div>
                            <div className="admin-form-group"><label>PickMe Food Link</label><input type="text" placeholder="https://..." value={formData.pickMeLink || ''} onChange={(e) => setFormData({ ...formData, pickMeLink: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Image</label><input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} /></div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading} style={{ flex: 1 }}>{isUploading ? <><span className="spinner"></span>Uploading...</> : (editingItem ? 'Save Changes' : 'Add Item')}</button>
                                <button type="button" className="admin-btn" style={{ background: '#F1F5F9', color: '#64748B' }} onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ManageExtras = () => {
    const showToast = (msg, type) => alert(msg);
    return <ExtraItemManager category="Extras" label="Extras" showToast={showToast} />;
};

export default ManageExtras;
