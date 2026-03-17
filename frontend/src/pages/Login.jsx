import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import api from "../api/api";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/auth/login", form);

            alert("Login successful ✅");
            navigate("/dashboard");

        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-gray-50 to-emerald-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
                    data-testid="login-form"
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        Login to your account
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                size={20} 
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                                data-testid="email-input"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                size={20} 
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                                data-testid="password-input"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                        data-testid="login-button"
                    >
                        {loading ? (
                            "Logging in..."
                        ) : (
                            <>
                                Login
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">
                                Don't have an account?
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-all"
                        data-testid="register-link"
                    >
                        Create an account
                    </button>
                </form>
            </div>
        </div>
    );
}