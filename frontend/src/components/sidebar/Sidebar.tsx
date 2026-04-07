import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn } from '../DesignSystem';
import { RiskBadge } from '../warnings/RiskPatterns';
import type { BookmarkedContract, SimulationRecord } from './sidebarTypes';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHaptic } from '../../hooks/useHaptic';

// -----------------------------------------------------------------------------
// Component: Simulation History Item
// -----------------------------------------------------------------------------

interface SimulationHistoryItemProps {
    record: SimulationRecord;
    onReplay: (record: SimulationRecord) => void;
    onDelete: (id: string) => void;
}

const SimulationHistoryItem: React.FC<SimulationHistoryItemProps> = ({ record, onReplay, onDelete }) => {
    const [swiping, setSwiping] = useState(false);
    const { triggerHaptic } = useHaptic();
    const prefersReducedMotion = useReducedMotion();

    const variants = {
        hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: prefersReducedMotion ? 0 : -20 }
    };

    return (
        <motion.div
            layout={!prefersReducedMotion}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag={prefersReducedMotion ? false : "x"}
            dragConstraints={{ left: -100, right: 0 }}
            onDragStart={() => setSwiping(true)}
            onDragEnd={(_, info) => {
                setSwiping(false);
                if (info.offset.x < -80) {
                    triggerHaptic();
                    onDelete(record.id);
                }
            }}
            className="relative group mb-3 last:mb-0"
        >
            {/* Delete background */}
            <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-end pr-4">
                <span className="text-red-400 font-bold text-xs uppercase">Delete</span>
            </div>

            {/* Content */}
            <motion.div
                style={{ x: 0 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                onClick={() => !swiping && onReplay(record)}
                className="relative bg-slate-900 border border-white/5 rounded-lg p-3 cursor-pointer hover:bg-slate-800 transition-colors z-10 min-h-[60px]"
            >
                <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm truncate max-w-[120px]">{record.contractName || 'Unknown Contract'}</span>
                    <RiskBadge level={record.riskLevel} className="scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-cyan-400/80">{record.functionName}()</span>
                    <span>{new Date(record.timestamp).toLocaleDateString()}</span>
                </div>
            </motion.div>
        </motion.div>
    );
};


// -----------------------------------------------------------------------------
// Component: Bookmark Card
// -----------------------------------------------------------------------------

interface BookmarkCardProps {
    bookmark: BookmarkedContract;
    onSelect: (bookmark: BookmarkedContract) => void;
    onRemove: (id: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onSelect, onRemove }) => {
    const prefersReducedMotion = useReducedMotion();
    const { hapticProps, triggerHaptic } = useHaptic();

    return (
        <motion.div
            layout={!prefersReducedMotion}
            initial={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: 0 }}
            className="relative group bg-slate-900 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-colors cursor-pointer min-h-[80px]"
            onClick={() => onSelect(bookmark)}
            whileHover={prefersReducedMotion ? {} : { y: -2 }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 flex items-center justify-center text-lg border border-white/5">
                    ⭐
                </div>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic();
                        onRemove(bookmark.id);
                    }}
                    {...hapticProps}
                    className="text-slate-600 hover:text-red-400 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2"
                >
                    ✕
                </motion.button>
            </div>

            <h4 className="font-bold text-white text-sm mb-1">{bookmark.name}</h4>
            <p className="text-[10px] text-slate-500 font-mono mb-3 truncate">{bookmark.address}</p>

            <div className="flex flex-wrap gap-1">
                {bookmark.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                        #{tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};


// -----------------------------------------------------------------------------
// Component: Sidebar Container
// -----------------------------------------------------------------------------

export interface SidebarProps {
    history: SimulationRecord[];
    bookmarks: BookmarkedContract[];
    onReplay: (record: SimulationRecord) => void;
    onDeleteHistory: (id: string) => void;
    onSelectBookmark: (bookmark: BookmarkedContract) => void;
    onDeleteBookmark: (id: string) => void;
    onAddBookmark: () => void; // Trigger modal for adding current contract
}

const Sidebar: React.FC<SidebarProps> = ({
    history, bookmarks, onReplay, onDeleteHistory, onSelectBookmark, onDeleteBookmark, onAddBookmark
}) => {
    const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');
    // Mobile toggle logic could go here

    // Mobile toggle logic could go here

    return (
        <div className="h-full flex flex-col bg-slate-950/50 backdrop-blur-xl border-l border-white/5 w-full md:w-80 fixed right-0 top-0 bottom-0 z-40 transform transition-transform duration-300 translate-x-full md:translate-x-0 pt-20">

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-4">
                <button
                    onClick={() => setActiveTab('recent')}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'recent' ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-500 hover:text-slate-300"
                    )}
                >
                    Recent
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'saved' ? "border-purple-400 text-purple-400" : "border-transparent text-slate-500 hover:text-slate-300"
                    )}
                >
                    Saved
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'recent' ? (
                        <motion.div
                            key="recent"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-1"
                        >
                            {history.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 text-sm">
                                    No recent simulations.
                                </div>
                            ) : (
                                history.map(record => (
                                    <SimulationHistoryItem
                                        key={record.id}
                                        record={record}
                                        onReplay={onReplay}
                                        onDelete={onDeleteHistory}
                                    />
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="grid grid-cols-1 gap-3"
                        >
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full mb-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10"
                                onClick={onAddBookmark}
                            >
                                + Add Current Contract
                            </Button>

                            {bookmarks.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-xs text-balance">
                                    Star contracts to save them here for quick access.
                                </div>
                            ) : (
                                bookmarks.map(bookmark => (
                                    <BookmarkCard
                                        key={bookmark.id}
                                        bookmark={bookmark}
                                        onSelect={onSelectBookmark}
                                        onRemove={onDeleteBookmark}
                                    />
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Sidebar;
