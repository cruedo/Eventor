import { useState } from "react"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../features/user"
import { updateAuth } from "../features/auth"
import { Navigate } from "react-router-dom"

export default function FileUpload() {


    const [File, setFile] = useState()
    const [Name, setName] = useState("")
    const [URL, setURL] = useState("")
    const [Message, setMessage] = useState("")
    const [IMG, setIMG] = useState(false)


    
    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData()
        const url = "http://localhost:8000/upload"
        formData.append('fileName', File.name)
        formData.append('file', File)
        formData.append('formID', "8199")
        const headers = {
            "Content-Type": "multipart/form-data"
        }
        axios.post(url, formData, {headers: headers})
        .then(res => {
            console.log(res)
            setMessage(JSON.stringify(res))
        })
        .catch(err => {
            console.log(err)
            setMessage(JSON.stringify(err))
        })
    }

    function handleChange(e) {
        setFile(e.target.files[0])
        console.log(e.target.files)
    }





    function hdcg(e) {
        setName(e.target.value)
    }
    function hdsbm(e) {
        e.preventDefault()
        let url = "http://localhost:8000/static/" + Name
        setIMG(true)
        setURL(url)
        
    }

    return (
        <div>
            <b>{Message}</b>
            <form onSubmit={handleSubmit}>
                <h1>File Upload</h1>
                <input type="file" onChange={handleChange}/> <br/>
                <input type="submit" value="upload"/>
            </form>

            <div>
                <br/>
                <br/>
                <br/>

                <form onSubmit={hdsbm}>
                    <input type="text" onChange={hdcg}/> <br/>
                    <input type="submit" value="retreive"/>
                </form>

                <br/>
                <br/>
                <br/>

                { IMG ? <img src={URL}/>  : "" }

            </div>
        </div>
    )
}