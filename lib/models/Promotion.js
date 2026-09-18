const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number },
    validUntil: { type: Date },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
