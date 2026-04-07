import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../context/userContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "AI Chat | Sign up";

    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const formFields = useMemo(
    () => [
      {
        id: "userName",
        type: "text",
        placeholder: "Enter your username",
        value: userName,
        onChange: (e) => setUserName(e.target.value),
      },
      {
        id: "email",
        type: "email",
        placeholder: "Enter your email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
      },
      {
        id: "password",
        type: showPassword ? "text" : "password",
        placeholder: "Enter your password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
      },
    ],
    [email, password, userName, showPassword]
  );

  const signupUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!userName || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/signup",
        {
          userName,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setUser(response.data.user ?? null);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#1E1E1E] text-white relative">
     

      <form
        className="bg-[#202123] lg:h-[520px] lg:w-[420px] absolute top-[15%] ml-[25%] lg:ml-[38%] rounded-lg flex flex-col pt-10 items-center gap-4 h-auto w-[240px] p-4"
        onSubmit={signupUser}
      >
        <div className="text-center">
          <h1 className="lg:text-5xl text-2xl font-bold lg:pb-8 pb-2">Sign up</h1>
          <p className="text-sm text-slate-400">Create your AI chat account</p>
        </div>

        {success && <p className="text-green-400 text-sm">{success}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {formFields.map((field) => (
          <div key={field.id} className="w-full flex flex-col items-center gap-2">
            <input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              className="bg-white text-[12px] lg:text-[15px] rounded-lg lg:w-72 lg:h-10 p-3 border-neutral-50 h-[38px] w-full text-black"
              value={field.value}
              onChange={field.onChange}
            />
            {field.id === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs text-blue-300 hover:text-blue-200 self-end pr-3"
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 lg:w-72 lg:h-10 rounded-xl font-medium mt-2 cursor-pointer hover:bg-blue-400 h-10 w-full text-[12px] lg:text-[15px] disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="lg:text-sm text-[11px] text-slate-300">
          Already have an account?
          <Link to={'/login'} className="text-blue-400 cursor-pointer ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
