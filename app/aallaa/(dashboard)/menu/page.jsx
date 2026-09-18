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




const BADGE_COLORS = [
    { value: 'red',    label: 'Red',    bg: '#e74c3c' },
    { value: 'green',  label: 'Green',  bg: '#27ae60' },
    { value: 'blue',   label: 'Blue',   bg: '#2980b9' },
    { value: 'orange', label: 'Orange', bg: '#e67e22' },
    { value: 'purple', label: 'Purple', bg: '#8e44ad' },
    { value: 'gold',   label: 'Gold',   bg: '#f39c12' },
];

const ColorPicker = ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
        {BADGE_COLORS.map(color => (
            <div key={color.value} onClick={() => onChange(color.value)}
                style={{
                    background: color.bg, color: 'white', padding: '6px 14px',
                    borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
                    border: value === color.value ? '3px solid #333' : '3px solid transparent',
                    transition: 'border 0.2s'
                }}>
                {color.label}
            </div>
        ))}
    </div>
);

const ManageMenu = () => {
    const showToast = (msg, type) => alert(msg);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Picked For You');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '', subtitle: '', price: '', originalPrice: '',
        category: 'Breakfast Burgers', image: null,
        uberLink: '', pickMeLink: '',
        badge: '', badgeColor: 'red',
        bottomBadge: '', bottomBadgeColor: 'red'
    });
    const [isUploading, setIsUploading] = useState(false);

    const API_URL = '/api/products';
    const CATEGORIES = ['Picked For You', 'Breakfast Burgers', 'Regular Burgers', 'Ultra Max Burgers'];

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL);
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('price', formData.price);
        data.append('originalPrice', formData.originalPrice || '');
        data.append('category', formData.category);
        data.append('uberLink', formData.uberLink || '');
        data.append('pickMeLink', formData.pickMeLink || '');
        data.append('badge', formData.badge || '');
        data.append('badgeColor', formData.badgeColor || 'red');
        data.append('bottomBadge', formData.bottomBadge || '');
        data.append('bottomBadgeColor', formData.bottomBadgeColor || 'red');
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/${editingProduct._id}`, data);
            } else {
                await axios.post(API_URL, data);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
            showToast('Item saved successfully!', 'success');
        } catch (err) {
            showToast('Failed to save item.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchProducts();
                showToast('Item deleted.', 'success');
            } catch (err) { showToast('Failed to delete.', 'error'); }
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({ ...product, image: null, originalPrice: product.originalPrice || '' });
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p => p.category === activeCategory);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Manage Menu Sections</h1>
                <button className="admin-btn admin-btn-primary" onClick={() => {
                    setEditingProduct(null);
                    setFormData({ title: '', subtitle: '', price: '', originalPrice: '', category: activeCategory, image: null, uberLink: '', pickMeLink: '', badge: '', badgeColor: 'red', bottomBadge: '', bottomBadgeColor: 'red' });
                    setIsModalOpen(true);
                }}>Add New Item</button>
            </div>

            <div className="admin-sub-nav">
                {CATEGORIES.map(cat => (
                    <button key={cat} className={`admin-sub-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
                ))}
            </div>

            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr><th>Image</th><th>Title</th><th>Price</th><th>Orig. Price</th><th>Image Badge</th><th>Bottom Badge</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id}>
                                <td><img src={product.imageUrl} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #F0E6CC' }} /></td>
                                <td>{product.title}</td>
                                <td>LKR {product.price}</td>
                                <td>{product.originalPrice ? <span style={{ textDecoration: 'line-through', color: '#999' }}>LKR {product.originalPrice}</span> : '—'}</td>
                                <td>{product.badge ? <span style={{ background: BADGE_COLORS.find(b => b.value === product.badgeColor)?.bg || '#e74c3c', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{product.badge}</span> : '—'}</td>
                                <td>{product.bottomBadge ? <span style={{ background: BADGE_COLORS.find(b => b.value === product.bottomBadgeColor)?.bg || '#e74c3c', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{product.bottomBadge}</span> : '—'}</td>
                                <td>
                                    <div className="admin-btn-icon-group">
                                        <button className="admin-btn-icon edit" title="Edit" onClick={() => openEditModal(product)}><EditIcon /></button>
                                        <button className="admin-btn-icon delete" title="Delete" onClick={() => handleDelete(product._id)}><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No items in {activeCategory}.</p>}
            </div>

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingProduct ? 'Edit Item' : 'Add New Item'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Title</label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Subtitle / Description</label>
                                <textarea required value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Current Price (LKR)</label>
                                <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Original Price (LKR) <span style={{ color: '#999', fontWeight: 400 }}>(optional — shows as strikethrough)</span></label>
                                <input type="number" placeholder="Leave empty to hide" value={formData.originalPrice || ''} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Category</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <p style={{ fontWeight: '600', marginBottom: '10px' }}>Image Badge <span style={{ color: '#999', fontWeight: 400 }}>(top-left corner of image)</span></p>
                            <div className="admin-form-group">
                                <label>Badge Text</label>
                                <input type="text" placeholder='e.g. "#1 most liked"' value={formData.badge || ''} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Badge Color</label>
                                <ColorPicker value={formData.badgeColor} onChange={(v) => setFormData({ ...formData, badgeColor: v })} />
                            </div>

                            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <p style={{ fontWeight: '600', marginBottom: '10px' }}>Bottom Badge <span style={{ color: '#999', fontWeight: 400 }}>(below price, e.g. "20% off")</span></p>
                            <div className="admin-form-group">
                                <label>Bottom Badge Text</label>
                                <input type="text" placeholder='e.g. "20% off" or "Buy 1 Get 1"' value={formData.bottomBadge || ''} onChange={(e) => setFormData({ ...formData, bottomBadge: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Bottom Badge Color</label>
                                <ColorPicker value={formData.bottomBadgeColor} onChange={(v) => setFormData({ ...formData, bottomBadgeColor: v })} />
                            </div>

                            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <div className="admin-form-group">
                                <label>Uber Eats Link</label>
                                <input type="text" placeholder="https://..." value={formData.uberLink || ''} onChange={(e) => setFormData({ ...formData, uberLink: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>PickMe Food Link</label>
                                <input type="text" placeholder="https://..." value={formData.pickMeLink || ''} onChange={(e) => setFormData({ ...formData, pickMeLink: e.target.value })} />
                            </div>
                            <div className="admin-form-group">
                                <label>Image</label>
                                <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading}>
                                    {isUploading ? <><span className="spinner"></span> Uploading...</> : (editingProduct ? 'Save Changes' : 'Add Item')}
                                </button>
                                <button type="button" className="admin-btn" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMenu;
