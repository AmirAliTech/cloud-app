import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SideComponent from "./SideComponent";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignInComponent = () => {
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the data?')) {
      setSigninData({
        email: "",
        password: "",
      });
      toast.success('Data Reset Successfully');
    }
  };

  const handleChange = (e) => {
    setSigninData({
      ...signinData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`https://public.lazybluffer.online/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;

        if (token) {
          localStorage.setItem("token", token);
          navigate('/find');
          toast.success('Login Successfully')
          
        }
      } else {
        const errorData = await response.json(); 
        console.error("Failed to login:", errorData.message);
        toast.error(errorData.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred while logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideComponent />
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            className="form-control border border-1"
            onChange={handleChange}
            value={signinData.email}
            required
          />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            className="form-control border border-1"
            onChange={handleChange}
            value={signinData.password}
          />
          <br />
          <button type="submit" className="btn btn-primary my-2" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button type="button" className="btn btn-danger mx-2" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>
    </>
  );
};

export default SignInComponent;
