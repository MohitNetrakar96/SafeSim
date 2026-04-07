import { useCallback } from 'react';

/**
 * Hook to trigger haptic feedback on mobile if supported,
 * and provide visual scale props for buttons.
 */
export function useHaptic() {
    const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    // Props to spread onto motion.button or motion.div
    const hapticProps = {
        whileTap: { scale: 0.97 },
        onTapStart: () => triggerHaptic(5),
    };

    return { triggerHaptic, hapticProps };
}
