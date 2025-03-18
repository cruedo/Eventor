<script>
    import { goto } from '$app/navigation';
    import Cookies from 'js-cookie'
    import { store } from '$lib/store.svelte';

    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
    let { data, children } = $props();

    /**
   * @param {{ preventDefault: () => void; }} e
   */
    async function handleLogoutClick(e) {
        e.preventDefault();

        const res = await fetch(`/api/logout/`, {
            method: 'POST',
            credentials: 'same-origin'
        })

        const body = await res.json()

        if(res.ok) {
            store.logged_in = false
            goto('/login')
        } else {
            alert(JSON.stringify(body))
        }
    }


</script>

<nav class="navbar">
    <ul class="nav-left">
        <li><a href="/">Home</a></li>
        <li><a href="/events">Events</a></li>
        <li><a href="/about">About</a></li>
    </ul>
    <ul class="nav-right">
        {#if store.logged_in }
            <li><p>{store.user}</p></li>
            <li><a href="/create-event">Create Event</a></li>
            <li><a href="/account">Account</a></li>
            <li><a href="/logout" onclick={handleLogoutClick}>Logout</a></li>
        {:else}
            <li><a href="/login">Login</a></li>
        {/if}
    </ul>
</nav>

{@render children()}

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.navbar {
    background-color: #333;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
}

.nav-left,
.nav-right {
    list-style-type: none;
    display: flex;
    gap: 20px;
}

.nav-left li, .nav-right li {
    display: inline;
}

.nav-left a, .nav-right a {
    text-decoration: none;
    color: white;
    font-size: 16px;
    padding: 10px 15px;
    transition: background-color 0.3s ease;
}

.nav-left a:hover, .nav-right a:hover {
    background-color: #555;
    border-radius: 5px;
}
</style>