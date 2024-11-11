<script>
    import { preventDefault } from 'svelte/legacy';

    import { AngleUpOutline, ChevronRightOutline, ClockSolid, ArrowUpFromBracketOutline, CheckOutline } from 'flowbite-svelte-icons';
    import Card from './Card.svelte'
    import Modal from './Modal.svelte';
    import { chronology_usernames } from '../../lib/components/constants.js'

    let { item } = $props();
    let showModal = $state(false);
    let showEntirePost = $state(false);
	let clickedItem = $state("NA");

    function formatDate(dateString) {
        // Remove the time part and the milliseconds and replace ' ' with 'T' for compatibility
        dateString = dateString.split(' ')[0] + 'T' + dateString.split(' ')[1].split('.')[0] + 'Z';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function decodeHTMLEntities(html) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }

    // Function to handle clicks on medication spans
    function handleClick(event) {
        const target = event.target;

        // Compute keyword by reversing and replacing tag
        let keyword = target.classList[0].split('').reverse().join('');
        keyword = keyword.replace(/_/g, "");
        keyword = keyword.replace(/-/g, " ");
        const special_terms_dict = {"Cat s Claw": "Cat's Claw",
                                    "Lion s Mane": "Lion's Mane",
                                    "St  John s wort": "St. John's Wort",
                                    };
        if (special_terms_dict[keyword]){
            keyword = special_terms_dict[keyword]
        }
        clickedItem = keyword;

        // Only show the modal when it is a clickable word (user won't accidentally popup random words)
        if (target.classList.contains('medication') || target.classList.contains('supplement') || target.classList.contains('condition')) {
            showModal = true;
        }
        else if (target.classList.contains('tagstyle')) {
            clickedItem = target.textContent.trim();
            showModal = true;
        }
    }

    function scrollToTop(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.scrollIntoView({behavior: 'smooth'});
        }
    }

    let copiedPopupVisible = $state(false);
    const showCopiedPopup = () => {
        copiedPopupVisible = true;
        setTimeout(() => { copiedPopupVisible = false; }, 1500);
    };

    async function sharePost(url) {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            showCopiedPopup();
        } catch (err) {
            console.log(err);
        }
    }
</script>

