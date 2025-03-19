import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    if (!storedName || !storedEmail) {
      alert("No user data found. Please log in first.");
      navigate("/login");
    } else {
      setUserName(storedName);
      setUserEmail(storedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const parentDarkClass = darkMode ? "dark" : "";

  const baseContainerClasses =
    "min-h-screen w-full flex flex-col items-center p-8 transition-colors duration-300";

  const finalContainerClasses = darkMode
    ? "bg-gray-800 text-gray-100"
    : "bg-pink-100 text-gray-800";

  return (
    <div
      className={`${parentDarkClass} ${finalContainerClasses} ${baseContainerClasses}`}
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        Welcome, {userName}!
      </h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <div
          className="flex-1 bg-white dark:bg-gray-700 dark:text-gray-200 
                     p-6 rounded-md shadow-md border border-blue-200"
        >
          <h2 className="text-2xl font-semibold mb-4">Your Info</h2>
          <p className="text-lg mb-2">Name: {userName}</p>
          <p className="text-lg mb-4">Email: {userEmail}</p>

          <button
            onClick={handleLogout}
            className="bg-pink-400 text-white py-2 px-4 rounded hover:bg-pink-500
                       shadow-md transition-colors duration-300 w-full mt-4"
          >
            Logout
          </button>
        </div>

        <div
          className="flex-1 bg-white dark:bg-gray-700 dark:text-gray-200 
                     p-6 rounded-md shadow-md border border-blue-200"
        >
          <h2 className="text-2xl font-semibold mb-4">React Counter</h2>
          <p className="text-lg mb-2">Current Count: {count}</p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500
                       transition-colors duration-300 mt-2"
          >
            Increment
          </button>
        </div>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mt-8 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700
                   transition-colors duration-300"
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </div>
  );
}

export default Dashboard;
