<script>
  import { page } from "$app/state";
  import { store } from "$lib/store.svelte";

    let { comment } = $props();


    /**
   * @param { any } e
   */
    async function handleVote(e) {

        const btn_name = e.target.name;

        let is_upvote = true;
        if(btn_name === "downvote") {
            is_upvote = false;
        }

        if(!store.logged_in) {
            alert("Login Required !")
            return
        }

        if(comment.vote_type!==0) {
            alert("Cannot vote on a comment more than once")
            return
        }

        const res = await fetch(`/api/events/${page.params.eid}/comments/${comment.id}/vote/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ is_upvote }),
            credentials: 'same-origin',
        })

        if(!res.ok) {
            alert(`error occured: ${res.status} && ${res.statusText}`)
            return
        }

        comment.vote_type = is_upvote ? 1 : -1;
        comment.votes += is_upvote ? 1 : -1;
    }
</script>

<div class="comments-container">
    <div class="comment">
        <div class="comment-header">
            <span class="username">{comment.user.username}</span>
            <span class="datetime">{new Date(comment.created_datetime).toLocaleString("en-GB")}</span>
        </div>
        <p class="comment-text">{comment.text}</p>
        <div class="comment-votes">
            <button name="upvote" class="vote-button" disabled={comment.vote_type==1} onclick={handleVote}>Upvote</button>
            <span class="vote-count">{comment.votes}</span>
            <button name="downvote" class="vote-button" disabled={comment.vote_type==-1} onclick={handleVote}>Downvote</button>
        </div>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .comments-container {
        max-width: 800px;
        /* margin: 0 auto; */
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .comment {
        display: flex;
        flex-direction: column;
        padding: 15px;
        border-bottom: 1px solid #ddd;
    }

    .comment:last-child {
        border-bottom: none;
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #555;
        margin-bottom: 10px;
    }

    .comment-header .username {
        font-weight: bold;
        color: #333;
    }

    .comment-header .datetime {
        color: #777;
    }

    .comment-text {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        margin-bottom: 10px;
    }

    .comment-votes {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: #333;
    }

    .vote-button {
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        margin-right: 10px;
    }

    .vote-count {
        margin-right: 10px;
    }

    .vote-button:hover {
        background-color: #e0e0e0;
    }

    .vote-count {
        font-weight: bold;
    }
</style>