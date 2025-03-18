<script>
    import { store } from "$lib/store.svelte";
    import Comment from "./Comment.svelte";
    import CommentForm from "./CommentForm.svelte";
    import EventForm from "$lib/EventForm.svelte";
    import MapComp from "$lib/MapComp.svelte";

    /** @type {{ data: import('./$types').PageData }} */
    let { data }= $props();
    let comments = $state(data.comments)
    let edetail = $state(data.res_data)
    let modify_state = $state(false)
    edetail.start_datetime = edetail.start_datetime.slice(0,-1)

    console.log(edetail.start_datetime);
    

    /**
   * @param {any} e
   */
    async function handleJoin(e) {
        if(!store.logged_in) {
            alert("Login Required !")
            return
        }

        const url = `/api/events/${data.params.eid}/participants/`
        
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
        })

        if(!res.ok) {
            alert(`Some error occured. Status = '${res.status}' and StatusText = '${res.statusText}'`)
            return
        }
        
        edetail.joined = true
        edetail.attendees += 1
        alert("Hurray, you have joined the event")
    }
</script>

<h1>
    {edetail.title}
</h1>
<p>hosted by: {edetail.user.username}</p>
<p>{edetail.city || "no city"}, {edetail.country || "no country"}</p>
<p>Starting at: {new Date(edetail.start_datetime).toLocaleString("en-GB")}</p>
<p> <b>{edetail.description || "No description provided !"}</b></p>
<p>address: {edetail.address}</p>
<p> <a href={`/events/${data.params.eid}/participants/`}>{edetail.attendees}/{edetail.capacity} people attending</a></p>
<p>Fees: {edetail.fees}</p>
<p>Geo-location: ({edetail.longitude || "longitude"}, {edetail.latitude || "latitude"})</p>
<!-- <p>{JSON.stringify(data.comments)}</p> -->

<div>
    <button class="join-button" disabled={edetail.joined} onclick={handleJoin}>Join</button>
    {#if store.user === edetail.user.username && modify_state === false}
    <button class="modify-button" onclick={()=>modify_state=true}>Modify</button>
    {/if}
</div>

{#if modify_state}
<EventForm bind:oevent={edetail} okSubmit={() => {modify_state = false}} />
    <div>
        <button class="modify-button" onclick={() => modify_state=false}>Cancel</button>
    </div>
{/if}

{#if edetail.latitude !== null && edetail.longitude !== null && modify_state === false}
<MapComp latitude={edetail.latitude} longitude={edetail.longitude} />
{/if}

<h3>Comments</h3>
{#if !comments.length }
    <p>No Comments to Show !</p>
{:else}
    {#each comments as comment}
        <Comment {comment}/>
    {/each}
{/if}



{#if store.logged_in}
    <CommentForm bind:comments />
{/if}

<style>
    .join-button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 15px 30px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s ease-in-out;
        opacity: 1; /* Normal opacity */
    }

    .join-button:hover {
        background-color: #2980b9;
        transform: scale(1.1);
    }

    .join-button:active {
        background-color: #1d6fa5;
        transform: scale(1);
    }

    .join-button:disabled {
        background-color: #bdc3c7; /* Greyed-out color */
        color: #7f8c8d; /* Greyed-out text */
        cursor: not-allowed; /* Change cursor to not-allowed */
        transform: none; /* Remove hover/active scale effect */
        opacity: 0.6; /* Make it slightly transparent */
    }

    .modify-button {
        background-color: #f39c12; /* Yellowish color */
        color: white;
        padding: 15px 30px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 0px 10px;
    }

    .modify-button:hover {
        background-color: #e67e22; /* Darker yellowish-orange for hover */
        transform: translateY(-3px);
    }

    .modify-button:active {
        transform: translateY(1px);
        background-color: #d35400; /* Even darker color for active state */
    }
</style>