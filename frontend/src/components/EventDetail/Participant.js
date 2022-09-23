import { useParams } from "react-router-dom"
import "./EventDetail.css"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Participant({ id }) {

    const [participants, setParticipants] = useState(false)


    useEffect(() => {
        axios.get(`/events/${id}/participants`)
        .then(res => {
            setParticipants(res.data.data)
            console.log(res.data.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div>
            <h3>
                Participants Section
            </h3>
                {participants ? JSON.stringify(participants) : "{null}"}
        </div>
    )
}