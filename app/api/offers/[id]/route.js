import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Offer from '@/lib/models/Offer';
import { requireAuth } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
    try {
        await requireAuth();
        await dbConnect();
        
        const { id } = params;
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        
        const existingItem = await Offer.findById(id);
        if(!existingItem) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        // Handle file upload if present
        const file = formData.get('image');
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            data.imageUrl = await uploadToCloudinary(buffer);
            if (existingItem.image) await deleteFromCloudinary(existingItem.image);
        } else if (typeof file === 'string') {
            data.imageUrl = file;
        }

        const updatedItem = await Offer.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(updatedItem);
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await requireAuth();
        await dbConnect();
        
        const { id } = params;
        const item = await Offer.findById(id);
        
        if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
        
        if (item.image) {
            await deleteFromCloudinary(item.image);
        }
        
        await Offer.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
