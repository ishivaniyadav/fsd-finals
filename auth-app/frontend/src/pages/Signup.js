import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create new user
      await axios.post("http://localhost:8080/api/auth/signup", formData);

      // Step 2: Auto login after signup
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Step 3: Store token and redirect
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
