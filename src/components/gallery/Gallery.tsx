"use client";
import { useEffect, useState } from "react";
import GalleryContent from "./GalleryContent";
import GalleryHeader from "./GalleryHeader";
import { Photo } from "@/config/types";

export type Location = "Recently" | "Universal" | "Japan" | "Europe";

const shuffleArray = (array: Photo[], location?: Location) => {
    const filteredArray = location
        ? array.filter((photo) => photo.location === location)
        : array;

    return filteredArray
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
};

export const Gallery = ({ photoList }: { photoList: Photo[] }) => {
    const [currentLocation, setCurrentLocation] =
        useState<Location>("Universal");
    const [selectedPhotoList, setSelectedPhotoList] = useState<Photo[]>(
        shuffleArray(photoList)
    );

    useEffect(() => {
        if (currentLocation !== "Universal") setCurrentLocation("Universal");
    }, []);

    useEffect(() => {
        const selected =
            currentLocation === "Recently"
                ? photoList.slice(0, 20)
                : shuffleArray(photoList).slice(0, 20);
        setSelectedPhotoList(selected);
    }, [photoList, currentLocation]);

    return (
        <section className="mx-auto mt-12 w-full px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16">
            <GalleryHeader location={currentLocation} />
            <GalleryContent photoList={selectedPhotoList} />
        </section>
    );
};
