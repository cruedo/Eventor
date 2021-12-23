import { useParams } from "react-router-dom"
import "../styles/EventDetail.css"

export default function EventDetail(props) {

    const { id } = useParams()

    return (
        <div className="event-container">
            <div className="image-div">Image will be shown here<img href="#"/> </div>
            <div className="title-div">
                <b>Title {id}</b>
            </div>
            <div>
                Event Details (date, time, fee, capacity, city, country)
            </div>
            <div>Description</div>
            <div>Comments Section</div>
            <div>Participants List</div>
        </div>
    )
}