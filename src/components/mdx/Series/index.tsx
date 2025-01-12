import Image from "next/image";
import SeriesList from "./SeriesList";
import { Post } from "@/config/types";

export default async function Series({ seriesName, slug, posts }: { seriesName: string; slug: string; posts: Post[] }) {
    return (
        <div className="relative p-2 pt-0 rounded-md px-6 text-secondary-foreground bg-secondary">
            <div className="flex justify-between items-center flex-wrap">
                <p className="pt-6 mb-2 m-0 text-xl font-semibold pr-10">{seriesName}</p>
                <div className="absolute top-0 right-6 md:right-8">
                    <Image
                        src="/series.svg"
                        alt="Series bookmark"
                        width={28}
                        height={42}
                        className="w-[26px] h-[39px] md:w-[28px] md:h-[42px] p-0 m-0"
                    />
                </div>
            </div>
            <SeriesList slug={slug} seriesList={posts} />
        </div>
    );
}
