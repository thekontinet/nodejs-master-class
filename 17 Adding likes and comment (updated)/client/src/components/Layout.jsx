import React from "react";
import useAuth from "../hooks/auth";
import { Link } from "react-router-dom";

function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex justify-center h-screen py-4">
      {!user ? (
        <div className="shadow-xl card w-96 bg-base-100">
          <div className="card-body">
            <h2 className="card-title">NOTE APP</h2>
            <p>Share your ideas and taught with friends</p>
            <div className="justify-end card-actions">
              <>
                <a className="btn" href="/login">
                  Login
                </a>
                <a className="btn btn-primary" href="/register">
                  Register
                </a>
              </>
            </div>
          </div>
        </div>
      ) : null}

      {user && (
        <div className="w-full max-w-xl">
          <header className="flex items-center justify-between px-8 py-4 text-white bg-primary rounded-xl">
            <Link className="font-bold" to={"/"}>
              Welcome {user.name}
            </Link>
            <button className="btn btn-sm" onClick={() => logout()}>
              Logout
            </button>
          </header>
          <div className="my-4">{children}</div>
        </div>
      )}
    </div>
  );
}

export default Layout;
