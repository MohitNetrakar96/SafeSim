export function SkeletonCard() {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="animate-pulse">
                <div className="h-12 bg-gray-200"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-gray-200">
                        <div className="h-16 bg-gray-50 p-4 flex gap-4">
                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonList() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="animate-pulse space-y-2">
            {[...Array(lines)].map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-gray-200 rounded"
                    style={{ width: `${100 - i * 10}%` }}
                ></div>
            ))}
        </div>
    );
}

export function SkeletonButton() {
    return (
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
    );
}

interface SkeletonProps {
    variant?: 'card' | 'table' | 'list' | 'text' | 'button';
    lines?: number;
}

export function Skeleton({ variant = 'card', lines }: SkeletonProps) {
    switch (variant) {
        case 'table':
            return <SkeletonTable />;
        case 'list':
            return <SkeletonList />;
        case 'text':
            return <SkeletonText lines={lines} />;
        case 'button':
            return <SkeletonButton />;
        default:
            return <SkeletonCard />;
    }
}
