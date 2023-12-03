import { useEffect, useState } from 'react';

const defaultOptions = {
    root: null, // scroll area
    rootMargin: '0px',
    threshold: 1,
};

export const useIsVisible = (targetElement: Element | null, options: IntersectionObserverInit = defaultOptions) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), options);

        if (targetElement) {
            observer.observe(targetElement);
        }

        return () => {
            if (targetElement) {
                observer.unobserve(targetElement);
            }
        };
    }, [targetElement, options]);

    return isVisible;
};
