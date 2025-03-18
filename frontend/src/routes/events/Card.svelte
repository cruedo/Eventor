<script>
    let { data } = $props()
</script>

<div>
    <a href={`/events/${data.id}`}>
        <h3>{data.title}</h3>
    </a>
    <span>{new Date(data.created_datetime).toLocaleString("en-GB")}</span>
    <br>
    <span>{data.attendees} people attending</span>
</div>