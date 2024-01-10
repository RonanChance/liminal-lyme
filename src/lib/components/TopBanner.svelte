<script>
  import { Navbar, NavBrand, NavLi, NavUl, Button} from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { getCookie } from '../../lib/components/constants';
  import PocketBase from 'pocketbase';

  let username;

  onMount(() => {
        if (browser) {
            username = getCookie('username');
            console.log(username);
        }
    });

</script>

<div class="my-navbar-container">
    <NavBrand href="/">
      <img src="/logo.png" class="mainlogo" alt="OpenRXN" />
    </NavBrand>
    <nav class="nav-links">
      {#if username}
        <a href="/auth">Logout</a>
        |
      {/if}
        <a href="/chat">Chat</a>
      |
      <a href="/about">About</a>
    </nav>
</div>

<style>
  .nav-links {
    display: flex;
    gap: 10px;
    color:white;
  }
  .my-navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 8%;
      padding-right: 8%;
      margin: auto;
      padding-top: 2%;
      padding-bottom: 2%;
  }
  .mainlogo{
    transition: transform 0.2s;
  }
  .mainlogo:hover{
    transform: scale(105%);
  }

  @media (max-width: 768px) {
    .my-navbar-container {
        padding-top: 3%;
        padding-bottom: 3%;
    }
  }
  
  @media (min-width: 1500px) {
    .my-navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 20%;
      padding-right: 20%;
      margin: auto;
      padding-top: 2%;
      padding-bottom: 2%;
  }
  }
</style>
