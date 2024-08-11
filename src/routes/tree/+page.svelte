<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'
    import { Confetti } from "svelte-confetti"
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import Footer from "../../lib/components/Footer.svelte";
    import PocketBase from 'pocketbase';
    import { Label, Input } from 'flowbite-svelte';
    import { EnvelopeSolid, FileEditSolid, LinkSolid, PapperPlaneSolid } from 'flowbite-svelte-icons';
    import MedicalDisclaimer from "../../lib/components/MedicalDisclaimer.svelte";
    import * as d3 from 'd3';

    /** @type {import('./$types').PageData} */
	export let data;

    let svg;
    let root;
    let animate = false;

    let suggestion = "";
    let articleLink = "";
    let purchaseLink = "";
    let email = "";
    let throw_confetti = false;

    async function onSubmit() {

        if (suggestion.trim() === "") {
            alert("Supplement/Treatment Suggestion is required.");
            return;
        }

        const pb = new PocketBase("https://data.liminallyme.com");
        const data = {
            "suggestion": suggestion || '',
            "article_link": articleLink || '',
            "purchase_link": purchaseLink || '',
            "email": email || ''
        };

        throw_confetti = true;

        try {
            const record = await pb.collection('suggestions').create(data);
            alert('Thank you for your contribution!');
        }
        catch (error) {
            alert('Something went wrong. Please try again.');
        }

        suggestion = "";
        articleLink = "";
        purchaseLink = "";
        email = "";
        throw_confetti = false;
    }

    onMount(async () => {
        animate = true
        const margin = { top: 0, right: 0, bottom: 0, left: 120 };
        const width = 2560 - margin.right - margin.left;
        const height = 700 - margin.top - margin.bottom;
        let i = 0;
        const duration = 750;

        // Initialize the tree layout and diagonal projection
        const tree = d3.tree().size([height, width]);
        const diagonal = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);

        // Create SVG container
        svg = d3.select('#tree')
            .append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Load data
        root = d3.hierarchy(data.treatments);
        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
            if (d.children && d.depth !== 0) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        update(root);

        function update(source) {
            // Compute the new tree layout
            const nodes = tree(root).descendants();
            const links = tree(root).links();

            // Normalize for fixed-depth
            nodes.forEach(d => { d.y = d.depth * 250; d.x = d.x * 0.9 });

            // Update nodes
            const node = svg.selectAll('g.node')
                .data(nodes, d => d.id || (d.id = ++i));

            // Enter new nodes at the parent's previous position
            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${source.y0},${source.x0})`)
                .on('click', (event, d) => { 
                    toggle(d); 
                    update(d); 
                });
            
            nodeEnter.filter(d => d.children || d._children).append('circle')
                .attr('r', 1e-6)
                .style('fill', d => d._children ? 'black' : '#fff');

            nodeEnter.append('text')
                .attr('x', d => d.children || d._children ? -10 : 10)
                .attr('dy', '.3em')
                .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
                .text(d => d.data.name)
                .style('fill-opacity', 1e-6);

            nodeEnter.each(function(d) {
                const currentNode = d3.select(this);
                const textNode = currentNode.select('text');
                const textWidth = textNode.node().getBBox().width;

                if (d.data.link) {
                    // temporary canvas to measure text width
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    context.font = '18px Arial';

                    const linkText = ": " + d.data.link;
                    const linkTextWidth = context.measureText(linkText).width;

                    currentNode.append('foreignObject')
                        .attr('x', textWidth + 10)
                        .attr('y', -11)
                        .attr('width', linkTextWidth + 5)
                        .attr('height', 30)
                        .attr('color', '#f8f8f895')
                        .append('xhtml:div')
                        .html(`<button>: <span class="underline">${d.data.link}</span></button>`)
                        .on('click', (event, d) => {
                            event.stopPropagation();
                            console.log('Article clicked', d.data.link);
                            window.open(d.data.link, '_blank');
                        });
                }
            });

            // Transition nodes to their new position
            const nodeUpdate = node.merge(nodeEnter).transition()
                .duration(duration)
                .attr('transform', d => `translate(${d.y},${d.x})`);

            nodeUpdate.select('circle')
                .attr('r', 6)
                .style('fill', d => d._children ? 'var(--lightbackground)' : '#fff');

            nodeUpdate.select('text')
                .style('fill-opacity', 1);

            // Transition exiting nodes to the parent's new position
            const nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', d => `translate(${source.y},${source.x})`)
                .remove();

            nodeExit.select('circle')
                .attr('r', 1e-6);

            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // Update links
            const link = svg.selectAll('path.link')
                .data(links, d => d.target.id);

            // Enter new links at the parent's previous position
            link.enter().append('path')
                .attr('class', 'link')
                .attr('d', d => {
                    const o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                })
                .merge(link)
                .transition()
                .duration(duration)
                .attr('d', diagonal);

            // Transition exiting links to the parent's new position
            link.exit().transition()
                .duration(duration)
                .attr('d', d => {
                    const o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            // Stash old positions
            nodes.forEach(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function toggle(d) {
            console.log('toggling node', d);
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }
    });
</script>

<TopBanner expand={true} />

{#if animate}
<div class="text-center text-2xl text-white py-6 bg-[var(--lightbackground)] rounded-b-lg text-bold" in:fade={{delay: 0, duration: 500}}>Chronic Illness Treatment Tree</div>
{/if}

<div id="tree"></div>

{#if animate}
    <div class="w-full flex justify-center bg-[var(--lightbackground)] px-4 py-8 rounded-lg" in:fade={{delay: 1000, duration: 1500}}>
        <div class="w-[85%] md:w-[50%] xl:w-[30%]">
            <div class="mb-6">
                <div class="block mb-2 text-white text-3xl text-center flex flex-row justify-center gap-2"> 
                    <svg class="w-10 h-10" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-4.92 -4.92 501.36 501.36" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="0.0049152" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.9830399999999999"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#FCD462;" d="M229.601,54.04c-64.916,7.178-117.254,59.353-124.614,124.249 c-4.975,43.865,10.104,84.28,37.237,113.288c30.372,32.471,46.127,75.977,46.127,120.438v3.445h114.804v-3.434 c0-45.676,18.125-88.928,48.496-123.046c22.274-25.022,35.809-57.988,35.809-94.127C387.461,111.269,315.095,44.587,229.601,54.04z "></path> <rect x="239.954" style="fill:#FCD462;" width="11.597" height="25.651"></rect> <rect x="414.971" y="189.056" style="fill:#FCD462;" width="25.651" height="11.597"></rect> <rect x="50.898" y="189.056" style="fill:#FCD462;" width="25.651" height="11.597"></rect> <rect x="361.629" y="60.354" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 686.0109 -151.851)" style="fill:#FCD462;" width="25.651" height="11.597"></rect> <rect x="104.197" y="317.756" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 428.5645 469.5785)" style="fill:#FCD462;" width="25.651" height="11.597"></rect> <rect x="368.703" y="310.719" transform="matrix(-0.7072 0.707 -0.707 -0.7072 868.0994 287.5853)" style="fill:#FCD462;" width="11.597" height="25.651"></rect> <rect x="111.242" y="53.315" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 246.5676 30.1458)" style="fill:#FCD462;" width="11.597" height="25.651"></rect> </g> <path style="fill:#64798A;" d="M303.155,415.46H188.351v62.963c0,1.797,1.457,3.254,3.254,3.254h108.297 c1.797,0,3.254-1.457,3.254-3.254V415.46z"></path> <g> <path style="fill:#2F4859;" d="M301.614,415.503l-113.252,12.399c-3.863,0.424-6.652,3.898-6.228,7.76 c0.423,3.862,3.897,6.651,7.759,6.228l113.253-12.401c3.863-0.422,6.651-3.898,6.228-7.76 C308.95,417.868,305.476,415.079,301.614,415.503z"></path> <path style="fill:#2F4859;" d="M301.614,439.819L188.361,452.22c-3.863,0.423-6.652,3.898-6.228,7.76 c0.423,3.862,3.897,6.651,7.759,6.228l113.253-12.4c3.863-0.423,6.651-3.898,6.228-7.76 C308.95,442.184,305.476,439.397,301.614,439.819z"></path> <path style="fill:#2F4859;" d="M301.614,464.136l-113.252,12.4c-3.863,0.423-6.652,3.898-6.228,7.76 c0.423,3.863,3.897,6.651,7.759,6.228l113.253-12.401c3.863-0.422,6.651-3.898,6.228-7.76 C308.95,466.502,305.476,463.713,301.614,464.136z"></path> <path style="fill:#2F4859;" d="M219.654,481.534c0,5.514,11.684,9.986,26.098,9.986c14.415,0,26.1-4.471,26.1-9.986H219.654z"></path> </g> <polygon style="fill:#DC8744;" points="276.281,415.46 267.415,414.369 295.474,185.924 270.609,207.035 245.754,181.518 220.898,207.035 196.035,185.924 224.084,414.369 215.217,415.46 184.375,164.298 220.322,194.817 245.754,168.706 271.185,194.817 307.133,164.298 "></polygon> </g></svg>
                    Contribute Your Ideas 
                </div>
            </div>

            <div class="mb-6">
                <Label for="large-input" class="block mb-2 text-white text-xl">Supplement/Treatment Suggestion</Label>
                <Input name="suggestion" type="text" size="lg" placeholder="Suggestion" bind:value={suggestion} required>
                    <FileEditSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Input>
            </div>

            <div class="mb-6">
                <Label for="large-input" class="block mb-2 text-white text-xl flex justify-between">Article Link <span class="opacity-50">(Optional)</span></Label>
                <Input name="article-link" type="text" size="lg" placeholder="Article Link" bind:value={articleLink}>
                    <LinkSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Input>
            </div>

            <div class="mb-6">
                <Label for="large-input" class="block mb-2 text-white text-xl flex justify-between">Purchase Link <span class="opacity-50">(Optional)</span></Label>
                <Input name="purchase-link" type="text" size="lg" placeholder="Purchase Link" bind:value={purchaseLink}>
                    <LinkSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Input>
            </div>


            <div class="mb-6">
                <Label for="large-input" class="block mb-2 text-white text-xl flex justify-between">Email <span class="opacity-50">(Optional)</span></Label>
                <Input name="email" type="email" size="lg" placeholder="name@gmail.com" bind:value={email}>
                    <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Input>
            </div>

            <div class="text-right pt-3">
                <button type="submit" class="py-2 px-3 rounded-lg bg-white text-lg" on:click={ onSubmit }>
                    Submit
                    {#if throw_confetti} <Confetti x={[-0.7, 0.7]} y={[-0.7, .7]} /> {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

{#if animate}
    <div class="flex flex-col xl:max-w-[60%] max-w-[90%] m-auto mt-10" in:fade={{delay: 1500, duration: 1500}}>
        <MedicalDisclaimer />
    </div>
{/if}

<Footer expand={true}/>

<style>
    #tree :global(.node) {
        cursor: pointer;
    }

    #tree :global(.node circle) {
        cursor: pointer;
        fill: #fff;
        stroke: var(--extralightbackground);
        stroke-width: 1.5px;
    }

    #tree :global(.node text) {
        font-size: 1rem;
        fill: var(--white);
    }

    #tree :global(path.link) {
        fill: none;
        stroke: #cccccc18;
        stroke-width: 1px;
    }

    #tree :global(.link-button) {
        background-color: var(--darkbackground);
        color: var(--white);
        border: none;
        border-radius: 2px;
        cursor: pointer;
    }

    #tree :global(.link-button:hover) {
        background-color: var(--supplement_highlight);
        color: var(--white);
    }
</style>
