export default function LeaderboardSkeleton() {
    return (
        <div className="max-w-5xl mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
                <div className="h-10 md:h-12 bg-gray-800 w-3/4 mx-auto rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-800 w-1/2 mx-auto rounded-lg mb-2"></div>
                <div className="h-3 bg-gray-800/50 w-1/3 mx-auto rounded-lg"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-[#131d36] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
                <div className="bg-[#0a0f1c] h-14 border-b border-gray-800 flex items-center px-6 gap-8">
                    <div className="h-4 bg-gray-800 w-16 rounded"></div>
                    <div className="h-4 bg-gray-800 w-32 rounded"></div>
                    <div className="h-4 bg-gray-800 w-20 rounded ml-auto"></div>
                </div>

                <div className="p-0">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center px-6 py-5 border-b border-gray-800/50 gap-6">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0"></div>
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 bg-gray-800 rounded-xl flex-shrink-0"></div>
                                <div className="h-5 bg-gray-800 w-48 rounded-lg"></div>
                            </div>
                            <div className="h-6 bg-gray-800 w-24 rounded-lg ml-auto"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Info Skeleton */}
            <div className="mt-8 flex justify-center gap-4">
                <div className="h-10 bg-gray-800 w-32 rounded-xl"></div>
                <div className="h-10 bg-gray-800 w-32 rounded-xl"></div>
            </div>
        </div>
    );
}
