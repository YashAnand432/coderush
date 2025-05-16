import { NextRequest, NextResponse } from 'next/server'
import connectDB from "@/database/dbConfig";
import { getUserById, updateUserById } from '@/models/userModel';

connectDB();

interface RequestBody {
    solved: boolean;
    problemId: string;
    userId: string;
    index?: number; // Optional index if you know it
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { solved, problemId, userId, index } = await req.json() as RequestBody;

        // Input validation
        if (typeof solved !== 'boolean' || !problemId || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find the problem index if not provided
        const user = await getUserById(userId);
        const problemIndex = index ?? user.problemList.findIndex((p: any) => p._id === problemId);

        if (problemIndex === -1) {
            return NextResponse.json(
                { error: "Problem not found in user's list" },
                { status: 404 }
            );
        }

        // Update the solved status
        const updateObject: Record<string, any> = {};
        updateObject[`problemList.${problemIndex}.solved`] = solved;
        updateObject[`problemList.${problemIndex}.solvedAt`] = solved ? new Date() : null;

        await updateUserById(userId, updateObject);

        // Update total solved count if needed
        if (solved) {
            const solvedCount = user.problemList.filter((p: any) => p.solved).length + 1;
            await updateUserById(userId, { totalSolved: solvedCount });
        }

        return NextResponse.json({
            message: solved ? "Problem marked as solved" : "Problem marked as unsolved",
            success: true,
            solvedAt: solved ? new Date() : null
        }, { status: 200 });

    } catch (error) {
        console.error('Solved problem error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}