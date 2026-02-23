"use client";

import { useEffect, useState } from "react";

/**
 * A hook that returns a debounced version of the provided value.
 * Useful for debouncing search inputs before triggering API calls.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
