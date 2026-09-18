const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check if model already exists to prevent OverwriteModelError
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function init() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Overwriting password to admin123...');
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash('admin123', salt);
            await existingAdmin.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await Admin.create({
                username: 'admin',
                password: hashedPassword
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
