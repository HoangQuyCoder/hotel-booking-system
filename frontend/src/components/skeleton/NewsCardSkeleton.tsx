export default function NewsCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative h-56 bg-gray-200 animate-pulse">
                <div className="absolute bottom-4 left-6 w-24 h-6 bg-gray-300 rounded animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                    <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />
                </div>

                {/* Title */}
                <div className="w-4/5 h-7 bg-gray-300 rounded animate-pulse mb-3" />

                {/* Description */}
                <div className="space-y-2 mb-6">
                    <div className="w-full h-4 bg-gray-300 rounded animate-pulse" />
                    <div className="w-11/12 h-4 bg-gray-300 rounded animate-pulse" />
                </div>

                {/* Button */}
                <div className="w-32 h-5 bg-gray-300 rounded animate-pulse" />
            </div>
        </div>
    );
}