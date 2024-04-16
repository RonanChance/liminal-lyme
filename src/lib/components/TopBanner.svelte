<script>
  import { Navbar, NavBrand, NavLi, NavUl, Button} from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { getCookie } from '../../lib/components/constants';
  import { goto } from '$app/navigation';

  let email;
  let selected = "/";
  
  onMount(() => {
        if (browser) {
          email = getCookie('email');
          // // console.log(email);
        }
    });

  function changeSelected(Destination) {
      goto(Destination)
  }

</script>

<div class="navbar">
    <div>
      <NavBrand href="/">
        <img src="/logo.png" class="mainlogo" alt="OpenRXN" />
      </NavBrand>
    </div>
    <nav class="nav-links">
      {#if email}
        <button href="/logout" on:click={() => {changeSelected("/logout");}} style="text-decoration: {selected === "logout" ? "underline" : "none"}">Logout</button>
      {/if}
      <button href="/home" on:click={() => {changeSelected("/home");}} style="text-decoration: {selected === "home" ? "underline" : "none"}">Home</button>
      <button href="/about" on:click={() => {changeSelected("/about");}} style="text-decoration: {selected === "about" ? "underline" : "none"}">About</button>
    </nav>
</div>

<style>
    .nav-links {
      display: flex;
      gap: 1rem;
      color: var(--offwhite);
      font-weight: 600;
    }

  .navbar {
      position: sticky;
      top: 0px;
      z-index: 1;
      background: var(--darkbackgroundblue);

      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 5%;
      padding-bottom: 5%;
      padding-left: 8%;
      padding-right: 8%;

      max-height: 100px;
  }

  .mainlogo{
    transform: scale(95%);
    transition: transform 0.2s;
  }

  .mainlogo:hover{
    transform: scale(100%);
  }

  @media (max-width: 768px) {
    .navbar {
        padding-top: 3%;
        padding-bottom: 3%;
        padding-left: 3%;
        padding-right: 3%;
    }
  }
  
  @media (min-width: 1500px) {
    .navbar {
      padding-top: 2%;
      padding-bottom: 2%;
      padding-left: 20%;
      padding-right: 20%;
  }
  }
</style>
