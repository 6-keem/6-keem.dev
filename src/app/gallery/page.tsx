import { Gallery } from "@/components/gallery/Gallery";
import { baseDomain, blogName, blogThumbnailURL } from "@/config/const";
import { getPhotoList } from "@/lib/gallery";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const title = `갤러리 | ${blogName}`;
    const url = baseDomain;
    const thumbnailURL = blogThumbnailURL;

    return {
        title,
        openGraph: {
            title,
            url,
            images: [thumbnailURL],
        },
        twitter: {
            title,
            images: [thumbnailURL],
        },
    };
}

export default async function GalleryPage() {
    const photoList = await getPhotoList();
    return <Gallery photoList={photoList} />;
}
