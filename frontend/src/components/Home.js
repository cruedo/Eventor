import { useState, useEffect } from "react"
import axios from "axios"
import EventDisplay from "./EventDisplay"
import EventCard from "./EventCard"
import { useDispatch, useSelector } from "react-redux"

function Home() {
    const [EventsList, setEventsList] = useState({
        data: []
    })

    const dispatch = useDispatch()
    let authed = useSelector((state) => state.auth.authed)
    let user = useSelector((state) => state.user.user)


    useEffect(() => {
        axios.get(`http://localhost:8000/events`)
        .then(res => {
            setEventsList(res.data)
            console.log(res.data.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            {authed ? `Current User: ${user.username}` : "No User is logged in"}
            {/* <EventDisplay info={EventsList.data[0]}/> */}

            {
                EventsList.data.map((x, index) => {
                    return <EventCard key={index} info={x} />
                })
            }
        </div>
    )
}







function Foo() {
    return (
        <div>
            <h1>This is page Foo</h1>
        </div>
    )
}

function Bar() {
    return (
        <div>
            <h1>This is page Bar</h1>
        </div>
    )
}

export {Foo, Bar, Home}