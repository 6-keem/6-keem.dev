import React, { useState, useEffect, useCallback } from "react";
import { PhotoCard } from "./PhotoCard";
import Masonry from "react-masonry-css";
import { Photo } from "@/config/types";

const GalleryContent = ({ photoList }: { photoList: Photo[] }) => {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const breakpointColumnsObj = {
        default: 5,
        1280: 4,
        1024: 3,
        768: 2,
        640: 1,
    };

    const revealItems = useCallback(() => {
        let timer: NodeJS.Timeout;
        const reveal = (index: number) => {
            if (index < photoList.length) {
                setVisibleItems((prev) => [...prev, index]);
                timer = setTimeout(() => reveal(index + 1), 50);
            } else {
                clearTimeout(timer);
            }
        };
        reveal(0);
        return () => clearTimeout(timer);
    }, [photoList]);

    useEffect(() => {
        setVisibleItems([]); // reset visibility on photoList change
        setIsInitialLoad(true);

        const loadTimer = setTimeout(() => {
            setIsInitialLoad(false);
            revealItems();
        }, 500); // Delay before starting animation

        return () => clearTimeout(loadTimer);
    }, [photoList, revealItems]);

    return (
        <section className="min-h-screen">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto gap-2 md:gap-4"
                columnClassName="bg-clip-padding"
            >
                {photoList.map((photo, index) => (
                    <div
                        key={photo.uniqueKey || index}
                        className={`mb-2 md:mb-4 transition-opacity duration-500 ${
                            visibleItems.includes(index)
                                ? "opacity-100"
                                : "opacity-0"
                        }`}
                    >
                        <PhotoCard
                            photo={photo}
                            isVisible={visibleItems.includes(index)}
                        />
                    </div>
                ))}
            </Masonry>
        </section>
    );
};

export default GalleryContent;
