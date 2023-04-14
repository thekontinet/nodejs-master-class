import Axios from 'axios'

const axios = Axios.create({
    baseURL: "http://localhost:3000",
    headers:{
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
    }
})

const api = {}

api.createAccount = (data) => axios.post("/users", data)
api.login = (data) => axios.post("/tokens", data)
api.logout = () => axios.delete("/tokens")
api.getUser = () => axios.get('/users')
api.getNotes = () => axios.get("/notes")
api.getNote = (id) => axios.get(`/notes/${id}`)
api.createNote = (data) =>  axios.post("/notes", data)
api.updateNote = (data) =>  axios.put(`/notes/${id}`, data)
api.deleteNote = (id) => axios.delete(`/notes/${id}`)
api.likeNote = (id) => axios.post(`/notes/${id}/likes`)
api.postComment = (id, data) => axios.post(`/notes/${id}/comments`, data)

export default api