<script>
    import { goto } from '$app/navigation';
    import { store } from '$lib/store.svelte';

    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
    let { data, children } = $props();

    if(!store.user) {
        goto('/login')
    }
</script>

{#if store.user}
    {@render children()}
{/if}