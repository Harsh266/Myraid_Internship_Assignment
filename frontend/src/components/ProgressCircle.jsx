export default function ProgressCircle({ percent = 0 }) {
    const safePercent = Math.min(Math.max(Number(percent) || 0, 0), 100);

    const radius = 70;
    const stroke = 16;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;

    const offset = circumference - (safePercent / 100) * circumference;

    const getStatus = () => {
        if (safePercent === 100) return "Completed";
        if (safePercent > 0) return "In Progress";
        return "Not Started";
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Project Progress
            </h3>

            <div className="flex items-center justify-center">
                <div className="relative">

                    <svg width="200" height="200" className="-rotate-90">

                        <circle
                            cx="100"
                            cy="100"
                            r={normalizedRadius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth={stroke}
                        />

                        <circle
                            cx="100"
                            cy="100"
                            r={normalizedRadius}
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth={stroke}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out drop-shadow-sm"
                        />

                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                            {safePercent}%
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                            {getStatus()}
                        </span>
                    </div>

                </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-600">Not Started</span>
                </div>
            </div>
        </div>
    );
}