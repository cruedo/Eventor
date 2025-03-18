<script>
    import { page } from "$app/state";
    
    let { comments = $bindable() } = $props()
    let posting_comment = $state('')
    let errors = $state('')


    /**
   * @param {{ preventDefault: () => void; }} e
   */
    async function handleSubmit(e) {
        e.preventDefault();
        // comments.push({user: {username: 'someone'}, created_datetime: new Date(), text: posting_comment, votes: 5});
        const res = await fetch(`/api/events/${page.params.eid}/comments/`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({text: posting_comment}),
            credentials: 'same-origin'
        })

        if(res.ok) {
            let c = (await res.json()).comment
            comments.push(c)
            posting_comment='';
        } else {
            errors = "Some Error Occured !"
        }
    }
</script>


<form onsubmit={handleSubmit}>
    <textarea bind:value={posting_comment} placeholder="Write your comment..." rows="4" cols="50" required></textarea>

    <button type="submit">Submit Comment</button>
    {#if errors}
        <p>{errors}</p>
    {/if}
</form>