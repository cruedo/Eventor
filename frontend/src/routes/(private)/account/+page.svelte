<script>
// @ts-nocheck

  import { error } from '@sveltejs/kit';
  import { onMount } from 'svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
  
    // Sample account data, this would typically come from an API
    let account = $state({});
    let updatedAccount = $state({});
    let isEditing = $state(false);

    let isEditingPassword = $state(false);
    let password = $state({
        password: '',
        password_new: '',
        password_new2: '',
    })

    async function handleSave() {
        // Logic to save the updated account details (e.g., send it to a server)
        console.log("Account saved", JSON.stringify(updatedAccount));

        const url = "/api/accounts/"
        const res = await fetch(url, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            body: JSON.stringify(updatedAccount)
        })

        const bdy = await res.json()

        if(!res.ok) {
            alert(JSON.stringify(bdy))
            return    
        }

        account = { ...updatedAccount };
        isEditing = false;
    };

    onMount(async () => {
        const res = await fetch("/api/accounts/")

        if(!res.ok) {
            error(res.status, {message: "something went wrong"})
            return
        }
        account = await res.json()
        updatedAccount = {...account}
    })

    
    const handleCancel = () => {
        updatedAccount = { ...account };
        isEditing = false;
    };
    
    async function handleChangePassword() {
        console.log('password change');
        const url = '/api/accounts/change-password/'

        const res = await fetch(url, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            body: JSON.stringify(password)
        })

        const bdy = await res.json()
        if(!res.ok) {
            alert(JSON.stringify(bdy))
            return
        }

        alert("successfully changed password")
        handleCancelPassword()
    }

    function handleCancelPassword() {
        password.password = ''
        password.password_new = ''
        password.password_new2 = ''
        isEditingPassword = false
    }
</script>

<div class="body">

    <div class="account-dashboard">
        <form class="form-parts change-details" onsubmit={handleSave}>
            <h1>Account Management</h1>
            <div class="form-group">
                <label for="username">
                    <i class="icon fa fa-user-circle"></i> Username
                </label>
                <input type="text" id="username" required bind:value={updatedAccount.username} disabled={!isEditing} />
            </div>
            
            <div class="form-group">
                <label for="firstName">
                    <i class="icon fa fa-user"></i> First Name
                </label>
                <input type="text" id="firstName" bind:value={updatedAccount.first_name} disabled={!isEditing} />
            </div>
            
            <div class="form-group">
                <label for="lastName">
                    <i class="icon fa fa-user"></i> Last Name
                </label>
                <input type="text" id="lastName" bind:value={updatedAccount.last_name} disabled={!isEditing} />
            </div>
            
            <div class="form-group">
                <label for="email">
                    <i class="icon fa fa-envelope"></i> Email
                </label>
                <input type="text" id="email" bind:value={updatedAccount.email} disabled={!isEditing} />
            </div>
            
            {#if !isEditing}
            <button class="btn btn-edit" onclick={() => isEditing = true}>Edit</button>
            {:else}
            <div class="button-container">
                <button class="btn btn-save" type="submit">Save</button>
                <button class="btn btn-cancel" onclick={handleCancel}>Cancel</button>
            </div>
            {/if}
        </form>
    
        <form class="form-parts change-password" onsubmit={handleChangePassword}>
            <h2>Change Password</h2>
    
            <div class="form-group">
                <label for="oldPassword">
                    <i class="icon fa fa-lock"></i> Old Password
                </label>
                <input type="password" id="oldPassword" required bind:value={password.password} disabled={!isEditingPassword} placeholder="Enter your old password" />
            </div>
            
            {#if !isEditingPassword}
            <button class="btn btn-edit" onclick={() => isEditingPassword = true}>Change Password</button>
            {:else}
            <div class="form-group">
                <label for="newPassword">
                    <i class="icon fa fa-lock"></i> New Password
                </label>
                <input type="password" id="newPassword" required bind:value={password.password_new} placeholder="Enter new password" />
            </div>
    
            <div class="form-group">
                <label for="confirmPassword">
                    <i class="icon fa fa-lock"></i> Confirm New Password
                </label>
                <input type="password" id="confirmPassword" required bind:value={password.password_new2} placeholder="Confirm new password" />
            </div>
            <div class="button-container">
                <button class="btn btn-save" type="submit">Save</button>
                <button class="btn btn-cancel" onclick={handleCancelPassword}>Cancel</button>
            </div>
            {/if}
        </form>
    </div>

</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    /* General body and layout settings */
    .body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(to right, #6a11cb, #2575fc);
    margin: 0;
    padding: 0;
    height:max-content;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .form-parts {
        padding: 10px 0;
    }

    .account-dashboard {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
    padding: 30px;
    margin: 30px 0;
    text-align: center;
    animation: fadeIn 1s ease-out;
    }

    h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 20px;
    }

    .form-group {
    margin-bottom: 15px;
    text-align: left;
    }

    .form-group label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #555;
    display: block;
    margin-bottom: 5px;
    }

    .form-group input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    border: 2px solid #ddd;
    outline: none;
    transition: all 0.3s ease;
    }

    .form-group input:focus {
    border-color: #2575fc;
    box-shadow: 0 0 10px rgba(37, 117, 252, 0.3);
    }

    .icon {
    font-size: 1.2rem;
    color: #2575fc;
    margin-right: 10px;
    }

    .btn {
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 45%;
    }

    .btn-edit {
    background-color: #2575fc;
    color: white;
    border: none;
    }

    .btn-edit:hover {
    background-color: #0061d2;
    }

    .btn-save {
    background-color: #28a745;
    color: white;
    border: none;
    }

    .btn-save:hover {
    background-color: #218838;
    }

    .btn-cancel {
    background-color: #dc3545;
    color: white;
    border: none;
    }

    .btn-cancel:hover {
    background-color: #c82333;
    }

    .button-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    }

    /* Smooth fade-in animation */
    @keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
    }
</style>