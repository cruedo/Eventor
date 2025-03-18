import Cookies from "js-cookie"

export let store = $state({
    logged_in: !!Cookies.get('logged_in'),
    user: Cookies.get('user') || ''
})

$effect.root(() => {

    $effect(() => {
        if(store.logged_in) {
            Cookies.set('logged_in', 'true', {expires: 7, path: '/'})
        } else {
            Cookies.remove('logged_in', {path: '/'})
            Cookies.remove('user', {path: '/'})
            store.user = ''
        }
    })
    
})
