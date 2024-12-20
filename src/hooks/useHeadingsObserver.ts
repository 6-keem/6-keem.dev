import { useEffect, useRef, useState } from "react";

export const useHeadingsObserver = (query: string) => {
    const observer = useRef<IntersectionObserver>();
    const [activeIdList, setActiveIdList] = useState<string[]>([]);
    const [tempId, setTempId] = useState("");

    useEffect(() => {
        const scrollMarginOption = { rootMargin: "-32px 0px -80px 0px" };

        const handleObserver: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                const targetId = `#${entry.target.id}`;
                if (entry.isIntersecting) {
                    setActiveIdList((prev) => [...prev, targetId]);
                    setTempId(() => "");
                } else {
                    setActiveIdList((prev) => {
                        if (prev.length === 1) setTempId(targetId);
                        return prev.filter((element) => element != targetId);
                    });
                }
            });
        };

        observer.current = new IntersectionObserver(
            handleObserver,
            scrollMarginOption
        );
        const elements = document.querySelectorAll(query);
        elements.forEach((element) => observer.current?.observe(element));

        return () => observer.current?.disconnect();
    }, [query]);

    return [...activeIdList, tempId];
};
