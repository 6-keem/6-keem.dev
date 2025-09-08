import { useEffect, useRef, useState } from 'react';

export const useHeadingsObserver = (query: string, dependency: any[]) => {
  const observer = useRef<IntersectionObserver>();
  const [activeIdList, setActiveIdList] = useState<string[]>([]);
  const [tempId, setTempId] = useState('');

  useEffect(() => {
    setActiveIdList([]);
    setTempId('');

    const scrollMarginOption = { rootMargin: '-32px 0px -80px 0px' };

    const handleObserver: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.target.id) return;

        const targetId = `#${entry.target.id}`;

        if (entry.isIntersecting) {
          setActiveIdList((prev) => [...prev, targetId]);
          setTempId(() => '');
        } else {
          setActiveIdList((prev) => {
            if (prev.length === 1) setTempId(targetId);
            return prev.filter((element) => element != targetId);
          });
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, scrollMarginOption);
    const elements = document.querySelectorAll(query);
    elements.forEach((element) => observer.current?.observe(element));

    return () => observer.current?.disconnect();
  }, [query, dependency]);

  return [...activeIdList, tempId];
};
