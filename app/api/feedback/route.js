import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Feedback from '@/lib/models/Feedback';
import { requireAuth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(req) {
    await dbConnect();
    try {
        const items = await Feedback.find({});
        return NextResponse.json(items);
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // No auth for posting feedback
        await dbConnect();
        
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        
        // Handle file upload if present
        const file = formData.get('image');
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            data.imageUrl = await uploadToCloudinary(buffer);
        } else {
            // Check if there is an image URL already passed as string
            if(typeof file === 'string') data.imageUrl = file;
        }

        const newItem = new Feedback(data);
        const savedItem = await newItem.save();
        return NextResponse.json(savedItem, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
