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
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
);

const DEFAULTS = {
    subtitle: 'Limited Time Offer',
    title: 'Fresh Homemade Burgers Weekly!',
    content: 'Stay tuned for our upcoming limited time specials. Pure, home-style goodness coming your way.'
};

const ManageOffers = ({ type }) => {
    const showToast = (msg, type) => alert(msg);
    const [offers, setOffers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        title: '', subtitle: '', content: '', price: '', image: null, uberLink: '', pickMeLink: ''
    });

    const API_URL = '/api/offers';
    const isLimited = type === 'Limited Time';

    useEffect(() => { fetchOffers(); }, [type]);

    useEffect(() => {
        if (isLimited && offers.length > 0) {
            const c = offers[0];
            setFormData({ title: c.title || DEFAULTS.title, subtitle: c.subtitle || DEFAULTS.subtitle, content: c.content || DEFAULTS.content, price: c.price || '', image: null, uberLink: c.uberLink || '', pickMeLink: '' });
            setPreviewUrl(c.imageUrl);
        } else if (isLimited) {
            setFormData({ title: DEFAULTS.title, subtitle: DEFAULTS.subtitle, content: DEFAULTS.content, price: '', image: null, uberLink: '', pickMeLink: '' });
            setPreviewUrl(null);
        }
    }, [offers, isLimited]);

    const fetchOffers = async () => {
        try {
            const res = await axios.get(API_URL);
            setOffers(res.data.filter(o => o.type === type));
        } catch (err) { console.error(err); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setFormData(f => ({ ...f, image: file })); setPreviewUrl(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        const data = new FormData();
        data.append('title', formData.title || '');
        data.append('subtitle', formData.subtitle || '');
        data.append('content', formData.content || '');
        data.append('price', formData.price || '');
        data.append('type', type);
        data.append('uberLink', formData.uberLink || '');
        data.append('pickMeLink', formData.pickMeLink || '');
        if (formData.image) data.append('image', formData.image);

        try {
            if (isLimited && offers.length > 0) {
                await axios.put(`${API_URL}/${offers[0]._id}`, data);
            } else if (editingOffer) {
                await axios.put(`${API_URL}/${editingOffer._id}`, data);
            } else {
                await axios.post(API_URL, data);
            }
            setIsModalOpen(false);
            setEditingOffer(null);
            fetchOffers();
            showToast('Offer saved successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to save offer.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this offer?')) {
            try { await axios.delete(`${API_URL}/${id}`); fetchOffers(); showToast('Deleted.', 'success'); }
            catch { showToast('Failed to delete.', 'error'); }
        }
    };

    const openModal = (offer = null) => {
        setEditingOffer(offer);
        if (offer) {
            setFormData({ title: offer.title || '', subtitle: offer.subtitle || '', content: offer.content || '', price: offer.price || '', image: null, uberLink: offer.uberLink || '', pickMeLink: offer.pickMeLink || '' });
            setPreviewUrl(offer.imageUrl);
        } else {
            setFormData({ title: '', subtitle: '', content: '', price: '', image: null, uberLink: '', pickMeLink: '' });
            setPreviewUrl(null);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>{isLimited ? 'Limited Time Offer' : 'Special Offers'} {!isLimited && <span className="admin-count-badge">{offers.length} offers</span>}</h1>
                {!isLimited && <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>+ Add New Offer</button>}
            </div>

            {isLimited ? (
                <div className="admin-card" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                            <div className="admin-form-group">
                                <label>Small Heading</label>
                                <input type="text" value={formData.subtitle} placeholder={DEFAULTS.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Main Title</label>
                                <input type="text" required value={formData.title} placeholder={DEFAULTS.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea required rows="4" value={formData.content} placeholder={DEFAULTS.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Order Now Link</label>
                                <input type="text" value={formData.uberLink} placeholder="https://..." onChange={(e) => setFormData({ ...formData, uberLink: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Offer Image</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading} style={{ flex: 1 }}>
                                    {isUploading ? <><span className="spinner"></span>Saving...</> : 'Save Changes'}
                                </button>
                                {offers.length > 0 && (
                                    <button type="button" className="admin-btn-icon delete" style={{ width: 'auto', padding: '0 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600' }} onClick={() => handleDelete(offers[0]._id)}>
                                        <DeleteIcon /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                        <div style={{ width: '360px', height: '220px', flexShrink: 0 }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', transform: 'rotate(3deg)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '4px solid white', background: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {previewUrl
                                    ? <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Image Preview</span>}
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="admin-card">
                    <table className="admin-table">
                        <thead>
                            <tr><th>Product</th><th>Content</th><th>Price</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {offers.map(offer => (
                                <tr key={offer._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <img src={offer.imageUrl} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #F0E6CC' }} />
                                            <div>
                                                <div className="cell-title">{offer.title}</div>
                                                <div className="cell-sub">{offer.subtitle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: '200px' }}>
                                        {offer.content?.length > 60 ? offer.content.slice(0, 60) + '...' : offer.content}
                                    </td>
                                    <td><span className="cell-price">LKR {Number(offer.price || 0).toLocaleString()}</span></td>
                                    <td>
                                        <div className="admin-btn-icon-group">
                                            <button className="admin-btn-icon edit" title="Edit" onClick={() => openModal(offer)}><EditIcon /></button>
                                            <button className="admin-btn-icon delete" title="Delete" onClick={() => handleDelete(offer._id)}><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {offers.length === 0 && (
                        <div className="admin-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                <line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>
                            <div className="admin-empty-text">No special offers yet. Add your first one!</div>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && !isLimited && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group"><label>Title</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Price (LKR)</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Content / Description</label><textarea required rows="3" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Uber Eats Link</label><input type="text" placeholder="https://..." value={formData.uberLink} onChange={(e) => setFormData({ ...formData, uberLink: e.target.value })} /></div>
                            <div className="admin-form-group"><label>PickMe Link</label><input type="text" placeholder="https://..." value={formData.pickMeLink} onChange={(e) => setFormData({ ...formData, pickMeLink: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Image</label><input type="file" accept="image/*" onChange={handleFileChange} /></div>
                            {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }} />}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading} style={{ flex: 1 }}>
                                    {isUploading ? <><span className="spinner"></span>Uploading...</> : (editingOffer ? 'Save Changes' : 'Add Offer')}
                                </button>
                                <button type="button" className="admin-btn" style={{ background: '#F1F5F9', color: '#64748B' }} onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOffers;
