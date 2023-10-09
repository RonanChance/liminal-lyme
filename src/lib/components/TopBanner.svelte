<script>
  import { Navbar, NavBrand, NavLi, NavUl, Button} from 'flowbite-svelte';
</script>


<div class="navbar-container">
  <Navbar class="bg-sky-500/0">
    <NavBrand href="/">
      <img src="/logo.png" class="mainlogo" alt="OpenRXN" />
    </NavBrand>
    <!-- <NavUl>
      <NavLi href="/about" class="text-white" >About</NavLi>
    </NavUl> -->
    <Button href="/about" class="text-white hover:text-[#43bbde]" color="#ffff">About</Button>
  </Navbar>
</div>

<style>
</style>