const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    uberLink: { type: String },
    pickMeLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
