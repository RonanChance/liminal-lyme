<script>
  import { Navbar, NavBrand, NavLi, NavUl, Button} from 'flowbite-svelte';
</script>


<div class="my-navbar-container">
    <NavBrand href="/">
      <img src="/logo.png" class="mainlogo" alt="OpenRXN" />
    </NavBrand>
    <!-- <Button href="/about" class="text-white hover:text-[#43bbde] h-2" color="#ffff">About</Button> -->
    <nav class="nav-links">
      <a href="/login">Register</a>
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
