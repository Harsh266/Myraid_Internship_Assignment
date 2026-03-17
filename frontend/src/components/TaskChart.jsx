export default function TaskChart({ data = [] }) {
    const getLast7Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            days.push({
                date: d.toLocaleDateString("en-CA"),
                label: d.toLocaleDateString("en-US", { weekday: "short" })
            });
        }

        return days;
    };

    const days = getLast7Days();

    const formattedData = days.map(day => {
        const found = data.find(d => d._id === day.date);

        return {
            day: day.label,
            count: found ? found.count : 0
        };
    });

    const maxValue = Math.max(...formattedData.map(d => d.count), 1);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Task Analytics (Last 7 Days)
            </h3>

            <div className="flex items-end justify-between h-48 gap-3">
                {formattedData.map((item, index) => {
                    const height = (item.count / maxValue) * 100;
                    const isHighest = item.count === maxValue && item.count > 0;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-3">

                            <div className="relative w-full flex items-end justify-center" style={{ height: "160px" }}>
                                
                                {isHighest && (
                                    <div className="absolute -top-8 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                        {item.count}
                                    </div>
                                )}

                                <div
                                    className={`w-full rounded-full transition-all duration-500 ${
                                        isHighest
                                            ? "bg-gradient-to-t from-emerald-700 to-emerald-500"
                                            : "bg-gradient-to-t from-emerald-300 to-emerald-100"
                                    }`}
                                    style={{
                                        height: `${height}%`,
                                        minHeight: "10px"
                                    }}
                                ></div>
                            </div>

                            <span className="text-sm font-medium text-gray-600">
                                {item.day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}