<Modal bind:showModal>
	<div class="clickedItem">{clickedItem}</div>
	<div class="buttonList">
		<a class="whitebutton" href="https://www.google.com/search?q={clickedItem}" target="_blank">
            <svg class="w-8 h-8 me-4" height="200px" width="200px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" id="gsearch" data-name="gsearch"><defs><style>.cls-1,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6{fill:none;stroke-miterlimit:10;}.cls-1{stroke:#000;stroke-width:29px;}.cls-2{stroke:#39b54a;}.cls-2,.cls-3,.cls-4,.cls-5{stroke-width:49px;}.cls-3{stroke:#fbb03b;}.cls-4{stroke:#ed1c24;}.cls-5,.cls-6{stroke:#0071bc;}.cls-6{stroke-width:59px;}</style></defs><circle class="cls-1" cx="224.8" cy="224.58" r="200"></circle><path class="cls-2" d="M932.2,600.37c-110.45,0-200-89.54-200-200" transform="translate(-707.7 -175.92)"></path><path class="cls-3" d="M732.2,400.42c0-110.46,89.55-200,200-200" transform="translate(-707.7 -175.92)"></path><path class="cls-4" d="M932.16,200.42c110.46,0,200,89.54,200,200" transform="translate(-707.7 -175.92)"></path><path class="cls-5" d="M1132.16,400.37c0,110.46-89.54,200-200,200" transform="translate(-707.7 -175.92)"></path><line class="cls-6" x1="364.98" y1="366.76" x2="629.3" y2="606.08"></line></svg>
            Google
        </a>
		<a class="whitebutton" href="https://amazon.com/s?k={clickedItem}" target="_blank">
            <svg class="w-8 h-8 me-4" height="200px" width="200px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Amazon-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-601.000000, -560.000000)"> <g id="Amazon" transform="translate(601.000000, 560.000000)"> <path d="M25.4026553,25.9595294 C24.660417,27.4418824 23.3876054,28.3962353 22.0103725,28.7181176 C21.8015298,28.7181176 21.4826213,28.8225882 21.1637129,28.8225882 C18.835399,28.8225882 17.458166,27.0211765 17.458166,24.3727059 C17.458166,20.9788235 19.4703937,19.392 22.0103725,18.6465882 C23.3876054,18.3303529 24.9793255,18.2230588 26.5682233,18.2230588 L26.5682233,19.4964706 C26.5682233,21.9331765 26.6726447,23.8390588 25.4026553,25.9595294 L25.4026553,25.9595294 Z M26.5682233,13.3524706 C25.1909904,13.4569412 23.5992703,13.5614118 22.0103725,13.7703529 C19.574815,14.0922353 17.1392576,14.5157647 15.1298521,15.4701176 C11.2098182,17.0597647 8.55977364,20.4508235 8.55977364,25.4287059 C8.55977364,31.6856471 12.5842289,34.8621176 17.6726531,34.8621176 C19.3659723,34.8621176 20.7432053,34.6475294 22.0103725,34.3341176 C24.0282445,33.696 25.7187415,32.5298824 27.7309692,30.4094118 C28.8965372,31.9990588 29.2182679,32.7444706 31.2276733,34.4385882 C31.7582467,34.6475294 32.28882,34.6475294 32.7093276,34.3341176 C33.9821392,33.2724706 36.208854,31.3637647 37.3715998,30.3049412 C37.9021732,29.8814118 37.7977518,29.2432941 37.4760212,28.7181176 C36.3132753,27.2329412 35.1448851,25.9595294 35.1448851,23.0992941 L35.1448851,13.5614118 C35.1448851,9.53505882 35.4666157,5.82494118 32.5004849,3.072 C30.0649275,0.849882353 26.2493149,0 23.2831841,0 L22.0103725,0 C16.6115064,0.313411765 10.8937319,2.64564706 9.61809814,9.32329412 C9.40643324,10.1731765 10.0442501,10.4894118 10.4675799,10.5938824 L16.3998415,11.3364706 C17.0348362,11.2291765 17.3537447,10.6983529 17.458166,10.1731765 C17.9859172,7.84094118 19.8937235,6.67482353 22.0103725,6.46023529 L22.4365245,6.46023529 C23.7093361,6.46023529 25.086569,6.99105882 25.8259851,8.05270588 C26.6726447,9.32329412 26.5682233,11.0202353 26.5682233,12.5054118 L26.5682233,13.3524706 L26.5682233,13.3524706 Z" fill="#343B45"> </path> <path d="M47.9943556,35.9463529 L47.9943556,35.9435294 C47.971778,35.4437647 47.8673567,35.0625882 47.658514,34.7463529 L47.6359364,34.7152941 L47.6105366,34.6842353 C47.3988717,34.4527059 47.1956734,34.3651765 46.9755419,34.2691765 C46.3179696,34.0150588 45.3612442,33.8795294 44.2097872,33.8767059 C43.382883,33.8767059 42.4713128,33.9557647 41.5540982,34.1562353 L41.551276,34.0941176 L40.6284171,34.4018824 L40.6114839,34.4103529 L40.0893771,34.5797647 L40.0893771,34.6023529 C39.47696,34.8564706 38.9209869,35.1727059 38.4045245,35.5482353 C38.0827939,35.7882353 37.8175072,36.1072941 37.8033962,36.5957647 C37.7949296,36.8611765 37.9303952,37.1661176 38.1533489,37.3468235 C38.3763025,37.5275294 38.6359448,37.5896471 38.8645429,37.5896471 C38.9181647,37.5896471 38.9689643,37.5868235 39.0141194,37.5783529 L39.0592746,37.5755294 L39.093141,37.5698824 C39.5446928,37.4738824 40.2022651,37.4089412 40.9727253,37.3016471 C41.6331198,37.2282353 42.3330251,37.1745882 42.9397978,37.1745882 C43.368772,37.1717647 43.7554132,37.2028235 44.0206999,37.2592941 C44.1533432,37.2875294 44.2521202,37.3214118 44.3057419,37.3496471 C44.3254973,37.3552941 44.3396083,37.3637647 44.3480749,37.3694118 C44.3593637,37.4061176 44.3762969,37.5021176 44.3734747,37.6348235 C44.3791191,38.1430588 44.164632,39.0861176 43.8683012,40.0065882 C43.5804369,40.9270588 43.2304843,41.8503529 42.999064,42.4630588 C42.94262,42.6042353 42.9059314,42.7595294 42.9059314,42.9289412 C42.900287,43.1745882 43.0018862,43.4738824 43.2163733,43.6715294 C43.425216,43.8691765 43.696147,43.9482353 43.9219229,43.9482353 L43.9332117,43.9482353 C44.2718756,43.9454118 44.5597398,43.8098824 44.8080933,43.6150588 C47.1505182,41.5087059 47.9661336,38.1430588 48,36.2484706 L47.9943556,35.9463529 Z M41.0489247,38.8658824 C40.8090378,38.8630588 40.5635065,38.9195294 40.3349084,39.0268235 C40.0780883,39.1284706 39.8156239,39.2470588 39.5672704,39.3515294 L39.2032068,39.504 L38.7290774,39.6931765 L38.7290774,39.6988235 C33.5785648,41.7882353 28.16841,43.0136471 23.1618295,43.1209412 C22.9783866,43.1265882 22.7921215,43.1265882 22.614323,43.1265882 C14.7403887,43.1322353 8.31706456,39.4785882 1.83729642,35.8785882 C1.61152053,35.76 1.37727804,35.6978824 1.15150215,35.6978824 C0.860815683,35.6978824 0.561662624,35.808 0.344353327,36.0112941 C0.12704403,36.2174118 -0.00277710907,36.5138824 4.50895989e-05,36.816 C-0.00277710907,37.2084706 0.208887791,37.5698824 0.505218651,37.8042353 C6.58705678,43.0870588 13.25309,47.9943529 22.2192152,48 C22.3941915,48 22.57199,47.9943529 22.7497885,47.9915294 C28.453452,47.8644706 34.902176,45.936 39.9087564,42.7905882 L39.9398006,42.7708235 C40.5945507,42.3783529 41.2493008,41.9322353 41.8673623,41.4381176 C42.2511813,41.1529412 42.516468,40.7068235 42.516468,40.2437647 C42.4995348,39.4221176 41.8024517,38.8658824 41.0489247,38.8658824 Z" id="Fill-237" fill="#FF9A00"> </path> </g> </g> </g> </g></svg>
            Amazon
        </a>
    </div>
</Modal>

<Card>
    <div class="str-name-subreddit-date" id={item.id}>
        <div class="div">@{item.author}</div>
        <div class="div">r/{item.subreddit}</div>
        <div class="div">{formatDate(item.date)}</div>
    </div>
    <div class="tags">
        {#each item.conditions as con}
            <button class="tagstyle" style="background-color: var(--condition_highlight); display: inline-block;" onclick={preventDefault(handleClick)}>{con}</button>
        {/each}
    </div>
    <div class="tags">
        {#each item.medications as med}
            <button class="tagstyle" style="background-color: var(--medication_highlight); display: inline-block;" onclick={preventDefault(handleClick)}>{med}</button>
        {/each}
    </div>
    <div class="tags">
        {#each item.supplements as sup}
            <button class="tagstyle" style="background-color: var(--supplement_highlight); display: inline-block;" onclick={preventDefault(handleClick)}>{sup}</button>
        {/each}
    </div>
    <div class="num-rating">
        <AngleUpOutline size=xs /> 
        {item.score}
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="str-review {showEntirePost ? 'no-mask' : ''}" onclick={preventDefault(handleClick)}>
        {#if showEntirePost}
            {@html decodeHTMLEntities(item.body)}
        {:else}
            {@html decodeHTMLEntities(item.body.slice(0, 500))}
        {/if}
    </div>
    {#if !showEntirePost}
        <div class="flex justify-center">
            <button class="italic pt-4" onclick={() => {showEntirePost = true}}>Read More </button>
        </div>
    {:else}
        <div class="flex justify-center">
            <button class="italic pt-4" onclick={() => {scrollToTop(item.id); setTimeout(() => { showEntirePost = false; }, 1000);}}>Read Less </button>
        </div>
    {/if}
    <div class="flex flex-row pt-7 gap-4 justify-around">
        <a href="/search?path=chronologyTab&username={item.author}" target="_blank" class="inline-flex items-center justify-center max-w-[50px] flex-grow flex-1 aspect-square mr-2 transition-colors duration-150 rounded-xl focus:shadow-outline hover:bg-[var(--extralightbackground)] hover:text-white {item.author in chronology_usernames ? 'bg-[var(--lightbackground)] text-white' : 'text-gray-400 bg-gray-200 pointer-events-none'}">
            <ClockSolid class="w-5 h-5" style="bg-white" />
        </a>
        
        <button onclick={() => {sharePost("https://LiminalLyme.com/search?path=shareTab&keyid=" + item.keyid)}} class="inline-flex items-center flex-col text-xs justify-center max-w-[50px] flex-grow flex-1 aspect-square mr-2 text-[var(--white)] transition-colors duration-150 bg-[var(--lightbackground)] rounded-xl focus:shadow-outline hover:bg-[var(--extralightbackground)] hover:text-white">
            {#if !copiedPopupVisible}
                <ArrowUpFromBracketOutline class="w-5 h-5" style="bg-white" />
            {:else}
                <CheckOutline class="w-5 h-5" style="bg-white" />
                copied
            {/if}
        </button>

        <a href="{item.permalink}" target="_blank" class="inline-flex items-center justify-center max-w-[50px] flex-grow flex-1 aspect-square mr-2 text-[var(--white)] transition-colors duration-150 bg-[var(--lightbackground)] rounded-xl focus:shadow-outline hover:bg-[var(--extralightbackground)] hover:text-white">
            <ChevronRightOutline class="w-7 h-7" style="bg-white" />
        </a>
    </div>
</Card>

<style>
    .whitebutton {
        outline: var(--darkbackground);
        outline-style: solid;
        outline-width: 2px;
        display: flex;
        
        flex-direction: row;
        align-items: center;
    }

    .buttonList {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .clickedItem {
        font-weight: bold;
        font-size: 1.5rem;
        text-align: center;
        color: #000000;
    }

    .tagstyle {
        color: #000;
        margin-right: 2px;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 1px;
        padding-bottom: 1px;
        border-radius: 0.25rem;
        
        margin-top: 1.5%;
        margin-right: 5px;
        font-size: 11pt;
    }

    .str-name-subreddit-date{
        font-size: 10pt;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 1%;
    }
    .num-rating{
        position: absolute;
        top: -10px;
        left: -10px;
        width: 40px;
        height: 40px;
        background: #e14b00;
        color: #fff;
        border: 1px #eee solid;
        border-radius: 25%;
        font-size: 11px;
        display: flex; /* Use flexbox to center content */
        flex-direction: column; /* Stack the elements vertically */
        justify-content: center; /* Center vertically */
        align-items: center; /* Center horizontally */
    }
    .str-review {
        font-size: 13pt;
        margin-top: 3%;
        max-width: 105%;
        word-wrap: break-word;
        overflow: hidden;
        white-space: pre-wrap;

        --mask: linear-gradient(to bottom, 
        rgba(0,0,0, 1) 0,   
        rgba(0,0,0, 1) 40%, 
        rgba(0,0,0, 0) 95%,
        rgba(0,0,0, 0) 0
        ) 100% 50% / 100% 100% repeat-x;
        -webkit-mask: var(--mask); 
        mask: var(--mask);
        }

    .str-review.no-mask {
        -webkit-mask: none;
        mask: none;
    }
</style>