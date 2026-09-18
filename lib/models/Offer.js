const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    price: { type: Number },
    imageUrl: { type: String, required: true },
    type: {
        type: String,
        enum: ['Limited Time', 'Special'],
        required: true
    },
    uberLink: { type: String },
    pickMeLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);