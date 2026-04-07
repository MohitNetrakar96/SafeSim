import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Button Component ---
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ComponentProps<typeof motion.button>, "children"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}, ref) => {
    const variants = {
        primary: "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-lg shadow-cyan-400/20",
        secondary: "bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/20",
        danger: "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/20",
        ghost: "bg-transparent text-slate-300 hover:bg-white/5 border border-white/10 hover:border-white/20"
    };

    const sizes = {
        sm: "px-3 py-2 text-xs min-h-[36px]",
        md: "px-5 py-3 text-sm min-h-[44px]",
        lg: "px-7 py-4 text-base min-h-[52px]"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ring-cyan-400 disabled:opacity-50 disabled:pointer-events-none disabled:brightness-75",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : leftIcon ? (
                <span className="mr-2">{leftIcon}</span>
            ) : null}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </motion.button>
    );
});
Button.displayName = "Button";


// --- Card Component ---
interface CardProps extends React.ComponentProps<typeof motion.div> {
    hoverEffect?: boolean;
    children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
    className,
    children,
    hoverEffect = true,
    ...props
}, ref) => {
    return (
        <motion.div
            ref={ref}
            initial={false}
            whileHover={hoverEffect ? { y: -5, scale: 1.01 } : undefined}
            className={cn(
                "glass-card relative overflow-hidden", // using utility from index.css
                className
            )}
            {...props}
        >
            {/* Glow effect on hover */}
            {hoverEffect && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 opacity-0 transition-opacity duration-300 pointer-events-none"
                    whileHover={{ opacity: 1 }}
                />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
});
Card.displayName = "Card";


// --- Input Component ---
interface InputProps extends Omit<React.ComponentProps<typeof motion.input>, "ref"> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    label,
    error,
    id,
    ...props
}, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <div className="w-full space-y-2">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-slate-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm group-hover:opacity-30"
                    layoutId={`input-glow-${inputId}`}
                />
                <motion.input
                    ref={ref}
                    id={inputId}
                    whileFocus={{ scale: 1.01 }}
                    className={cn(
                        "relative w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 focus:border-transparent transition-all shadow-inner",
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
});
Input.displayName = "Input";


// --- Badge Component ---
type BadgeVariant = 'safe' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps extends React.ComponentProps<typeof motion.span> {
    variant?: BadgeVariant;
    children: React.ReactNode;
}

export const Badge = ({
    className,
    variant = 'neutral',
    children,
    ...props
}: BadgeProps) => {
    const variants = {
        safe: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };

    return (
        <motion.span
            whileHover={{ scale: 1.05 }}
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md",
                variants[variant],
                className
            )}
            {...props}
        >
            <span className={cn(
                "w-1.5 h-1.5 rounded-full mr-1.5",
                variant === 'safe' && "bg-emerald-400 shadow-[0_0_5px_theme(colors.emerald.400)]",
                variant === 'warning' && "bg-amber-400 shadow-[0_0_5px_theme(colors.amber.400)]",
                variant === 'danger' && "bg-red-400 shadow-[0_0_5px_theme(colors.red.400)]",
                variant === 'info' && "bg-cyan-400 shadow-[0_0_5px_theme(colors.cyan.400)]",
                variant === 'neutral' && "bg-slate-400"
            )} />
            {children}
        </motion.span>
    );
};
