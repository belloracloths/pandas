const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    category: {
        type: String,
        required: true,
        enum: ['Picked For You', 'Breakfast Burgers', 'Regular Burgers', 'Ultra Max Burgers']
    },
    imageUrl: { type: String, required: true },
    uberLink: { type: String },
    pickMeLink: { type: String },
    badge: { type: String, default: '' },
    badgeColor: { type: String, default: 'red' },
    bottomBadge: { type: String, default: '' },
    bottomBadgeColor: { type: String, default: 'red' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);