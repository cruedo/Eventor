import { useParams } from "react-router-dom"
import "./EventDetail.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'

export default function Comment({ id }) {

    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")

    const Auth = useSelector(state => state.auth.authed)

    function handleSubmit(e) {
        e.preventDefault()
        // alert("You clicked on Submit")

        let creds = {"comment" : commentText}
        axios.post(`/events/${id}/comments`, creds, {"Content-Type": "application/json"})
        .then(res => {
            console.log("Logging comment \"Post\" req response...")
            console.log(res.data)
            setComments([...comments, res.data.data])
        })

        setCommentText("")
        
    }


    useEffect(() => {
        axios.get(`/events/${id}/comments`)
        .then(res => {
            console.log("Logging comments...")
            console.log(res.data.data)
            setComments(res.data.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div>
            <h3>Comments Section</h3>
            {Auth ? 
            <form onSubmit={handleSubmit}>
                <textarea placeholder="Enter your comment" value={commentText} onChange={e => setCommentText(e.target.value)}/> <br/>
                <input type="submit" />
            </form>
            : ""}
            {/* {comments ? JSON.stringify(comments) : "{null}"} */}
            {comments.map(comment => {
                return (
                    <div key={comment.commentid}>
                        {comment.userid} <br/>
                        {comment.createdTime} <br/>
                        {comment.text} <br/><br/><br/>
                    </div>
                )
            })}
        </div>
    )
}