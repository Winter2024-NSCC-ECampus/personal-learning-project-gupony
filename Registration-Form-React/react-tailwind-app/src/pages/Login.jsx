import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (loginEmail === storedEmail && loginPassword === storedPassword) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-blue-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50 placeholder-gray-500"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-blue-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50 placeholder-gray-500"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-blue-500 mt-4">
          Don’t have an account?{" "}
          <a href="/" className="text-pink-500 font-bold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
