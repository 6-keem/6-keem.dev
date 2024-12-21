import { NextRequest } from "next/server";
import BlogBadge from "./Badge";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const width = searchParams.get("width") ?? "450";
    const height = searchParams.get("height") ?? "130";

    const badge = await BlogBadge({ width, height });
    return new Response(badge, {
        status: 200,
        headers: {
            "Content-Type": "image/svg+xml",
        },
    });
}
