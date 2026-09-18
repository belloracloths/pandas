import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HeroSlide from '@/lib/models/HeroSlide';
import { requireAuth } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
    try {
        await requireAuth();
        await dbConnect();
        
        const { id } = await params;
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        
        const existingItem = await HeroSlide.findById(id);
        if(!existingItem) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        // Handle file upload if present
        const file = formData.get('image');
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            data.imageUrl = await uploadToCloudinary(buffer);
            if (existingitem.imageUrlUrl) await deleteFromCloudinary(existingitem.imageUrlUrl);
        } else if (typeof file === 'string') {
            data.imageUrl = file;
        }

        const updatedItem = await HeroSlide.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(updatedItem);
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await requireAuth();
        await dbConnect();
        
        const { id } = await params;
        const item = await HeroSlide.findById(id);
        
        if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
        
        if (item.imageUrl) {
            await deleteFromCloudinary(item.imageUrl);
        }
        
        await HeroSlide.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
