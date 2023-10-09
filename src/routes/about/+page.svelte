<script>
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import { AccordionItem, Accordion } from 'flowbite-svelte';
</script>

<TopBanner />
<!-- <h1>Inspiration</h1> -->

<div class="Accordion-container">
    <Accordion >
        <AccordionItem class="bg-gray-100" >
            <span slot="header">What is this website?</span>
            <p class="mb-2 text-white ">This website aims to connect individuals dealing with infections to the relevant experiences others have endured. 
                
            <br/><br/> 
            
            The hope is that this data can provide a better basis of understanding for your own healthcare, whether you are managing an acute or persistent issue.
            
        </AccordionItem>
        <AccordionItem class="bg-gray-100">
            <span slot="header">Where is the data from?</span>
            <p class="mb-2 text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint explicabo ...</p>
            <p class="mb-2 text-white ">Learn more about these technologies:</p>
            <ul class="list-disc pl-5  text-white">
                <li>
                <a href="/" target="_blank" rel="noreferrer" class="text-blue-600 dark:text-blue-500 hover:underline"> Lorem ipsum </a>
                </li>
                <li>
                <a href="https://tailwindui.com/" rel="noreferrer" target="_blank" class="text-blue-600 dark:text-blue-500 hover:underline"> Tailwind UI </a>
                </li>
            </ul>
        </AccordionItem>
        <AccordionItem class="bg-gray-100">
            <span slot="header">How can I support this project?</span>
            <p class="mb-2 text-white ">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint explicabo ...</p>
        </AccordionItem>
    </Accordion>
</div>


<style>
    .Accordion-container {
        align-items: center;
        flex-direction: column;
        width: 50%;
        margin-left: 25%;
    }
</style>