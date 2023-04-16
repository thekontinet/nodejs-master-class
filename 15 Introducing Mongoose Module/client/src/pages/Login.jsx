import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";
import axios from "../lib/axios";

const Login = () => {
  const { login } = useAuth();
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");

  const [error, setError] = useState("");

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

    login(phone, password);
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="card w-full max-w-lg shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <p className="text-sm">Enter your credentials to sign in</p>
          <div>{error}</div>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button className="btn w-full btn-primary">Login</button>

            <p className="text-sm text-center">
              Dont have an account ?{" "}
              <Link className="link" to={"/register"}>
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
