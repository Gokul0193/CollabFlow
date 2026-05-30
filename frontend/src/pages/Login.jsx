import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import AuthButton from "../components/auth/AuthButton";

import useAuth from "../hooks/useAuth";
import { login, getAuthErrorMessage } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {


      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const user = await login(email, password);
      setCurrentUser(user);
      navigate("/");

    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your collaborative journey."
    >
      <form onSubmit={handleLogin} className="space-y-5">

        <InputField
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          label="Email Address"
          required
        />
        <InputField
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          label="Password"
          required
        />

        {error && (
          <div className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        <div className="pt-2 space-y-4">
          <AuthButton
            text="Sign In"
            type="submit"
            onClick={handleLogin}
            loading={loading}
            icon={LogIn}
          />
        </div>

        <p className="text-zinc-500 text-sm text-center pt-2">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;