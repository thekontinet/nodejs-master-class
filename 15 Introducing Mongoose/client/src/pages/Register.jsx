import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";
import axios from "../lib/axios";

const Register = () => {
  const { register } = useAuth();
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

    register(name, email, phone, password);
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="card w-full max-w-lg shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create Account</h2>
          <p className="text-sm">Join the active community</p>
          <div>{error}</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                className="input input-bordered w-full"
                type="text"
                name="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <input
                className="input input-bordered w-full"
                type="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                className="input input-bordered w-full"
                type="tel"
                name="phone"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <input
                className="input input-bordered w-full"
                type="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="password"
              />
            </div>

            <button className="btn w-full btn-primary">Register</button>

            <p className="text-sm text-center">
              Already have an account ?{" "}
              <Link className="link" to={"/login"}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
