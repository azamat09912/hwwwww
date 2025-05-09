import React, { useState, useEffect } from "react";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [posts, setPosts] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    console.log("Component mounted");

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
          signal: controller.signal,
        });
        const data = await res.json();
        setPosts(data.slice(0, 5));
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error(err);
        }
      }
    };

    fetchData();
    const polling = setInterval(fetchData, 5000);

    return () => {
      console.log("Component unmounted");
      clearInterval(interval);
      clearInterval(polling);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(email && !emailRegex.test(email) ? "Қате email форматы" : "");
    setPasswordError(
      password && password.length < 6 ? "Пароль кемінде 6 символ болу керек" : ""
    );
  }, [email, password]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Live Validation Form</h2>
      <form>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
      </form>

      <h2>API деректері</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>

      <h3>Таймер: {timer} секунд</h3>
    </div>
  );
};

export default App;