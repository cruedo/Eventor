/** @type {import('./$types').PageLoad} */
export async function load() {
    let status = true;
    if(status) {
        return { authed : false }
    }
    return {
        authed: true,
        name: "fjdsofijd",
        age: 99
    };
};