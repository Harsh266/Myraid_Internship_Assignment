import {
  LayoutDashboard,
  CheckSquare,
  LogOut,
  Search
} from "lucide-react";

export default function Sidebar({ user, logout }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center">
          <CheckSquare className="text-white" size={24} />
        </div>
        <span className="text-2xl font-bold text-gray-900">Myraid</span>
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">MENU</p>
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "Username"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "user@email.com"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}