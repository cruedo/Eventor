import Cookies from "js-cookie"

export let store = $state({
    // logged_in: !!Cookies.get('logged_in'),
    // user: Cookies.get('user') || ''
    user: window.localStorage.getItem('user'),
    // csrf_token: $state(window.localStorage.getItem('csrf_token')),
})


$effect.root(() => {

    $effect(() => {
        // if(store.logged_in) {
        //     Cookies.set('logged_in', 'true', {expires: 7, path: '/'})
        // } else {
        //     Cookies.remove('logged_in', {path: '/'})
        //     Cookies.remove('user', {path: '/'})
        //     store.user = ''
        // }

        if(store.user) {
            window.localStorage.setItem('user', store.user)
        } else {
            window.localStorage.removeItem('user')
        }
    })
    
})

// $effect.root(() => {

//     $effect(() => {
//         if(store.csrf_token) {
//             window.localStorage.setItem('csrf_token', store.csrf_token)
//         } else {
//             window.localStorage.removeItem('csrf_token')
//         }
//     })
    
// })
