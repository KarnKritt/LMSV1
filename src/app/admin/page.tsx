
// Actually, let's just use standard divs with Tailwind since I haven't installed Shadcn UI separately components yet.

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-gray-500">Welcome back to the Intelligence Control Center.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month' },
                    { title: 'Active Students', value: '+2350', change: '+180.1% from last month' },
                    { title: 'Course Completion', value: '12.5%', change: '+19% from last month' },
                    { title: 'Active Now', value: '+573', change: '+201 since last hour' },
                ].map((item, index) => (
                    <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                        <div className="mt-2 text-2xl font-bold text-gray-900">{item.value}</div>
                        <p className="text-xs text-green-600 mt-1">{item.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Recent Enrollments</h3>
                    <div className="h-[200px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Top Performing Courses</h3>
                    <div className="h-[200px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                        List Placeholder
                    </div>
                </div>
            </div>
        </div>
    )
}
