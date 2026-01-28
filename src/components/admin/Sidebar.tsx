
import Link from 'next/link'
import { LayoutDashboard, BookOpen, FileVideo, GraduationCap, Users, Settings } from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/lessons', label: 'Lessons', icon: FileVideo },
    { href: '/admin/quizzes', label: 'Quizzes', icon: GraduationCap },
    { href: '/admin/enrollments', label: 'Enrollments', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
            <div className="p-6">
                <h1 className="text-2xl font-bold">LMS Admin</h1>
                <p className="text-sm text-gray-400">Control Center</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 text-center">
                    v1.0.0 Alpha
                </div>
            </div>
        </aside>
    )
}
