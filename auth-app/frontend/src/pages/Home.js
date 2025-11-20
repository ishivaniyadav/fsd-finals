import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h2>Welcome to Homepage</h2>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
