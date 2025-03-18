/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    let res = await (await fetch(`/api/events/`)).json()
    return { res }
}