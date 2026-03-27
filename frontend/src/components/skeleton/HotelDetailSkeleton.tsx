export default function HotelDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 animate-pulse">
                {/* Gallery */}
                <div className="h-64 bg-gray-200 rounded mb-6" />

                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-40 bg-gray-200 rounded" />
                        <div className="h-40 bg-gray-200 rounded" />
                        <div className="h-40 bg-gray-200 rounded" />
                    </div>

                    {/* Right */}
                    <div className="space-y-6">
                        <div className="h-40 bg-gray-200 rounded" />
                        <div className="h-40 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}