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
    <div class="navlogo">
      <NavBrand href="/">
        <img src="/logo.png" class="mainlogo" alt="OpenRXN" />
      </NavBrand>
    </div>
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
      padding-top: 2%;
      padding-bottom: 2%;
      padding-left: 8%;
      padding-right: 8%;
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
      padding-top: 2%;
      padding-bottom: 2%;
      padding-left: 20%;
      padding-right: 20%;
  }
  }
</style>
