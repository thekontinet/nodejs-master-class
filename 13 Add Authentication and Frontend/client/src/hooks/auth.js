import axios from "../lib/axios"
import { useEffect, useState } from "react"

function useAuth(){
    const [user, setUser] = useState(null)
    useEffect(function(){
        axios.get('/users').then(response => setUser(response.data))
    }, [])

    return {user}
}


export default useAuth