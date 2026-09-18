const mongoose = require('mongoose');

const getInTouchSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    mapUrl: { type: String } // Optional embedded map URL
}, { timestamps: true });

module.exports = mongoose.model('GetInTouch', getInTouchSchema);
