import { useCallback, useState } from 'react';

/**
 * Custom hook to help handle common true/false scenarios
 *
 * @example
 * const [isModalOpen, openModal, closeModal] = useToggle();
 * const [isLoading, setIsLoading, setIsLoaded] = useToggle();
 */
const useToggle = (
    initialValue = false
): [boolean, () => void, () => void, () => void] => {
    const [value, setValue] = useState(initialValue);
    const setToTrue = useCallback(() => setValue(true), []);
    const setToFalse = useCallback(() => setValue(false), []);
    const toggle = useCallback(() => setValue(!value), [value]);

    return [value, setToTrue, setToFalse, toggle];
};

export default useToggle;