import { NextRequest } from "next/server";
import BlogBadge from "./Badge";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text") ?? "Default Text";
    const badge = await BlogBadge();
    return new Response(badge, {
        status: 200,
        headers: {
            "Content-Type": "image/svg+xml",
        },
    });
}
