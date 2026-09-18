const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function init() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Overwriting password to plain text admin123...');
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            await Admin.create({
                username: 'admin',
                password: 'admin123'
            });
            console.log('Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error initializing admin:', error);
        process.exit(1);
    }
}

init();
