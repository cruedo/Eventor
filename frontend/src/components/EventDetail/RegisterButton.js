import { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import "./EventDetail.css"
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"


export default function RegisterButton({ id, participants }) {


    const [Redirect, setRedirect] = useState(false)

    const Auth = useSelector(state => state.auth.authed)
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()


    function handleClick(e) {
        console.log(participants.includes(user))
        if(Auth == false) {
            setRedirect(true)
            return
        }

        if(participants.some(x => x.userID == user.userID)) {
            alert("Already Registered")
            return
        }

        const url = `/events/${id}/participants`
        axios.post(url, {}, {"Content-Type": "application/json"})
        .then(res => {
            participants.push(user)
        })
        .catch(err => {
            console.log(err)
        })

    }

    if(Redirect) {
        return <Navigate to="/login" />
    }


    return (
        // <div className="reg-btn-div">
            <button className="right-card reg-btn" onClick={handleClick}>Register</button>
        // </div>
    )
}