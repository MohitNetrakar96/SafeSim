import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../DesignSystem';
import { NETWORKS, type Network } from './types';

// --- Network Selector Dropdown ---
interface NetworkSelectorProps {
    selected: Network;
    onSelect: (network: Network) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-slate-400 ml-1 mb-2">Network</label>
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-white hover:border-white/20 transition-colors focus:outline-none"
            >
                <span className="flex items-center gap-2">
                    <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-sm bg-gradient-to-br", selected.color)}>
                        {selected.icon}
                    </span>
                    <span className="font-medium">{selected.name}</span>
                </span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                            className="absolute z-50 mt-2 w-full bg-slate-900 border border-white/10 rounded-lg shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl"
                        >
                            {NETWORKS.map((network) => (
                                <motion.button
                                    key={network.id}
                                    type="button"
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                    onClick={() => {
                                        onSelect(network);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                                        selected.id === network.id ? "text-cyan-400 bg-cyan-400/5" : "text-white"
                                    )}
                                >
                                    <span className={cn("w-7 h-7 rounded-md flex items-center justify-center text-sm bg-gradient-to-br", network.color)}>
                                        {network.icon}
                                    </span>
                                    <div>
                                        <span className="font-medium block">{network.name}</span>
                                        <span className="text-xs text-slate-500">Chain ID: {network.chainId}</span>
                                    </div>
                                    {selected.id === network.id && (
                                        <motion.svg layoutId="network-check" className="w-4 h-4 ml-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- Contract Address Input ---
interface AddressInputProps {
    value: string;
    onChange: (value: string) => void;
    isValidating: boolean;
    isValid: boolean | null;
    ensName: string | null;
    error: string | null;
}

export const AddressInput: React.FC<AddressInputProps> = ({
    value,
    onChange,
    isValidating,
    isValid,
    ensName,
    error,
}) => {
    const shakeVariants = {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        },
        idle: { x: 0 }
    };

    return (
        <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-slate-400 ml-1">
                Contract Address
            </label>
            <motion.div
                variants={shakeVariants}
                animate={error ? "shake" : "idle"}
                className="relative group"
            >
                {/* Glow border */}
                <motion.div
                    className={cn(
                        "absolute -inset-0.5 rounded-lg blur-sm transition duration-300 opacity-0",
                        isValid === true && "bg-gradient-to-r from-emerald-400 to-cyan-400 group-focus-within:opacity-100",
                        isValid === false && "bg-gradient-to-r from-red-400 to-pink-400 group-focus-within:opacity-100",
                        isValid === null && "bg-gradient-to-r from-cyan-400 to-purple-500 group-focus-within:opacity-100 group-hover:opacity-30"
                    )}
                />
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="0x... or vitalik.eth"
                        className={cn(
                            "w-full bg-slate-900 border rounded-lg px-4 py-2.5 pr-12 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-0 transition-all",
                            isValid === true && "border-emerald-500/50",
                            isValid === false && "border-red-500/50",
                            isValid === null && "border-white/10"
                        )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AnimatePresence mode="wait">
                            {isValidating && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <svg className="animate-spin h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </motion.div>
                            )}
                            {!isValidating && isValid === true && (
                                <motion.svg
                                    key="valid"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="h-5 w-5 text-emerald-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </motion.svg>
                            )}
                            {!isValidating && isValid === false && (
                                <motion.svg
                                    key="invalid"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="h-5 w-5 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {ensName && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 ml-1"
                    >
                        <span className="text-xs text-emerald-400">✓ Resolved:</span>
                        <span className="text-xs text-slate-300 font-mono">{ensName}</span>
                    </motion.div>
                )}
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-400 ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- Wallet Display ---
interface WalletDisplayProps {
    address: string;
    isConnected: boolean;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ address, isConnected }) => {
    const truncated = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [address]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
        >
            <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" : "bg-red-400"
            )} />
            <span className="text-sm text-slate-400 hidden md:inline">
                {isConnected ? "Connected:" : "Not Connected"}
            </span>
            {isConnected && (
                <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-mono text-sm text-cyan-400 bg-cyan-400/5 border border-cyan-400/20 rounded-lg px-3 py-1 hover:bg-cyan-400/10 transition-colors"
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                Copied!
                            </motion.span>
                        ) : (
                            <motion.span key="addr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {truncated}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            )}
        </motion.div>
    );
};
