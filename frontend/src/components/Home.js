import { useState, useEffect } from "react"
import axios from "axios"
import EventDisplay from "./EventDisplay"

function Home() {
    const [EventsList, setEventsList] = useState({
        data: [{}]
    })

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
            <EventDisplay info={EventsList.data[0]}/>
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