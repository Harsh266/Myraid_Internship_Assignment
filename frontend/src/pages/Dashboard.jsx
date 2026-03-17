import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import TaskChart from "../components/TaskChart";
import ProgressCircle from "../components/ProgressCircle";
import { Search, Plus, ArrowUpRight, ListTodo, CheckCircle, Clock, Circle } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [user, setUser] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        params: { search, status: filterStatus },
      });
      setTasks(res.data.tasks);
    } catch {
      navigate("/login");
    }
  };

  const fetchStats = async () => {
    const res = await api.get("/tasks/stats");
    setStats(res.data.data);
  };

  const fetchUser = async () => {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
    fetchUser();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTasks();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, filterStatus]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setForm({ title: "", description: "", status: "pending" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditingId(task._id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title) return;

    if (editingId) {
      await api.put(`/tasks/${editingId}`, form);
    } else {
      await api.post("/tasks", form);
    }

    setShowModal(false);
    fetchTasks();
    fetchStats();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
    fetchStats();
  };

  const completeTask = async (task) => {
    if (task.status === "completed") return;

    await api.put(`/tasks/${task._id}`, {
      status: "completed",
    });

    fetchTasks();
    fetchStats();
  };

const logout = async () => {
  try {
    await api.post("/auth/logout");

    toast.success("Logged out successfully");

    navigate("/login");
  } catch (err) {
    toast.error("Logout failed");
  }
};
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} logout={logout} />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Plan, prioritize, and accomplish your tasks with ease.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openAdd}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all"
              data-testid="add-project-btn"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 rounded-full p-2">
              <ListTodo size={20} />
            </div>

            <p className="text-emerald-100 text-sm mb-2">Total Tasks</p>
            <h2 className="text-5xl font-bold mb-3">{stats.totalTasks || 0}</h2>

            <div className="flex items-center gap-2 text-emerald-100 text-xs">
              <ArrowUpRight size={14} />
              <span>All tasks overview</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="absolute top-4 right-4 bg-green-100 rounded-full p-2">
              <CheckCircle size={20} className="text-green-600" />
            </div>

            <p className="text-gray-600 text-sm mb-2">Completed Tasks</p>
            <h2 className="text-5xl font-bold text-gray-900 mb-3">
              {stats.completedTasks || 0}
            </h2>

            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <ArrowUpRight size={14} />
              <span>Tasks successfully done</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="absolute top-4 right-4 bg-yellow-100 rounded-full p-2">
              <Clock size={20} className="text-yellow-600" />
            </div>

            <p className="text-gray-600 text-sm mb-2">Pending Tasks</p>
            <h2 className="text-5xl font-bold text-gray-900 mb-3">
              {stats.pendingTasks || 0}
            </h2>

            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <ArrowUpRight size={14} />
              <span>Tasks yet to complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <TaskChart data={stats.last7Days || []} />
          <ProgressCircle percent={Number(stats.completionRatio || 0)} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                data-testid="search-input"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              data-testid="filter-status"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          data-testid="tasks-list"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Projects</h3>
            <button
              onClick={openAdd}
              className="text-emerald-700 hover:text-emerald-800 font-medium text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              New
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No tasks found. Create your first task!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0"
                  data-testid={`task-item-${task._id}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        task.status === "completed"
                          ? "bg-emerald-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <Circle
                        size={20}
                        className={
                          task.status === "completed"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                        fill="currentColor"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {task.description}
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {task.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={task.status === "completed"}
                      onClick={() => completeTask(task)}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      data-testid={`complete-btn-${task._id}`}
                    >
                      Done
                    </button>

                    <button
                      onClick={() => openEdit(task)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      data-testid={`edit-btn-${task._id}`}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      data-testid={`delete-btn-${task._id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          data-testid="task-modal"
        >
          <div className="bg-white p-8 rounded-2xl w-[480px] shadow-2xl">
            <h3 className="mb-6 font-bold text-2xl text-gray-900">
              {editingId ? "Edit Task" : "Add New Task"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  data-testid="task-title-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  data-testid="task-description-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={form.status === "completed"}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-gray-100"
                  data-testid="task-status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all"
                data-testid="cancel-btn"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-medium transition-all"
                data-testid="save-btn"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
