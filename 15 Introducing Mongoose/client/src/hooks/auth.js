import axios from "../lib/axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

function useAuth(){
    const [user, setUser] = useState(null)

    useEffect(function(){
        fetchUser()
    }, [])

    function fetchUser(){
        axios.get('/users').then(response => setUser(response.data.data))
        .catch(err => false)
    }

    function login(phone, password){
        axios
      .post("/tokens", { phone, password })
      .then((response) => {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        alert("You are Logged in");
        window.location.replace('/')
        fetchUser() 
      })
      .catch((err) => alert(err.response.data.error));
    }


    function register(name, email, phone, password){
        axios
        .post("/users", { name, email, phone, password })
        .then((response) => {
          alert("Account created");
          window.location.replace('/login')
        })
        .catch((err) => alert(err.response.data.error));
    }

    function logout(){
        axios
        .delete("/tokens")
        .then((response) => {
          alert("Logged out");
          window.location.replace('/login')
        })
        .catch((err) => alert(err.response.data.error));
    }

    return {user, login, register, logout}
}


export default useAuth