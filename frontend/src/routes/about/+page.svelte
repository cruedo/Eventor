<script>
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    
    if (!data.authed) {
        goto('/?q=yes')
    }
    afterNavigate(() => {console.log('hi from after navigate')})
</script>

<h1>Hi from About page</h1>
<button onclick={() => goto('/')}>goto home</button>