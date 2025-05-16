import { NextResponse, NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const response = NextResponse.json({
      message: "LogOut Successfully",
      success: true
    });

    response.cookies.set(process.env.TOKEN_NAME!, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/"  // Important for cookie to work across all routes
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};