import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        content: "Welcome to Panda's Kitchen! We serve the best food in town."
    });
}
