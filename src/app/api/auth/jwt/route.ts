import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { SignJWT } from "jose-cjs";

export async function GET(request: NextRequest) {
  try {
    // 1. Get the session using Better Auth API
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No active Better Auth session" },
        { status: 401 }
      );
    }

    // 2. Extract user details
    const { id, email, role } = session.user;

    // 3. Check for BETTER_AUTH_SECRET
    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Server configuration error - BETTER_AUTH_SECRET is missing" },
        { status: 500 }
      );
    }

    // 4. Sign JWT using jose-cjs
    const secretKey = new TextEncoder().encode(secret);
    const jwt = await new SignJWT({ userId: id, email, role: role || "user" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);

    return NextResponse.json({ success: true, token: jwt });
  } catch (error: any) {
    console.error("Error generating JWT in Next.js API:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
