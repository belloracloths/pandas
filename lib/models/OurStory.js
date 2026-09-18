const mongoose = require('mongoose');

const ourStorySchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('OurStory', ourStorySchema);
