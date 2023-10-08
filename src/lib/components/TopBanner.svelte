<div class="top-nav-bar">
  <nav class="border-gray-200 bg-blue dark:bg-gray-800 dark:border-gray-700">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center">
        <img src="logo.png" class="mainlogo" alt="OpenRXN Logo" />
          <!-- <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="Flowbite Logo" /> -->
          <!-- href="%sveltekit.assets%/favicon.png" -->
          <!-- <span class="self-center text-4xl font-semibold whiatespace-nowrp dark:text-white text-white">OpenRXN</span> -->
      </a>
      <button data-collapse-toggle="navbar-solid-bg" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
        <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
          <li>
            <a href="/" class="navtext homelink" aria-current="page">Home</a>
          </li>
          <!-- <li>
            <a href="/about" class="navtext aboutlink">About</a>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</div>

<style>
.top-nav-bar{
    font-size: 15pt;
    padding-top: 1%;
    padding-bottom: 2%;
}
.navtext {
    color: rgb(255, 255, 255);
}
.navtext:hover {
    color: #43bbde;
}
</style>