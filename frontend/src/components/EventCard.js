import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import '../styles/EventDisplay.css'
import stock_media from '../static/stock-media.jpg'
import '../styles/EventCard.css'

export default function EventCard({ info }) {
    // let dateTime = "TUE, MAR 1 @ 9:30 PM IST"
    let dateTime = info.startTime
    // let title = "Easy Paced Williamsburg Bridge & Williamsburg walk"
    let title = info.title
    let attendees = info.attendees
    // let location = "Shorewalkers: Members Only Group • New York, NY"
    let location = `${info.city}, ${info.country}`

    return (
        <Link variant="primary" to={"/events/"+info.eventID}>
            <div className='ec-root'>
                <div>
                    <img src={stock_media} className='ec-img'/>
                </div>
                <div>
                    <div className='ec-dt'>{dateTime}</div>
                    <div className='ec-title'>{title}</div>
                    <div className='ec-loc'>{location}</div>
                    <div className='ec-loc'>{attendees} attendees</div>
                </div>
            </div>
        </Link>
    )
}