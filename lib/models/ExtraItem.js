const mongoose = require('mongoose');

const extraItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Extras', 'Beverages', 'Sandwiches', 'Submarines']
    },
    imageUrl: { type: String, required: true },
    uberLink: { type: String },
    pickMeLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ExtraItem', extraItemSchema);