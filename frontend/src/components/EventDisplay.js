import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import '../styles/EventDisplay.css'
import stock_media from '../static/stock-media.jpg'
import EventDetail from './EventDetail'
import { Route } from 'react-router-dom'

export default function EventDisplay({ info }) {
    let dt = new Date(info.startTime)
    let tt = dt.getHours() + ":" + dt.getMinutes()
    dt = dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear()

    return (
        // <div className='event-card'>
        //     <div className="event-detail-card">
        //         <h2>{info.title}</h2>
        //         {/* <p className='event-desc'>{info.description}</p> */}
        //         <Link to={"/events/"+info.eventID}>Read More</Link>
        //     </div>
        //     <div className="info-card">
        //         <b>Start Time : </b><br/>
        //         <p>{info.city} <br/> {info.country}</p>
        //         <i>{dt}, {tt} <br/> {new Date(info.startTime).toString()}</i><br/>
        //     </div>
        // </div>

        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={stock_media} />
        <Card.Body>
            <Card.Title>{info.title}</Card.Title>
            <Card.Text>
            {dt}, {tt}
            </Card.Text>
            {/* <Button variant="primary">Read More</Button> */}
            <Link variant="primary" to={"/events/"+info.eventID}>Read More</Link>
        </Card.Body>
        </Card>
    )
}