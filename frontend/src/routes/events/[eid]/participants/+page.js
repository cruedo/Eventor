import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    let res = await fetch(`/api/events/${params.eid}/participants/`)
    if(!res.ok) {
        error(res.status, {message: "hi from error()"})
    }
    let participants = await res.json();
    return {participants, params};
};