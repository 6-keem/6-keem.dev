import { Photo } from "@/config/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";

export const PhotoPopup = ({
    photo,
    onClose,
}: {
    photo: Photo;
    onClose: () => void;
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageRatio, setImageRatio] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageRatio(img.width / img.height);
            setImageLoaded(true);
            setTimeout(() => setIsOpening(false), 50); // Start opening animation after a short delay
        };
        img.src = photo.thumbnail;

        return () => {
            img.onload = null;
        };
    }, [photo.thumbnail]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Execute onClose after animation ends
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 ${
                isClosing ? "opacity-0" : "opacity-100"
            }`}
        >
            <Card
                className={`w-full w-auto h-auto  overflow-auto bg-zinc-100 dark:bg-zinc-900 transform transition-all duration-300 ${
                    isClosing
                        ? "scale-75 opacity-0"
                        : isOpening
                        ? "scale-90 opacity-0"
                        : "scale-100 opacity-100"
                }`}
            >
                <CardHeader className="p-0 px-4 pt-4 space-y-0">
                    <div className="flex gap-1.5">
                        <button
                            className="w-3 h-3 flex items-center justify-center text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
                            onClick={handleClose}
                        />
                        <button
                            className="w-3 h-3 flex items-center justify-center text-sm font-semibold text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
                            onClick={() => alert("Yellow button clicked")}
                        />
                        <button
                            className="w-3 h-3 flex items-center justify-center text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600"
                            onClick={() =>
                                window.open(photo.thumbnail, "_blank")
                            }
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    {imageLoaded && (
                        <div className="flex justify-center items-center">
                            <img
                                src={photo.thumbnail}
                                alt={photo.title}
                                className={`w-auto h-auto max-w-full max-h-[50vh] object-contain rounded-md transition-all duration-300 ${
                                    isOpening
                                        ? "scale-95 opacity-0"
                                        : "scale-100 opacity-100"
                                }`}
                            />
                        </div>
                    )}
                    <div className="flex flex-wrap mt-3">
                        {photo.tags &&
                            photo.tags.map((tag, index) => (
                                <div
                                    key={tag + index}
                                    className={`
                                    rounded-full px-2 py-1 m-0.5 text-center text-xs transition-colors md:text-sm bg-zinc-200 dark:bg-zinc-800 text-text-selected`}
                                >
                                    <span className="font-medium">{`# ${tag}`}</span>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
