<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

{#if !data.participants.length}
    <p>No one attending ... </p>
{:else}
    <ul>
        {#each data.participants as u}
            <li>{u.username}</li>
        {/each}
    </ul>
{/if}
