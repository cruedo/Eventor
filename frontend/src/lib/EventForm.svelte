<script>
    import { goto } from '$app/navigation';
    import MapComp from './MapComp.svelte';

    let { oevent = $bindable(undefined), okSubmit } = $props();
    let is_create = !oevent

    let event = $state({
        title: '',
        start_datetime: '',
        description: '',
        city: '',
        country: '',
        address: '',
        capacity: null,
        latitude: null,
        longitude: null,
        fees: 0
    });

    if(!is_create) {
        event.title = oevent.title
        event.start_datetime = oevent.start_datetime
        event.description = oevent.description
        event.city = oevent.city
        event.country = oevent.country
        event.address = oevent.address
        event.capacity = oevent.capacity
        event.fees = oevent.fees
        event.latitude = oevent.latitude
        event.longitude = oevent.longitude
    }

    let cap_event = $state(!!event.capacity);
    let memo_capacity = $state(event.capacity);

    let map_pick = $state(!!event.latitude && !!event.longitude)

    let show_map = $state(map_pick)
    $effect(() => {
        if(map_pick === false) {
            event.latitude = null;
            event.longitude = null;
        } else {
            event.latitude = (is_create ? null : oevent.latitude)
            event.longitude = (is_create ? null : oevent.longitude)            
        }
        show_map = map_pick;
    })





    /**
    * @param {{ preventDefault: () => void; }} e
    */
    async function handleSubmit(e) {
        e.preventDefault();
        let url = `/api/events/`

        if(!is_create) {       
            url = `/api/events/${oevent.id}/`
        }

        // Perform form submission logic
        event.capacity = cap_event ? memo_capacity : null;
        if(event.latitude !== null) event.latitude = Number(event.latitude).toFixed(7);
        if(event.longitude !== null) event.longitude = Number(event.longitude).toFixed(7);
        console.log(JSON.stringify(event));

        const res = await fetch(url, {
            method: is_create ? 'POST' : 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            body: JSON.stringify(event)
        })
        if(!res.ok) {
            alert(`Some error occured. Status = '${res.status}' and StatusText = '${res.statusText}'`)
            return
        }
        
        if(!is_create) {
            oevent.title = event.title
            oevent.start_datetime = event.start_datetime
            oevent.description = event.description
            oevent.city = event.city
            oevent.country = event.country
            oevent.address = event.address
            oevent.capacity = event.capacity
            oevent.fees = event.fees
            oevent.latitude = event.latitude
            oevent.longitude = event.longitude
        }

        okSubmit()
    };
</script>

<div class="form-container">
    <h2>Event Organizer</h2>
    <form onsubmit={handleSubmit}>
    <!-- Title -->
    <div class="form-group">
        <label for="title">Title (max 70 characters)</label>
        <input
        id="title"
        type="text"
        bind:value={event.title}
        maxlength="70"
        required={is_create}
        placeholder="Enter event title"
        />
        {#if event.title.length > 70}
        <p class="error-message">Title cannot exceed 70 characters</p>
        {/if}
    </div>

    <!-- Start DateTime -->
    <div class="form-group">
        <label for="start_datetime">Start Date & Time</label>
        <input
        id="start_datetime"
        type="datetime-local"
        step="1"
        bind:value={event.start_datetime}
        required={is_create}
        />
    </div>

    <!-- Description -->
    <div class="form-group">
        <label for="description">Description (optional)</label>
        <textarea
        id="description"
        bind:value={event.description}
        placeholder="Enter event description"
        ></textarea>
    </div>

    <!-- City -->
    <div class="form-group">
        <label for="city">City (optional)</label>
        <input
        id="city"
        type="text"
        bind:value={event.city}
        placeholder="Enter city"
        />
    </div>

    <!-- Country -->
    <div class="form-group">
        <label for="country">Country (optional)</label>
        <input
        id="country"
        type="text"
        bind:value={event.country}
        placeholder="Enter country"
        />
    </div>

    <!-- Address -->
    <div class="form-group">
        <label for="address">Address (optional)</label>
        <input
        id="address"
        type="text"
        bind:value={event.address}
        placeholder="Enter address"
        />
    </div>

    <!-- Checkbox group -->
    <div class="form-group checkbox-group">
        <input 
        type="checkbox" 
        id="cap event" 
        bind:checked={cap_event} 
        />
        <label for="cap event">Limit number of participants</label>
    </div>
    {#if cap_event}
    <!-- Capacity -->
    <div class="form-group">
        <label for="capacity">Capacity (optional)</label>
        <input
        id="capacity"
        type="number"
        bind:value={memo_capacity}
        min="0"
        placeholder="Enter capacity"
        oninput={e => console.log(memo_capacity, typeof(memo_capacity), JSON.stringify(event))}
        />
    </div>
    {/if}

    <!-- Checkbox group -->
    <div class="form-group checkbox-group">
        <input 
        type="checkbox" 
        id="map pick" 
        bind:checked={map_pick} 
        />
        <label for="map pick">Pick on Map</label>
    </div>
    {#if show_map}
    <MapComp bind:latitude={event.latitude} bind:longitude={event.longitude} />
    <p>({Number(event.latitude).toFixed(7)}, {Number(event.longitude).toFixed(7)})</p>
    {/if}

    <!-- Fees -->
    <div class="form-group">
        <label for="fees">Fees (optional)</label>
        <input
        id="fees"
        type="number"
        step="0.01"
        bind:value={event.fees}
        placeholder="Enter fees"
        />
    </div>

    <button type="submit">Submit Event</button>
    </form>
</div>



<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Styling for the checkbox container */
.checkbox-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

/* Styling the checkbox itself */
input[type="checkbox"] {
    width: auto; /* Keep the default size */
    margin-right: 0.5rem; /* Space between checkbox and label */
    accent-color: #4CAF50; /* Color of the checkbox */
}

/* Label styling for the checkbox */
.checkbox-group label {
    font-size: 1rem;
    margin: 0;
    cursor: pointer;
}

.form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

input,
textarea {
    width: 100%;
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1rem;
}

input[type="number"],
input[type="datetime-local"] {
    width: 100%;
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #ddd;
}

textarea {
    height: 120px;
}

button {
    width: 100%;
    padding: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-top: 1rem;
}

button:hover {
    background-color: #45a049;
}

.error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

</style>
