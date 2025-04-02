import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", loginEmail);

        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Check console.");
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
            className="w-full bg-pink-400 text-white py-2 px-4 rounded hover:bg-pink-500 shadow-md"
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
