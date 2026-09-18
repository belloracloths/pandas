import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Admin from '@/lib/models/Admin';
import dbConnect from '@/lib/db';

export async function requireAuth() {
    await dbConnect();
    
    const cookieStore = cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
        throw new Error('Unauthorized: No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin) {
            throw new Error('Unauthorized: Admin not found');
        }
        
        return admin;
    } catch (error) {
        throw new Error('Unauthorized: Invalid token');
    }
}
