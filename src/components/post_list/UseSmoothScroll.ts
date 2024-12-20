import { useEffect, useRef } from "react";

const useSmoothScroll = () => {
    const scrollPositionRef = useRef(0);

    useEffect(() => {
        const handleBeforeUnload = () => {
            scrollPositionRef.current = window.scrollY;
        };

        const handleLoad = () => {
            if (scrollPositionRef.current > 0) {
                window.scrollTo({
                    top: scrollPositionRef.current,
                    behavior: "smooth",
                });
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("load", handleLoad);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("load", handleLoad);
        };
    }, []);
};

// export default useSmoothScroll;
