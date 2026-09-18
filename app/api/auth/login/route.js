import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export async function POST(req) {
    try {
        await dbConnect();
        
        const body = await req.json();
        const { username, password } = body;

        const admin = await Admin.findOne({ username });

        if (admin && (await admin.matchPassword(password))) {
            const token = generateToken(admin._id);
            
            // Set JWT in HTTP-Only Cookie
            cookies().set({
                name: 'adminToken',
                value: token,
                httpOnly: true,
                path: '/',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            });

            return NextResponse.json({
                _id: admin._id,
                username: admin.username,
                // Still return it for client-side storage if needed, though cookie is preferred
                token: token,
            });
        } else {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
