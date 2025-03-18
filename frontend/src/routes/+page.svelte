<script>
    import { browser } from '$app/environment';
    let foo = $state("");
</script>

<h1>Hello World!</h1>
<p>{foo ? "No item": foo}</p>
<!-- <p>"{foo}|{typeof(foo)}"</p> -->
<!-- <p>The number of items in local storage = {browser ? localStorage.length : "not a browser"}</p> -->
<p>The number of items in local storage = {localStorage.length}</p>
<!-- <button onclick={()=>{localStorage.setItem('li', 'true')}}>set</button>
<button onclick={()=>{foo = localStorage.getItem('li') || ""}}>get</button>
<button onclick={()=>{localStorage.removeItem('li')}}>remove</button> -->
