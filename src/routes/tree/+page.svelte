<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Confetti } from "svelte-confetti";
    import TopBanner from '../../lib/components/TopBanner.svelte';
    import Footer from "../../lib/components/Footer.svelte";
    import PocketBase from 'pocketbase';
    import { Label, Input, Select, Popover } from 'flowbite-svelte';
    import { EnvelopeSolid, FileEditSolid, LinkSolid, CloseOutline, UserCircleSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
    import MedicalDisclaimer from "../../lib/components/MedicalDisclaimer.svelte";
    import * as d3 from 'd3';

    /** @type {import('./$types').PageData} */
	export let data;

    let svg, root, tree, diagonal;
    let animate = false;

    let throwConfetti = false;
    let contributeMode = false;
    let selectedNode;

    let isDragging = false;
    let startX, startY;

    function initDragging() {
        const container = document.querySelector('.tree');

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const currentTransform = container.style.transform || 'translate(0, 0)';
            const matrix = new WebKitCSSMatrix(currentTransform);
            container.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;

            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });
    }

    async function onSubmit() {

        if (contributeType === "treatment" && suggestion.trim() === "") {
            alert("Supplement/Treatment Suggestion is required.");
            return;
        } else if (contributeType === "link" && (link_text.trim() === "" || link_url.trim() === "" || category === "")) {
            alert("Category, Description, and URL are required.");
            return;
        } else if (!isValidUrl(link_url.trim())) {
            alert("URL is invalid.");
            return;
        }

        const pb = new PocketBase("https://pb.liminallyme.com");


        const data = {
            "relation": [selectedNode.parent.data.id],
            "name": contributeType === "link" ? category : suggestion.trim(),
            "link_text": contributeType === "link" ? link_text.trim() : null,
            "link": contributeType === "link" ? link_url.trim() : null,
            "community_contribution": true,
            "contributor_name": username.trim() || null
        };

        throwConfetti = true;
        try {
            const record = await pb.collection('tree').create(data);
            alert('Thank you for your contribution!');
        } catch (error) {
            console.log(data);
            alert('Something went wrong. Please try again.');
        }
        
        suggestion = category = link_text = link_url = username = "";
        throwConfetti = false;
    }

    function isValidUrl(str) {
        try {
            const url = new URL(str.includes("://") ? str : `https://${str}`); // This will throw if `str` is not a valid URL
            return true;
        } catch (_) {
            return false;
        }
    }

    function addToTree(d) {
        selectedNode = d;
        contributeType = '';
        contributeMode = true;
        console.log(d);
    }

    function collapse(d) {
        if (d.children && d.depth !== 0) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    
    function toggle(d) {
        if (d.data.isDummy){
            addToTree(d);
        } else {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }
    }

    function update(source) {
        const nodes = tree(root).descendants();
        const links = tree(root).links();

        // Reduce distance for leaf nodes
        nodes.forEach(d => {
            if (!d.children && !d._children) {
                d.y = d.depth * 210;
            } else {
                d.y = d.depth * 250;
            }
            d.x = d.x * 0.9;
        });

        const node = svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++i));

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
            .html(d => d.data.name)
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
                
                const linkText = d.data.link_text || d.data.link;
                const linkTextWidth = context.measureText(linkText).width;

                currentNode.append('foreignObject')
                    .attr('x', textWidth + 10)
                    .attr('y', -11)
                    .attr('width', linkTextWidth + 5)
                    .attr('height', 30)
                    .attr('color', '#f8f8f895')
                    .append('xhtml:div')
                    .html(`<button>: <span class="underline">${linkText}</span></button>`)
                    .on('click', (event, d) => {
                        event.stopPropagation();
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
            .attr('d', diagonal)
            .style('stroke-dasharray', d => d.target.data.isDummy ? '4,2' : 'none');

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

    function initTree() {
        // Initialize the tree layout and diagonal projection
        tree = d3.tree().size([height, width]);
        diagonal = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);

        svg = d3.select('.tree')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(120,10)`);

        // Load data
        root = d3.hierarchy(recordsTree);
        root.x0 = height / 2;
        root.y0 = 0;

        root.children.forEach(collapse);
        update(root);
    }

    function buildNestedRecords(records) {
        // Map each node by its ID for easy access
        const nodeMap = {};
        records.forEach(record => {
            nodeMap[record.id] = { ...record, children: [] };
        });

        let root = null;

        // Build the tree structure by linking children to parents
        records.forEach(record => {
            // Check if `relation` is empty, single, or an array
            if (!record.relation || record.relation.length === 0) {
                // Set as root node if it has no parent relations
                root = nodeMap[record.id];
            } else if (Array.isArray(record.relation)) {
                // If multiple parents, add this node to each parent’s children
                record.relation.forEach(parentId => {
                    const parent = nodeMap[parentId];
                    if (parent) {
                        parent.children.push(nodeMap[record.id]);
                    }
                });
            } else {
                // If single relation
                const parent = nodeMap[record.relation];
                if (parent) {
                    parent.children.push(nodeMap[record.id]);
                }
            }
        });

        Object.values(nodeMap).forEach(node => {
            if (node !== root && node.children.length >= 0 && !node.children.some(child => child.isDummy) && !node.link) {
                node.children.push({ name: '<tspan class="opacity-50">Add <tspan style="font-size: 1.2em;">⊕</tspan></tspan>', isDummy: true, parent: node });
            }
        });
        
        return root;
    }

    let width = 2560;
    let height = 800;
    let i = 0;
    const duration = 750;
    let recordsTree = null;

    onMount(async () => {
        animate = true
        recordsTree = buildNestedRecords(data.records)
        initTree();
        initDragging();
    });

    let contributeType = 'treatment';
    let suggestion = "";

    let category = "";
    let link_text = "";
    let link_url = "";
    let username = "";

    const category_options = [
        { value: 'Amazon Link', name: 'Amazon Link' },
        { value: 'Article Link', name: 'Article Link' },
        { value: 'Purchase Link', name: 'Purchase Link' }
    ];
</script>

<TopBanner />


{#if contributeMode}
    <div class="w-full flex justify-center bg-[var(--white)] px-4 py-4 rounded-lg my-5 max-w-[90%] sm:max-w-[60%] 2xl:max-w-[50%] mx-auto relative" in:fade={{duration: 200}}>
        <div class="absolute top-2 right-2"> <!-- Adjust top/right for positioning -->
            <button class="px-2 py-2 tems-center justify-center rounded-lg opacity-50" on:click={() => {contributeMode = false}}><CloseOutline size="xs" /></button>
        </div>
        <div class="w-[85%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] flex flex-col gap-4 pt-3">
            <div class="w-full flex flex-row justify-center gap-3">
                <button class="text-[var(--darkbackground)] px-4 py-1 rounded-lg outline outline-1 {contributeType === 'treatment' ? 'bg-[var(--darkbackground)] text-white' : ' bg-[var(--white)] text-[var(--darkbackground)]'}" style="outline-color: rgba(0, 0, 0, 0.2);" on:click={()=> {contributeType = 'treatment'}}>
                    <span class="flex flex-col">
                        <span>
                            Treatment
                        </span>
                        <span class="text-xs italic opacity-60">
                            Category
                        </span>
                    </span>
                </button>
                <div class="flex justify-center items-center h-full">
                    or
                </div>
                <button class="text-[var(--darkbackground)] px-4 py-1 rounded-lg outline outline-1 {contributeType === 'link' ? 'bg-[var(--darkbackground)] text-white' : ' bg-[var(--white)] text-[var(--darkbackground)]'}" style="outline-color: rgba(0, 0, 0, 0.2);" on:click={()=> {contributeType =  'link'}}>
                    <span class="flex flex-col">
                        <span>
                            Link
                        </span>
                        <span class="text-xs italic opacity-60">
                            URL
                        </span>
                    </span>
                </button>
            </div>

            <!-- TREE PREVIEW -->
            {#if contributeType}
                <hr class="border-t-2 border-gray-400" />
                <div class="flex flex-row justify-center bg-[var(--extradarkbackground)] rounded-lg px-2 py-4">
                    <!-- First Node -->
                    <div class="flex flex-col items-center w-[35%]">
                        <div class="flex flex-col justify-end items-center">
                            <div class="w-4 h-4 border-2 bg-white border-[var(--extralightbackground)] rounded-full"></div>
                            <span class="text-xs sm:text-sm mt-1 text-white text-center">{selectedNode.parent.data.name}</span>
                        </div>
                    </div>
                    <!-- Dashed Line -->
                    <div class="dashed-line justify-end opacity-50 w-[30%] mt-2"></div>
                    <!-- Second Node -->
                    <div class="flex flex-col items-center w-[35%]">
                        <div class="flex flex-col justify-end items-center">
                            <div class="w-4 h-4 border-2 bg-[var(--lightbackground)] border-gray-500 rounded-full"></div>
                            <a class="text-xs sm:text-sm mt-1 text-white text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] {link_url ? 'underline' : ''}" href={link_url} target="_blank">
                                {#if contributeType === 'treatment'}
                                    {suggestion || "Your Suggestion"}
                                {:else if contributeType === 'link'}
                                    {link_text || "Link Text"}
                                {/if}
                            </a>
                        </div>
                    </div>
                </div>
            {/if}

            {#if contributeType === 'treatment'}
                <!-- TREATMENT FORM -->
                <div class="flex flex-row justify-center">
                    <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="contribute"> 
                        <!-- {selectedNode.parent.data.name} -->
                        <Input name="name" type="text" size="lg" class="focus:outline-none focus:ring-transparent" style="border-color: var(--darkbackground);" placeholder="Treatment" bind:value={suggestion} required maxlength="75">
                                <FileEditSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span class="text-red-600 text-2xl align-middle" slot="right">*</span>
                        </Input>
                    </div>
                </div>
            {:else if contributeType === 'link'}
                <!-- LINK FORM -->
                <div class="flex flex-col leading-tight gap-2">
                    <div class="italic">Preferred Format:</div>
                    <div class="opacity-60 text-center">Ingredient - Dosage - Brand</div>
                    <div class="italic">Example:</div>
                    <div class="opacity-60 text-center">Ubiquinol - 50mg - HTN</div>
                </div>
                
                <div class="flex flex-col justify-center gap-4">
                <!-- CATEGORY -->
                    <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="category"> 
                        <!-- {selectedNode.parent.data.name} -->
                        <Select name="category" items={category_options} type="text" size="lg" class="focus:outline-none focus:ring-transparent" style="border-color: var(--darkbackground);" placeholder="Category" bind:value={category} required maxlength="75">
                                <FileEditSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span class="text-red-600 text-2xl align-middle">*</span>
                        </Select>
                    </div>

                <!-- LINK TEXT -->
                    <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="link_text"> 
                        <!-- {selectedNode.parent.data.name} -->
                        <Input name="link_text" type="text" size="lg" class="focus:outline-none focus:ring-transparent" style="border-color: var(--darkbackground);" placeholder="Link Description" bind:value={link_text} required maxlength="75">
                                <FileEditSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span class="text-red-600 text-2xl align-middle" slot="right">*</span>
                        </Input>
                    </div>

                <!-- LINK URL -->
                    <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="link_url"> 
                        <!-- {selectedNode.parent.data.name} -->
                        <Input name="link_url" type="text" size="lg" class="focus:outline-none focus:ring-transparent" style="border-color: var(--darkbackground);" placeholder="Link (URL)" bind:value={link_url} required maxlength="75">
                                <LinkSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span class="text-red-600 text-2xl align-middle" slot="right">*</span>
                        </Input>
                    </div>
                </div>
            {/if}

            {#if contributeType}
                <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="username"> 
                    <Input name="link_url" type="text" size="lg" class="focus:outline-none focus:ring-transparent" style="border-color: var(--darkbackground);" placeholder="Username" bind:value={username} maxlength="35">
                            <UserCircleSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span class="align-middle opacity-50" slot="right" id="usernameinfo"><InfoCircleSolid size="sm" /></span>
                    </Input>
                    <Popover class="w-64 text-sm font-light" triggeredBy="#usernameinfo" data-popper-placement="left">(optional) username will be used to credit you</Popover>
                </div>
                <div class="text-right">
                    <button type="submit" class="py-2 px-3 rounded-lg bg-white outline outline-1 text-base" style="outline-color: rgba(0, 0, 0, 0.15);" on:click={ onSubmit }>
                        Submit
                        {#if throwConfetti} <Confetti x={[-0.7, 0.7]} y={[-0.7, .7]} /> {/if}
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<div class="tree-container overflow-auto w-[100%] h-[800px] relative bg-[var(--extradarkbackground)]">
    <div class="grid-lines absolute inset-0 pointer-events-none"></div>
    <div class="tree relative z-1"></div>
</div>

{#if animate}
    <div class="flex flex-col ml-auto mr-auto pt-10 pb-12 max-w-[90%]" in:fade={{duration: 300}}>
        <MedicalDisclaimer />
    </div>
{/if}

<Footer />

<style>
    .tree-container {
        position: relative;
        -ms-overflow-style: none;
        scrollbar-width: none;
        cursor: grab;
    }
    
    .tree-container::-webkit-scrollbar {
        display: none;
    }

    .grid-lines {
        background-size: 30px 30px;
        opacity: 0.05;
        width: 500%;
        height: 120%;
        background-image:
            linear-gradient(to right, grey 1px, transparent 1px),
            linear-gradient(to bottom, grey 1px, transparent 1px);
        background-repeat: repeat;
        z-index: 1;
    }

    .tree :global(.node) {
        cursor: pointer;
    }

    .tree :global(.node circle) {
        cursor: pointer;
        fill: #fff;
        stroke: var(--extralightbackground);
        stroke-width: 1.5px;
    }

    .tree :global(.node text) {
        font-size: 1rem;
        fill: var(--white);
    }

    .tree :global(path.link) {
        fill: none;
        stroke: #cccccc23;
        stroke-width: 1px;
    }

    .tree :global(.link-button) {
        background-color: var(--white);
        color: var(--white);
        border: none;
        border-radius: 2px;
        cursor: pointer;
    }

    .tree :global(.link-button:hover) {
        background-color: var(--supplement_highlight);
        color: var(--white);
    }

    .dashed-line {
        max-height: 2px;
        background-image: linear-gradient(to right, transparent 50%, gray 50%);
        background-size: 20px 100%;
        animation: scroll 2s linear infinite; /* Adjust timing for speed */
    }

@keyframes scroll {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 20px 0; /* This should match the background size */
    }
}
</style>
