import { useState } from "react"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../features/user"
import { updateAuth } from "../features/auth"
import { Navigate } from "react-router-dom"

export default function Signup() {
    const [Username, setUsername] = useState("")
    const [Password1, setPassword1] = useState("")
    const [Password2, setPassword2] = useState("")
    const [Email, setEmail] = useState("")
    const [City, setCity] = useState("")
    const [Country, setCountry] = useState("")
    const [Phone, setPhone] = useState("")

    const [Message, setMessage] = useState("")

    const dispatch = useDispatch()
    const User = useSelector((state) => state.user.user)
    const authed = useSelector((state) => state.auth.authed)


    function handleSubmit(e) {
        // alert(1)
        e.preventDefault()
        // MAKE Request here
        let creds = {
            "username": Username, 
            "password1": Password1,
            "password2": Password2,
            "email": Email,
            "city": City,
            "country": Country,
            "phone": Phone,
        }
        axios.post("/signup", creds, {"Content-Type": "application/json"})
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
                    placeholder="Username" 
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
                    value={Password1} 
                    onChange={e => setPassword1(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Re-type Password <br/>
                    <input 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={Password2} 
                    onChange={e => setPassword2(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Email <br/>
                    <input 
                    type="email" 
                    placeholder="Email" 
                    value={Email} 
                    onChange={e => setEmail(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    City <br/>
                    <input 
                    type="text" 
                    placeholder="City" 
                    value={City} 
                    onChange={e => setCity(e.target.value)}
                    />
                </label>
                <br/>

                <label>
                    Country <br/>
                    <input 
                    type="text" 
                    placeholder="Country" 
                    value={Country} 
                    onChange={e => setCountry(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Phone <br/>
                    <input 
                    type="text" 
                    placeholder="Phone" 
                    value={Phone} 
                    onChange={e => setPhone(e.target.value)}
                    />
                </label>
                <br/>



                

                <input type="submit"/>
            </form>
        </div>
    )
}