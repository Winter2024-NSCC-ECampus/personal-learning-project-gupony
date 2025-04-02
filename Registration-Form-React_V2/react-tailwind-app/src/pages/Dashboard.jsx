import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const [darkMode, setDarkMode] = useState(false);

  // Weather
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);

  // To-dos
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");

    if (!storedId || !storedName || !storedEmail) {
      alert("No user data found. Please log in first.");
      navigate("/login");
      return;
    }

    setUserId(parseInt(storedId, 10));
    setUserName(storedName);
    setUserEmail(storedEmail);

    fetchTodos(parseInt(storedId, 10));

    fetchWeather(city);
  }, [navigate]);

  //  WEATHER
  const fetchWeather = async (theCity) => {
    try {
      const resp = await fetch(
        `http://localhost:3001/api/weather?city=${theCity}`
      );
      if (!resp.ok) {
        const errData = await resp.json();
        alert(errData.error || "Weather fetch error");
        return;
      }
      const data = await resp.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Weather error:", err);
      alert("Failed to fetch weather (check console for details).");
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      alert("Please enter a city name");
      return;
    }
    fetchWeather(city);
  };

  //  TODOS
  const fetchTodos = async (uId) => {
    try {
      const resp = await fetch(`http://localhost:3001/api/todos/${uId}`);
      if (!resp.ok) {
        console.error("Fetch todos error: response not ok");
        return;
      }
      const data = await resp.json();
      setTodos(data);
    } catch (err) {
      console.error("Fetch todos error:", err);
    }
  };

  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    try {
      const resp = await fetch("http://localhost:3001/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: newTodoText }),
      });
      if (resp.ok) {
        alert("Todo added!");
        setNewTodoText("");
        fetchTodos(userId);
      } else {
        const d = await resp.json();
        alert(d.error || "Failed to add todo.");
      }
    } catch (err) {
      console.error("Add todo error:", err);
    }
  };

  const toggleTodo = async (todoId, currentCompleted) => {
    try {
      const resp = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      if (resp.ok) {
        fetchTodos(userId);
      } else {
        alert("Failed to update todo.");
      }
    } catch (err) {
      console.error("Toggle todo error:", err);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const resp = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        fetchTodos(userId);
      } else {
        alert("Failed to delete todo.");
      }
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Dark mode classes
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

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <div className="flex-1 bg-white dark:bg-gray-700 dark:text-gray-200 p-6 rounded-md shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold mb-4">Your Info</h2>
          <p className="text-lg mb-2">Name: {userName}</p>
          <p className="text-lg mb-2">Email: {userEmail}</p>
          <button
            onClick={handleLogout}
            className="bg-pink-400 text-white py-2 px-4 rounded hover:bg-pink-500
                       shadow-md transition-colors duration-300 w-full mt-4"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-700 dark:text-gray-200 p-6 rounded-md shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold mb-4">Weather</h2>
          <form onSubmit={handleCitySearch} className="mb-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="p-2 border border-blue-300 rounded-lg dark:bg-gray-600"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500
                         transition-colors duration-300"
            >
              Search
            </button>
          </form>
          {weatherData ? (
            <div>
              <p className="text-lg mb-2">
                {weatherData.name}, {weatherData.sys?.country}
              </p>
              <p className="text-md">
                Temp: {weatherData.main?.temp} °C,{" "}
                {weatherData.weather?.[0].description}
              </p>
            </div>
          ) : (
            <p>No weather data yet.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mt-6">
        <CounterBox darkMode={darkMode} />

        <div className="flex-1 bg-white dark:bg-gray-700 dark:text-gray-200 p-6 rounded-md shadow-md border border-blue-200">
          <h2 className="text-2xl font-semibold mb-4">Your To-Do List</h2>

          <div className="mb-4 flex">
            <input
              type="text"
              className="flex-1 p-2 border border-blue-300 rounded-l-lg dark:bg-gray-600"
              placeholder="Enter new todo"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <button
              onClick={addTodo}
              className="bg-blue-400 text-white p-2 rounded-r-lg hover:bg-blue-500 transition"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {todos.map((td) => (
              <li
                key={td.id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-600 p-2 rounded"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={td.completed}
                    onChange={() => toggleTodo(td.id, td.completed)}
                    className="mr-2"
                  />
                  <span className={td.completed ? "line-through" : ""}>
                    {td.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(td.id)}
                  className="text-red-500 font-bold ml-4"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
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

function CounterBox({ darkMode }) {
  const [count, setCount] = useState(0);
  return (
    <div
      className={`flex-1 ${
        darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
      } p-6 rounded-md shadow-md border border-blue-200`}
    >
      <h2 className="text-2xl font-semibold mb-4">React Counter</h2>
      <p className="text-lg mb-2">Current Count: {count}</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500
                   transition-colors duration-300 mt-2"
      >
        Increment
      </button>
    </div>
  );
}

export default Dashboard;
