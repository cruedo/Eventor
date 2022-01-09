import axios from "axios"
import { useEffect } from "react"
import { Navigate } from "react-router"
import { updateAuth } from "../features/auth"
import { useDispatch } from "react-redux"

export default function Login() {
    const dispatch = useDispatch()
    
    useEffect(() => {
        axios.post("/logout")
        .then(res => {
            console.log(res.data)
            dispatch(updateAuth(false))
        })
        .catch(err => {
            console.log(err)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Navigate to="/login" />
    )
}