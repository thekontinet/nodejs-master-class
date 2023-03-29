import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const Login = () => {
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const redirect = useNavigate();

  const handleSubmit = function (e) {
    e.preventDefault();

    phone =
      typeof phone === "string" && phone.trim().length > 0
        ? phone.trim()
        : false;
    password =
      typeof password === "string" && password.trim().length > 0
        ? password.trim()
        : false;

    if ((phone && password) === false) {
      return setError("Please provide valid information");
    }

    axios
      .post("/tokens", { phone, password })
      .then((response) => {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        alert("You are Logged in");
        redirect("/");
      })
      .catch((err) => alert(err.response.data.error));
  };

  return (
    <div>
      <div>{error}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
          />
        </div>

        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
