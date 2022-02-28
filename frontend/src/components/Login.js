import { useState } from "react"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../features/user"
import { updateAuth } from "../features/auth"
import { Navigate } from "react-router-dom"

export default function Login() {
    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")
    const [Message, setMessage] = useState("")

    const dispatch = useDispatch()
    const User = useSelector((state) => state.user.user)
    const authed = useSelector((state) => state.auth.authed)


    function handleSubmit(e) {
        // alert(1)
        e.preventDefault()
        // MAKE Request here
        let creds = {"username": Username, "password": Password}
        axios.post("/login", creds, {"Content-Type": "application/json"})
        .then(res => {
            setMessage(res.data.message)
            console.log(res.data.data)
            dispatch(updateUser(res.data.data))
            dispatch(updateAuth(true))
        })
        .catch(error => {
            console.log(error)
            setMessage(error.response.data.message)
        })
    }

    if(authed) {
        return (
            <Navigate to="/" />
        )
    }

    return (
        <div>
            <br/><br/><br/><br/>
            <b>{Message}</b>
            {/* <i>{JSON.stringify(User)}</i> */}
            <form onSubmit={handleSubmit}>
                <label>
                    Username <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your email here" 
                    value={Username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    />
                </label>
                <br/>
                <label>
                    Password <br/>
                    <input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={Password} 
                    onChange={e => setPassword(e.target.value)}
                    required/>
                </label>
                <br/>
                <input type="submit"/>
            </form>
        </div>
    )
}