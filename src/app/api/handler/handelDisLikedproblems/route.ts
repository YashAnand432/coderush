import { NextRequest, NextResponse } from 'next/server'
import connectDB from "@/database/dbConfig";
import { getUserById, updateUserById } from '@/models/userModel';

connectDB();

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const data = await req.json();
        const { disLike, index, user } = data;

        const updateObject: Record<string, any> = {};
        updateObject[`problemList.${index}.dislike`] = disLike;
        updateObject[`problemList.${index}.like`] = disLike ? false : undefined;
        
        await updateUserById(user._id, updateObject);
        const updatedUser = await getUserById(user._id);

        const dislikedProblems = updatedUser.problemList.filter((problem: any) => problem.dislike === true);
        await updateUserById(user._id, { totalDisLikes: dislikedProblems.length });

        return NextResponse.json({
            message: "DisLiked Successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}