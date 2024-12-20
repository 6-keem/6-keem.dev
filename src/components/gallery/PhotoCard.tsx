import { useState, useEffect } from "react";
import { Photo } from "@/config/types";
import { PhotoPopup } from "./PhotoPopup";
import Image from "next/image";

export const PhotoCard = ({ photo }: { photo: Photo; isVisible: boolean }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    useEffect(() => {
        // Set shouldRender to true after a short delay
        // This ensures the component is mounted before trying to render the image
        const timer = setTimeout(() => setShouldRender(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="break-inside-avoid">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                    <div
                        className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-50"
                        onClick={openModal}
                        style={{ cursor: "pointer" }}
                    ></div>
                    {shouldRender && (
                        <img
                            src={photo.thumbnail}
                            alt={photo.title}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                opacity: isLoaded ? 1 : 0,
                                transition: "opacity 0.5s ease-in-out",
                            }}
                            draggable="false"
                            onLoad={() => setIsLoaded(true)}
                        />
                    )}
                </div>
            </div>

            {isModalOpen && <PhotoPopup photo={photo} onClose={closeModal} />}
        </>
    );
};
