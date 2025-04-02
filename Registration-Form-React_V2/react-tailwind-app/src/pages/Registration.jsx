import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-blue-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50
                         text-gray-800 placeholder-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-blue-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50
                         text-gray-800 placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-blue-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50
                         text-gray-800 placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-blue-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border border-blue-300 rounded-lg bg-blue-50
                         text-gray-800 placeholder-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
