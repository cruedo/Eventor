<script>
    import { goto } from '$app/navigation';
    import { store } from '$lib/store.svelte';

    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
    let { data, children } = $props();

    if(!store.logged_in) {
        goto('/login')
    }
</script>

{#if store.logged_in}
    {@render children()}
{/if}