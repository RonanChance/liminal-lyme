<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import PocketBase from 'pocketbase';
    import { fly, fade } from 'svelte/transition'
    import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
    import { getCookie } from '../../lib/components/constants';
    import NavigationBar from '../../lib/components/NavigationBar.svelte';
    import Footer from '../../lib/components/Footer.svelte';
    
    let animate = false;
    onMount(() => {
      animate = true;
      
      if (browser) {
        // console.log(getCookie('email'))
        // try to grab valid cookie and if so redirect them to the chat page
        try {
          if (getCookie('email').length >= 5) {
            window.location.href = '/search';
          }
        } catch (error) {
          console.log("NO COOKIE")
        }
      }
    });

    let oauth_selection;
    const pb = new PocketBase('https://pb.liminallyme.com');

    async function clickHandler(event) {
        console.log("STARTNG CLICK HANDLER")
        let providerChoice = event.currentTarget.dataset.value;

        event.stopPropagation();
        const w = window.open();
        let data;
        if (!w) return false;

        try {
          data = await pb.collection("users").authWithOAuth2({
              provider: providerChoice,
              urlCallback: (url) => {
              w.location.href = url;
              }
          });
        } catch (error) {
          console.log("DID NOT FINISH LOGIN")
          console.error(error); // Handle error appropriately
        }

        console.log("Finished login")
        // console.log(data)

        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: data.meta.email, token: data.token })
        };
        await fetch('api/auth', requestOptions);

        // set email so we can retrieve with locals
        event.locals = {};
        event.locals.email = data.meta.email;
        
        window.location.href = '/search?path=chatTab';
        
        return;
  }

</script>

<TopBanner />
<NavigationBar currentTab="none"/>


{#if animate}
<div class="sm:m-0" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>
  
  <h1>Open<span class="highlighted-word" style="font-weight:600">RXN</span> Login</h1>

  <div class="buttondiv">
    <button data-value="google" on:click={clickHandler} class="gsi-material-button">
      <div class="gsi-material-button-state"></div>
      <div class="gsi-material-button-content-wrapper">
        <div class="gsi-material-button-icon">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span class="gsi-material-button-contents" style="font-weight: bold;">Continue with Google</span>
        <span style="display: none;">Continue with Google</span>
      </div>
    </button>
      
    <button data-value="github" on:click={clickHandler} style="border-radius:4px;" class="py-2 px-2 flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792">
        <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
      </svg>
      Continue with GitHub
    </button>
  </div>

  <div class="textbox">
    <h3>Signed In Users Can:</h3>
    <ul>
      <li>Chat with an OpenAI model that knows 9.5k+ tickborne disease experiences</li>
      <li>Search the entire database for medication/supplement combinations</li>
      <!-- <li>Contribute experiences to the repository</li> -->
      <li>Join the GroupMe & connect with others in the tickborne disease community</li>
    </ul>
  </div>
</div>
<div class="footerDiv" in:fade|global={{delay: 1100, duration: 1000 }}>
  <Footer/>
</div>
{/if}

<style>

ul {
    list-style-type: disc;
    font-size: 12pt;
    color: white;
    padding-left: 1rem;
}

h1 {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

h3 {
  text-align: left;
  font-size: 16pt;
  padding-top: 2rem;
}

li {
  padding-top: 1rem;
  font-size: 12pt;
}

.textbox {
      margin-left: 10%;
      margin-right: 10%;
      padding-bottom: 3rem;
  }

.buttondiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.gsi-material-button {
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
-webkit-appearance: none;
background-color: WHITE;
background-image: none;
border: 1px solid #747775;
-webkit-border-radius: 4px;
border-radius: 4px;
-webkit-box-sizing: border-box;
box-sizing: border-box;
color: #1f1f1f;
cursor: pointer;
font-family: 'Roboto', arial, sans-serif;
font-size: 14px;
height: 40px;
letter-spacing: 0.25px;
outline: none;
overflow: hidden;
padding: 0 12px;
position: relative;
text-align: center;
-webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
transition: background-color .218s, border-color .218s, box-shadow .218s;
vertical-align: middle;
white-space: nowrap;
width: auto;
max-width: 400px;
min-width: min-content;
}

.gsi-material-button .gsi-material-button-icon {
height: 20px;
margin-right: 12px;
min-width: 20px;
width: 20px;
}

.gsi-material-button .gsi-material-button-content-wrapper {
-webkit-align-items: center;
align-items: center;
display: flex;
-webkit-flex-direction: row;
flex-direction: row;
-webkit-flex-wrap: nowrap;
flex-wrap: nowrap;
height: 100%;
justify-content: space-between;
position: relative;
width: 100%;
}

.gsi-material-button .gsi-material-button-contents {
-webkit-flex-grow: 1;
flex-grow: 1;
font-family: 'Roboto', arial, sans-serif;
font-weight: 500;
overflow: hidden;
text-overflow: ellipsis;
vertical-align: top;
}

.gsi-material-button .gsi-material-button-state {
-webkit-transition: opacity .218s;
transition: opacity .218s;
bottom: 0;
left: 0;
opacity: 0;
position: absolute;
right: 0;
top: 0;
}

.gsi-material-button:disabled {
cursor: default;
background-color: #ffffff61;
border-color: #1f1f1f1f;
}

.gsi-material-button:disabled .gsi-material-button-contents {
opacity: 38%;
}

.gsi-material-button:disabled .gsi-material-button-icon {
opacity: 38%;
}

.gsi-material-button:not(:disabled):active .gsi-material-button-state, 
.gsi-material-button:not(:disabled):focus .gsi-material-button-state {
background-color: #303030;
opacity: 12%;
}

.gsi-material-button:not(:disabled):hover {
-webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
}

.gsi-material-button:not(:disabled):hover .gsi-material-button-state {
background-color: #303030;
opacity: 8%;
}
</style>