import { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import "./EventDetail.css"
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"


export default function RegisterButton({ id, EventData }) {


    const [Redirect, setRedirect] = useState(false)

    const Auth = useSelector(state => state.auth.authed)
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()


    function handleClick(e) {
        if(Auth == false) {
            setRedirect(true)
            return
        }

        // This should be checked with the help of the response json when requesting for an event page
        // The response should include whether the current user has registered or not.
        // TODO : to be implemented in the backend !!!
        if(EventData.registered == true) {
            alert("Already Registered")
            return
        }

        const url = `/events/${id}/participants`
        axios.post(url, {}, {"Content-Type": "application/json"})
        .then(res => {
            alert("Successfully Registered")
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