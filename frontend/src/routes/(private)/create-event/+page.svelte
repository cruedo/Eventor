<script>
    import { goto } from "$app/navigation";
    import EventForm from "$lib/EventForm.svelte";

</script>

<h1>This is create event route</h1>

<EventForm okSubmit={() => {goto('/events')}}/>