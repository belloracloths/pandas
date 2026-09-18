const fs = require('fs');
const path = require('path');

const generateRoute = (modelName, endpoint) => {
    const apiDir = path.join(__dirname, 'app/api', endpoint);
    const apiIdDir = path.join(apiDir, '[id]');
    
    fs.mkdirSync(apiDir, { recursive: true });
    fs.mkdirSync(apiIdDir, { recursive: true });

    // Collection route (GET all, POST create)
    const collectionRoute = `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ${modelName} from '@/lib/models/${modelName}';
import { requireAuth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(req) {
    await dbConnect();
    try {
        const items = await ${modelName}.find({});
        return NextResponse.json(items);
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await requireAuth();
        await dbConnect();
        
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        
        // Handle file upload if present
        const file = formData.get('image');
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            data.image = await uploadToCloudinary(buffer);
        } else {
            // Check if there is an image URL already passed as string
            if(typeof file === 'string') data.image = file;
        }

        const newItem = new ${modelName}(data);
        const savedItem = await newItem.save();
        return NextResponse.json(savedItem, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
`;

    // ID route (PUT update, DELETE)
    const idRoute = `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ${modelName} from '@/lib/models/${modelName}';
import { requireAuth } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
    try {
        await requireAuth();
        await dbConnect();
        
        const { id } = params;
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        
        const existingItem = await ${modelName}.findById(id);
        if(!existingItem) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        // Handle file upload if present
        const file = formData.get('image');
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            data.image = await uploadToCloudinary(buffer);
            if (existingItem.image) await deleteFromCloudinary(existingItem.image);
        } else if (typeof file === 'string') {
            data.image = file;
        }

        const updatedItem = await ${modelName}.findByIdAndUpdate(id, data, { new: true });
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
        const item = await ${modelName}.findById(id);
        
        if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
        
        if (item.image) {
            await deleteFromCloudinary(item.image);
        }
        
        await ${modelName}.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
`;

    fs.writeFileSync(path.join(apiDir, 'route.js'), collectionRoute);
    fs.writeFileSync(path.join(apiIdDir, 'route.js'), idRoute);
    console.log("Generated API for " + modelName);
};

// Generate standard routes
generateRoute('Product', 'products');
generateRoute('ExtraItem', 'extras');
generateRoute('Offer', 'offers');
generateRoute('HeroSlide', 'hero');

// Feedback requires only GET and POST (public) and DELETE (admin)
const generateFeedback = () => {
    generateRoute('Feedback', 'feedback');
    // Modify Feedback POST to be public
    const routePath = path.join(__dirname, 'app/api/feedback/route.js');
    let content = fs.readFileSync(routePath, 'utf-8');
    content = content.replace('await requireAuth();', '// No auth for posting feedback');
    fs.writeFileSync(routePath, content);
};
generateFeedback();

console.log('API routes generation complete.');
