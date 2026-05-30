import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus, AlertCircle, User } from "lucide-react";
import { signup, getAuthErrorMessage } from "../services/authService";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import AuthButton from "../components/auth/AuthButton";
import useAuth from "../hooks/useAuth";
import Select from "../components/auth/Select";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      console.log(role);

      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const user = await signup(name, email, password, role);
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
      title="Create Account"
      subtitle="Start collaborating today and shape the future."
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <InputField
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
          label="Full Name"
          required
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)} label="Role" roles={["Admin", "Frontend Dev", "Backend Dev", "SecOps", "Design", "QA Testing"]} />

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

        <InputField
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
          label="Confirm Password"
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
            text="Get Started"
            type="submit"
            onClick={handleSignup}
            loading={loading}
            icon={UserPlus}
          />
        </div>

        <p className="text-zinc-500 text-sm text-center pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;