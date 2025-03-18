import { goto } from '$app/navigation'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    let res = await fetch(`/api/events/${params.eid}/`)
    if(!res.ok) {
        alert("page not found")
        error(res.status, {message: "from the error()"})
    }
    let res_data = await res.json()
    let comments = await (await fetch(`/api/events/${params.eid}/comments/`)).json()
    return { params, res_data, comments };
};