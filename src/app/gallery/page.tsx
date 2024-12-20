import GalleryContent from "@/components/gallery/GalleryContent";
import GalleryHeader from "@/components/gallery/GalleryHeader";
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
    return (
        <section className="mx-auto mt-12 w-full px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16">
            <GalleryHeader />
            <GalleryContent photoList={photoList} />
        </section>
    );
}
