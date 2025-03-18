<script>
    import Card from "./Card.svelte";
    let { data } = $props()
</script>

{#each data.res as e, i}
    <Card data={e} />
{/each}
