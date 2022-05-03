import { useState, useEffect } from "react"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../features/user"
import { updateAuth } from "../features/auth"
import { Navigate } from "react-router-dom"

export default function CreateEvent() {
    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [City, setCity] = useState("")
    const [Country, setCountry] = useState("")
    const [StartTime, setStartTime] = useState("")
    const [Latitude, setLatitude] = useState("")
    const [Longitude, setLongitude] = useState("")
    const [Fee, setFee] = useState("")
    const [Capacity, setCapacity] = useState("")

    const [Created, setCreated] = useState(false)
    const [Message, setMessage] = useState("")


    const dispatch = useDispatch()
    const User = useSelector((state) => state.user.user)
    const authed = useSelector((state) => state.auth.authed)


    useEffect(() => {
        setCreated(false)
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        // MAKE Request here
        let creds = {
            "title": Title, 
            "description": Description,
            "city": City,
            "country": Country,
            "starttime": StartTime,
            "latitude": Latitude,
            "longitude": Longitude,
            "fee": Fee,
            "capacity": Capacity
        }
        axios.post("/events", creds, {"Content-Type": "application/json"})
        .then(res => {
            console.log(res.data)
            setMessage(res.data.data)
            setCreated(true)
            
        })
        .catch(err => {
            setMessage(JSON.stringify(err))
        })
    }


    if(Created) {
        return <Navigate to="/"/>
    }


    return (
        <div>
            <br/><br/><br/><br/>
            <b>{Message}</b>
            <form onSubmit={handleSubmit}>
                <label>
                    Title <br/>
                    <input 
                    type="text" 
                    placeholder="Enter Your Title" 
                    value={Title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    />
                </label>
                <br/>

                <label>
                    Description <br/>
                    <input 
                    type="textfield" 
                    placeholder="Enter your description" 
                    value={Description} 
                    onChange={e => setDescription(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    City <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your City" 
                    value={City} 
                    onChange={e => setCity(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Country <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your Country" 
                    value={Country} 
                    onChange={e => setCountry(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    StartTime <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your StartTime" 
                    value={StartTime} 
                    onChange={e => setStartTime(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Latitude <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your Latitude" 
                    value={Latitude} 
                    onChange={e => setLatitude(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Longitude <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your Longitude" 
                    value={Longitude} 
                    onChange={e => setLongitude(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Fee <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your Fee" 
                    value={Fee} 
                    onChange={e => setFee(e.target.value)}
                    required/>
                </label>
                <br/>

                <label>
                    Capacity <br/>
                    <input 
                    type="text" 
                    placeholder="Enter your Capacity" 
                    value={Capacity} 
                    onChange={e => setCapacity(e.target.value)}
                    required/>
                </label>
                <br/>

                <input type="submit"/>
            </form>
        </div>
    )
}