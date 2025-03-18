<script>
    import { goto } from '$app/navigation';
    import { store } from '$lib/store.svelte';
    import Cookies from 'js-cookie'

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    
    let error = $state('')
    let username = $state('')
    let password = $state('')
    let loadStatus = $state(false)


    /**
   * @param {{ preventDefault: () => void; }} e
   */
    async function handleSubmit(e) {
        e.preventDefault();
        const prm = fetch(`/api/login/`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({username, password}),
            credentials: 'same-origin'
        })
        loadStatus = true
        error = ''
        const res = await prm;
        loadStatus = false

        if(res.ok) {
            store.logged_in = true
            store.user = username
            Cookies.set('user', username, {expires: 7, path: '/'})
            goto('/')
            // Cookies.set('logged_in', 'true', { expires: 7, path: '/' })
        } else {
            error = (await res.json()).message;
        }
    }
</script>

<div class="form-container">
    <h2>Login</h2>
    {#if error}
        <p class="error">{error}</p>
    {/if}
    {#if loadStatus}
        <p>Loading ...</p>
    {/if}
    <form onsubmit={handleSubmit}>
        <input
        type="text"
        placeholder="Username"
        bind:value={username}
        required
        />
        <input
        type="password"
        placeholder="Password"
        bind:value={password}
        required
        />
        <button type="submit">Login</button>
    </form>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .form-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .form-container input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
  
    .form-container button {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 16px;
    }
  
    .error {
        color: red;
        font-size: 14px;
        margin-bottom: 15px;
    }
  
    .form-container h2 {
        text-align: center;
        margin-bottom: 20px;
    }
</style>