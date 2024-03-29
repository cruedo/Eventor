import { useParams } from "react-router-dom"
import "./EventDetail.css"
import imag from "../../static/stock-media.jpg"
import RightDetail from "./RightDetail"
import dp from "../../static/dp.jpg"
import { useEffect, useState } from "react"
import axios from "axios"
import Comment from "./Comment"
import Participant from "./Participant"

export default function EventDetail(props) {

    const [ EventData, setEventData ] = useState(false)
    const { id } = useParams()
    let now = new Date()
    let later = now
    later.setDate(later.getDate() + 2)
    let Event = {
        title: "Title",
        description: `Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware. It is considered one of the Big Five companies in the American information technology industry, along with Amazon, Apple, Meta (Facebook) and Microsoft.[10]

        Google was founded on September 4, 1998, by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. Together they own about 14% of its publicly-listed shares and control 56% of the stockholder voting power through super-voting stock. The company went public via an initial public offering (IPO) in 2004. In 2015, Google was reorganized as a wholly-owned subsidiary of Alphabet Inc.. Google is Alphabet's largest subsidiary and is a holding company for Alphabet's Internet properties and interests. Sundar Pichai was appointed CEO of Google on October 24, 2015, replacing Larry Page, who became the CEO of Alphabet. On December 3, 2019, Pichai also became the CEO of Alphabet.[11]
        
        In 2021, the Alphabet Workers Union was founded, mainly composed of Google employees.[12]
        
        The company's rapid growth since incorporation has included products, acquisitions, and partnerships beyond Google's core search engine, (Google Search). It offers services designed for work and productivity (Google Docs, Google Sheets, and Google Slides), email (Gmail), scheduling and time management (Google Calendar), cloud storage (Google Drive), instant messaging and video chat (Google Duo, Google Chat, and Google Meet), language translation (Google Translate), mapping and navigation (Google Maps, Waze, Google Earth, and Street View), podcast hosting (Google Podcasts), video sharing (YouTube), blog publishing (Blogger), note-taking (Google Keep and Jamboard), and photo organizing and editing (Google Photos). The company leads the development of the Android mobile operating system, the Google Chrome web browser, and Chrome OS (a lightweight, proprietary operating system based on the free and open-source Chromium OS operating system). Google has moved increasingly into hardware; from 2010 to 2015, it partnered with major electronics manufacturers in the production of its Google Nexus devices, and it released multiple hardware products in 2016, including the Google Pixel line of smartphones, Google Home smart speaker, Google Wifi mesh wireless router. Google has also experimented with becoming an Internet carrier (Google Fiber and Google Fi).
        
        Google.com is the most visited website worldwide. Several other Google-owned websites also are on the list of most popular websites, including YouTube and Blogger.[13] On the list of most valuable brands, Google is ranked second by Forbes[14] and fourth by Interbrand.[15] It has received significant criticism involving issues such as privacy concerns, tax avoidance, censorship, search neutrality, antitrust and abuse of its monopoly position.`,
        comments: "Comments Section",
        participants: "Participants List",
        createDate: now,
        startDate: later,
        city: "New York",
        country: "United States"
    }

    useEffect(() => {
        axios.get(`/events/${id}`)
        .then(res => {
            let data = res.data.data
            console.log(data)
            setEventData(data)
        })
        .catch(err => {
            console.log("Error while fetching event !", err)
        })
    }, [])

    return (
        <div className="event-container">

            <div className="title">
                <div style={{margin: "auto", maxWidth: "1120px"}}>
                    <div>
                        {/* Event Details (date, time, fee, capacity, city, country) */}
                        {Event.createDate.toDateString()},  {Event.createDate.toLocaleTimeString()}
                    </div>
                    <div className="title-div no-mar">
                        <h2 className="font-bold">{Event.title} {id}</h2>
                    </div>
                    <div>
                        <div className="dp">
                            <img src={dp} className="dpp"/>
                        </div>
                        Hosted by <br/> <span className="hoster">Mr. Duke</span></div>
                    {/* <div className="loc">{Event.city}, {Event.country}</div> */}
                </div>

            </div>

            <div style={{maxWidth: "1120px", margin: "auto"}}>
                <div className="main-detail lrmq">


                    <div className="left-detail">
                        <div className="image-div">
                            <img src={imag}/> 
                        </div>

                        <div className="desc">
                            {Event.description}
                        </div>

                        {/* <div><h3>{Event.participants}</h3></div> */}
                        {/* <div><h3>{Event.comments}</h3></div> */}
                        <Participant id={id} />
                        <Comment id={id}/>
                    </div>
                
                    <RightDetail id={id} EventData={EventData}/>
                
                </div>
            </div>

        </div>
    )
}