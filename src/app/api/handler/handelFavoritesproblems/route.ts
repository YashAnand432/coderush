import { NextRequest, NextResponse } from 'next/server'
import connectDB from "@/database/dbConfig";
import { updateUserById } from '@/models/userModel';

connectDB();

interface RequestBody {
    favorite: boolean;
    index: number;
    user: {
        _id: string;
        problemList: Array<{
            favorite?: boolean;
        }>;
    };
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const data = await req.json();
        const { favorite, index, user } = data as RequestBody;

        // Input validation
        if (typeof favorite !== 'boolean' || typeof index !== 'number' || !user?._id) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        const updateObject: Record<string, any> = {};
        updateObject[`problemList.${index}.favorite`] = favorite;

        await updateUserById(user._id, updateObject);

        return NextResponse.json({
            message: favorite ? "Added to favorites" : "Removed from favorites",
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error('Favorite error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}