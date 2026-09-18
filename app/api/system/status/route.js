import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../lib/db';

export async function GET() {
    let mongoStatus = 'Disconnected';
    let cloudStatus = 'Not Configured';

    try {
        await dbConnect();
        if (mongoose.connection.readyState === 1) {
            mongoStatus = 'Connected';
        }
    } catch (error) {
        mongoStatus = 'Error';
    }

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        cloudStatus = 'Configured';
    }

    return NextResponse.json({
        mongodb: mongoStatus,
        cloud: cloudStatus
    });
}
