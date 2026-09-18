import { NextResponse } from 'next/server';

export async function GET() {
    // Return empty string or default contact details so frontend doesn't crash or 404
    return NextResponse.json({
        address: "123 Panda Lane",
        phone: "+94 11 2345 678",
        email: "hello@pandaskitchen.com",
        uberEats: "",
        pickMe: ""
    });
}
