import { useState } from "react"
import axios from 'axios'

export default function Login() {
    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")

    function handleSubmit(e) {
        alert(1)
        e.preventDefault()
        // MAKE Request here
        let creds = {"username": Username, "password": Password}
        axios.post("/login", creds, {"Content-Type": "application/json"})
        .then(res => {
            console.log(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div>
            <br/><br/><br/><br/>
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