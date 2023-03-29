import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const Register = () => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const redirect = useNavigate();

  const handleSubmit = function (e) {
    e.preventDefault();

    name =
      typeof name === "string" && name.trim().length > 0 ? name.trim() : false;
    email =
      typeof email === "string" && email.trim().length > 0
        ? email.trim()
        : false;
    phone =
      typeof phone === "string" && phone.trim().length > 0
        ? phone.trim()
        : false;
    password =
      typeof password === "string" && password.trim().length > 0
        ? password.trim()
        : false;

    if ((name && email && phone && password) === false) {
      return setError("Please provide valid information");
    }

    axios
      .post("/users", { name, email, phone, password })
      .then((response) => {
        alert("Account created");
        redirect("/login");
      })
      .catch((err) => alert(err.response.data.error));
  };

  return (
    <div>
      <div>{error}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

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

        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;
