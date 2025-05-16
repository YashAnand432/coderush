import connectDB from "@/database/dbConfig";
import { getUserBySessionToken } from '@/models/userModel';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

connectDB();

export const GET = async (request: NextRequest) => {
    try {
        const token = request.cookies.get(process.env.TOKEN_NAME!)?.value || '';
        
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const user = await getUserBySessionToken(token);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });

    } catch (error) {
        console.error("Error in verifiedUserDetails:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}