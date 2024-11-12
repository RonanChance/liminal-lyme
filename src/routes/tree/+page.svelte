<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Confetti } from "svelte-confetti";
    import TopBanner from '../../lib/components/TopBanner.svelte';
    import Footer from '../../lib/components/Footer.svelte';
    import { Input, Select, Popover, Spinner, AccordionItem, Accordion} from 'flowbite-svelte';
    import { FilePenSolid, LinkOutline, CloseOutline, UserCircleSolid, InfoCircleSolid, ChevronDownOutline, ChevronUpOutline, SearchOutline } from 'flowbite-svelte-icons';
    import MedicalDisclaimer from '../../lib/components/MedicalDisclaimer.svelte';
    import { isValidUrl } from '../../lib/utils/validations.js';
    import { initTouchEvents, initDragging } from '../../lib/utils/touchEvents.js';
    import { buildNestedRecords, findNodeByIdIgnoringHidden, findNodeById, collapse, expand } from '../../lib/utils/treeUtils';
    import { formatDistanceToNowStrict, parseISO } from 'date-fns';
    import * as d3 from 'd3';

    
    /**
     * @typedef {Object} Props
     * @property {import('./$types').PageData} data
     */

    /** @type {Props} */
    let { data } = $props();

    let svg, root, tree, diagonal;
    let animate = $state(false);

    let throwConfetti = $state(false);
    let contributeMode = $state(false);
    let deleteMode = $state(false);
    let isDeleting = $state(false);
    let selectedNode = $state();

    let contributeType = $state('treatment');
    let suggestion = $state("");

    let category = $state("");
    let link_text = $state("");
    let link_url = $state("");
    let username = $state("");

    const category_options = [
        { value: 'Amazon', name: 'Amazon' },
        { value: 'Article', name: 'Article' },
        { value: 'Podcast', name: 'Podcast' },
        { value: 'Purchase', name: 'Purchase' },
        { value: 'Website', name: 'Website' },
        { value: 'YouTube', name: 'YouTube'}
    ];

    let searchResults = $state([]);
    let searchQuery = $state("");

    let width = 2560;
    let height = 800;
    let i = 0;
    const duration = 600;
    let recordsTree = null;

    let container = $state();

    onMount(async () => {
        animate = true
        window.addEventListener('scroll', updateScrollPosition);
        recordsTree = buildNestedRecords(data.records)
        initTree();
        initDragging(container);
        initTouchEvents(container); // pinch-to-zoom
    });

    // ADDITIONS

    async function onSubmit() {

        if (contributeType === "treatment" && suggestion.trim() === "") {
            alert("Supplement/Treatment Suggestion is required.");
            return;
        } else if (contributeType === "link" && (link_text.trim() === "" || link_url.trim() === "" || category === "")) {
            alert("Category, Description, and URL are required.");
            return;
        } else if (contributeType === "link" && !isValidUrl(link_url.trim())) {
            alert("URL is invalid.");
            return;
        }

        const createRecord = {
            "relation": [selectedNode.parent.data.id],
            "name": contributeType === "link" ? category : suggestion.trim(),
            "link_text": contributeType === "link" ? link_text.trim() : null,
            "link": contributeType === "link" ? link_url.trim() : null,
            "community_contribution": true,
            "username": username.trim() || null,
            "verified": false
        };

        throwConfetti = true;

        // get path to the contribution
        let tempNode = selectedNode.parent;
        let pathString = "";
        while (tempNode != null) {
            pathString = tempNode.data.name + ">" + pathString;
            tempNode = tempNode.parent;
        }

        const response = await fetch('/tree/addNode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"record": createRecord, "path": pathString})
            });

        const result = await response.json();

        if (result.success) {
            alert('Thank you for contributing \u{1F389}\n\nCheck the tree to see your addition!\n\nNew additions can be removed by you or the community until verified by an admin.');
            data.records.push(result.record);
            addNodeToLocalTree(selectedNode.parent, result.record);
            suggestion = category = link_text = link_url = username = "";
            contributeMode = false;
        } else {
            alert('Something went wrong. Please refresh and try again.');
        }
        throwConfetti = false;
        
    }

    function addNodeToLocalTree(parentNode, newNodeData) {
        // Locate the existing node in the hierarchy
        const parent = findNodeByIdIgnoringHidden(root, parentNode.id);

        // Create a new node with D3 hierarchy structure, use parent x,y 
        // which will be adjusted in the update function
        const newNode = d3.hierarchy(newNodeData);
        newNode.depth = parent.depth + 1;
        newNode.height = 0;
        newNode.parent = parent;
        newNode.x = parent.x;
        newNode.x0 = parent.x;
        newNode.y = parent.y;
        newNode.y0 = parent.y;
        newNode.data = newNodeData;

        if (contributeType === 'treatment') {
            newNode._children = [{
                data: { 
                    name: '<tspan class="opacity-50">Add <tspan style="font-size: 1.2em;">⊕</tspan></tspan>', 
                    isDummy: true, 
                    verified: true
                },
                parent: newNode,
                depth: parent.depth + 2,
                x: parent.x,
                x0: parent.x,
                y: parent.y,
                y0: parent.y,
                children: null,
                _children: null
            }];
        } else {
            newNode._children = null;
        }

        parent.children.push(newNode);
        update(root);
    }

    //  DELETIONS

    async function handleDelete() {
        isDeleting = true;
        const response = await fetch('/tree/deleteNode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"nodeId": selectedNode.data.id})
            });

        const result = await response.json();
        if (result.success) {
            removeNodeFromLocalTree(selectedNode);
        } else {
            isDeleting = deleteMode = false;
            alert("Error deleting, plese refresh and try again.");
        }
        isDeleting = deleteMode = false;
    }

    function removeNodeFromLocalTree(nodeToRemove) {
        // Locate the existing node in the hierarchy
        const parent = nodeToRemove.parent;
        if (!parent) {
            isDeleting = deleteMode = false;
            alert("Node has no parent, cannot remove.");
        }

        // Remove the node from the parent's children array
        const index = parent.children.indexOf(nodeToRemove);
        if (index > -1) {
            parent.children.splice(index, 1);
        } else {
            isDeleting = deleteMode = false;
            alert("Error finding node, refresh and try again.")
        }

        update(root);
    }

    function update(source) {
        
        const nodes = tree(root).descendants();
        const links = tree(root).links();

        // Reduce distance for leaf nodes
        nodes.forEach(d => {
            d.y = d.depth * (d.children || d._children ? 250 : 210);
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

        // Append primary name text
        nodeEnter.append('text')
            .attr('x', d => d.children || d._children ? -10 : 10)
            .attr('dy', '.3em')
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .html(d => {
                // Display different icons based on the node name
                if (d.data.name === "Amazon") {
                    return `<tspan>🛒</tspan>`;
                } else if (d.data.name === "Article") {
                    return `<tspan>🔍</tspan>`;
                } else if (d.data.name === "Podcast") {
                    return `<tspan>🎧</tspan>`;
                } else if (d.data.name === "Purchase") {
                    return `<tspan>💰</tspan>`;
                } else if (d.data.name === "Website") {
                    return `<tspan>🔍</tspan>`;
                } else if (d.data.name === "YouTube") {
                    return `<tspan>🎥</tspan>`;
                } else {
                    return d.data.name;
                }
            })
            .attr('class', 'name-text') // Add a unique class
            .style('fill-opacity', 1) // Set opacity to 1 to ensure visibility
            .attr('height', 30);

        // Conditionally add the "X" button if not verified
        nodeEnter.filter(d => !d.data.verified)
            .append('text')
            .attr('class', 'remove-button')
            .attr('dy', '.38em')
            .style('cursor', 'pointer')
            .style('fill', 'red')
            .text('✖')
            .on('click', (event, d) => {
                event.stopPropagation();
                selectedNode = d;
                deleteMode = true;
            })
            .each(function(d) {
                // Calculate the width of the name text
                const nameWidth = this.previousSibling.getBBox().width;

                // Adjust position of the "X" based on name text width
                d3.select(this)
                    .attr('x', d.children || d._children ? -(nameWidth + 15) : -9 )
                    .attr('text-anchor', d.children || d._children ? 'end' : 'start');
            });
            
        // Append username text if available
        nodeEnter.append('text')
            .attr('x', d => d.children || d._children ? -10 : 33)
            .attr('dy', '2em') // Position the username below the name
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .html(d => { return d.data.username ? `\u{1F464} ${d.data.username}` : ''; })
            .attr('class', 'username-text') // Add a different class
            .style('fill', 'gray') // Optional styling for differentiation
            .style('font-size', '6pt')
            .style('fill-opacity', 0.5); // Set opacity to 1 to ensure visibility

        nodeEnter.each(function(d) {
            const currentNode = d3.select(this);
            const textNode = currentNode.select('text');
            const textWidth = textNode.node().getBBox().width;

            if (d.data.link) {
                // temporary canvas to measure text width
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                context.font = '16px Arial';
                
                const linkText = d.data.link_text || d.data.link;
                const linkTextWidth = context.measureText(linkText).width;

                currentNode.append('foreignObject')
                    .attr('x', textWidth + 10)
                    .attr('y', -11)
                    .attr('width', linkTextWidth + 25)
                    .attr('height', 30)
                    .attr('color', '#f8f8f895')
                    .append('xhtml:span')
                    .html(`<a href="${d.data.link.startsWith('http') ? d.data.link : `https://${d.data.link}`}" target="_blank" class="pl-1 underline" style="text-decoration: underline;">
                            ${linkText}</a>
                    `);
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
        root.x0 = height;
        root.y0 = 0;

        root.children.forEach(collapse);
        update(root);
    }

    // SUPPORTING FUNCTIONS

    function toggle(d) {
        if (d.data.isDummy){
            selectedNode = d;
            contributeType = '';
            contributeMode = true;
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

    function openTreeById(id) {
        window.scrollTo({
            top: 130,
            behavior: 'smooth'
        });
        let tempNode = findNodeById(root, id);
        while (tempNode != null) {
            expand(tempNode);
            tempNode = tempNode.parent;
        }
        update(root);
    }
    
    function findItemsByString(searchQuery) {
        let internalSearchResults = [];
        
        if (searchQuery.length >= 3) {
            data.records.forEach(element => {
                if (element.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    // make sure it's not "Amazon", "Article", etc.
                    if (!category_options.some(option => option.value === element.name)){
                        internalSearchResults.push({id: element.id, name: element.name})
                    }
                }
            });
            searchResults = internalSearchResults;
        } else {
            searchResults = [];
        }
    }
    
    // Reactive statement that searches when searchQuery changes
    $effect(() => { findItemsByString(searchQuery); });

    let pagePosition = $state(0);
    const updateScrollPosition = () => {
        pagePosition = window.scrollY;
    };

    function scrollPage() {
        if (pagePosition > 550) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 850,
                behavior: 'smooth'
            });
        }
    }

    function timeAgo(dateStr) {
        const date = parseISO(dateStr); // Parse the ISO date string
        return "~"+formatDistanceToNowStrict(date) + " ago"; // Calculate and return the time ago string
    }

</script>

<TopBanner />
{#if contributeMode}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="w-full flex justify-center bg-[var(--white)] px-4 py-4 rounded-lg my-5 max-w-[90%] sm:max-w-[60%] 2xl:max-w-[50%] mx-auto relative">
        <div class="absolute top-2 right-2">
            <button class="px-2 py-2 tems-center justify-center rounded-lg opacity-50" onclick={() => {contributeMode = false}}><CloseOutline size="xs" /></button>
        </div>

        <div class="w-[85%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] flex flex-col gap-4">
            <div class="text-center">Add to: <span class="opacity-60">{selectedNode.parent.data.name}</span></div>
            <div class="w-full flex flex-row justify-center gap-3">
                <button class="text-[var(--darkbackground)] px-4 py-1 rounded-lg outline outline-1 {contributeType === 'treatment' ? 'bg-[var(--darkbackground)] text-white' : ' bg-[var(--white)] text-[var(--darkbackground)]'}" style="outline-color: rgba(0, 0, 0, 0.2);" onclick={()=> {contributeType = 'treatment'}}>
                    <span class="flex flex-col">
                        <span>
                            Node
                        </span>
                        <span class="text-xs italic opacity-60">
                            Category/Treatment
                        </span>
                    </span>
                </button>
                <div class="flex justify-center items-center h-full">
                    or
                </div>
                <button class="text-[var(--darkbackground)] px-4 py-1 rounded-lg outline outline-1 {contributeType === 'link' ? 'bg-[var(--darkbackground)] text-white' : ' bg-[var(--white)] text-[var(--darkbackground)]'}" style="outline-color: rgba(0, 0, 0, 0.2);" onclick={()=> {contributeType =  'link'}}>
                    <span class="flex flex-col">
                        <span>
                            URL
                        </span>
                        <span class="text-xs italic opacity-60">
                            Website Link
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
                            <a class="text-xs sm:text-sm mt-1 text-white text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] {link_url ? 'underline' : ''}" href={link_url.startsWith('http') ? link_url : `https://${link_url}`} target="_blank" rel="noopener noreferrer">
                                {#if contributeType === 'treatment'}
                                    {suggestion || "Your Suggestion"}
                                {:else if contributeType === 'link'}
                                    {link_text || "URL Text"}
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
                        <Input name="name" type="text" class="focus:outline-none focus:ring-transparent text-base" style="border-color: var(--darkbackground);" placeholder="Treatment/Category" bind:value={suggestion} required maxlength="75" autocomplete="off">
                                <FilePenSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span class="text-red-600 text-2xl align-middle {suggestion ? "hidden" : ""}" slot="right">*</span>
                        </Input>
                    </div>
                </div>
            {:else if contributeType === 'link'}
                <!-- LINK FORM -->
                
                <div class="flex flex-col justify-center gap-4">

                <!-- CATEGORY -->
                <div class="relative inline-flex items-center w-full">
                    <Select
                        name="category"
                        items={category_options}
                        type="text"
                        class="focus:outline-none focus:ring-transparent text-base w-full {category ? "" : "text-opacity-60"}"
                        style="border-color: var(--darkbackground);"
                        placeholder="🏷&nbsp;&nbsp;&nbsp;Type"
                        bind:value={category}
                        required
                    >
                    </Select>
                    <span class="absolute top-1 right-3 text-red-600 text-2xl align-middle {category ? "hidden" : ""}">*</span>
                </div>

                <!-- LINK URL -->
                <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="link_url"> 
                    <!-- {selectedNode.parent.data.name} -->
                    <Input name="link_url" type="text" class="focus:outline-none focus:ring-transparent text-base" style="border-color: var(--darkbackground);" placeholder="Link (URL)" bind:value={link_url} required maxlength="200" autocomplete="off">
                            <LinkOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span class="text-red-600 text-2xl align-middle {link_url ? "hidden" : ""}" slot="right">*</span>
                    </Input>
                </div>

                <!-- LINK TEXT -->
                    <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="link_text"> 
                        <!-- {selectedNode.parent.data.name} -->
                        <Input name="link_text" type="text" class="focus:outline-none focus:ring-transparent text-base" style="border-color: var(--darkbackground);" placeholder="Link Description" bind:value={link_text} required maxlength="175" autocomplete="off">
                                <FilePenSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span class="text-red-600 text-2xl align-middle {link_text ? "hidden" : ""}" slot="right">*</span>
                        </Input>
                    </div>

                    <div class="flex flex-col leading-tight gap-1">
                        <div class="italic opacity-80">Preferred Link Description Format:</div>
                        <div class="opacity-60 flex flex-row justify-center gap-2">
                            Ingredient - Dosage - Brand
                            <span class="align-middle opacity-50" id="formatinfo"><InfoCircleSolid size="sm" /></span>
                        </div>
                        <span>
                            <Popover class="w-64 text-sm font-light" triggeredBy="#formatinfo" data-popper-placement="left">Use your best judgement here. Try to be concise, informative, and specific.</Popover>
                        </span>
                    </div>
                </div>
            {/if}

            {#if contributeType}
                <div class="text-[var(--darkbackground)] w-full text-lg text-center items-center flex flex-row gap-2 scroll-m-[4rem]" id="username"> 
                    <Input name="link_url" type="text" class="focus:outline-none focus:ring-transparent text-base" style="border-color: var(--darkbackground);" placeholder="Username" bind:value={username} maxlength="10" autocomplete="off">
                            <UserCircleSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span class="align-middle opacity-50" slot="right" id="usernameinfo"><InfoCircleSolid size="sm" /></span>
                    </Input>
                    <Popover class="w-64 text-sm font-light" triggeredBy="#usernameinfo" data-popper-placement="left">(optional) username will appear next to your contribution</Popover>
                </div>
                <div class="text-right">
                    <button type="submit" class="py-2 px-3 rounded-lg bg-white outline outline-1 text-base" style="outline-color: rgba(0, 0, 0, 0.15);" onclick={onSubmit}>
                        Submit
                        {#if throwConfetti} <Confetti x={[-0.7, 0.7]} y={[-0.7, .7]} /> {/if}
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>
{/if}

{#if deleteMode}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="w-fit flex flex-col justify-center bg-[var(--white)] px-8 pt-8 pb-6 rounded-lg my-5 max-w-[90%] mx-auto relative gap-2">
        <div class="absolute top-2 right-2">
            <button class="px-2 py-2 flex items-center justify-center rounded-lg opacity-50" onclick={() => {deleteMode = false}}>
                <CloseOutline size="xs" />
            </button>
        </div>
        <div class="text-center">Delete <span class="opacity-50">{selectedNode.data.name}</span></div>
        {#if selectedNode.data.link_text}
            <div class="text-center mx-auto max-w-fit text-xs">
                <span class="opacity-50">"{selectedNode.data.link_text}"</span>
            </div>
        {/if}
        <div class="flex flex-row justify-center items-center gap-2">
            <button class="py-2 px-3 rounded-lg bg-white outline outline-1 text-base" style="outline-color: rgba(0, 0, 0, 0.15);" onclick={() => { deleteMode = false }}>
                Cancel
            </button>
            {#if !isDeleting}
                <button class="py-2 px-3 rounded-lg bg-white outline outline-1 text-base" style="outline-color: rgba(0, 0, 0, 0.15);" onclick={handleDelete}>
                    Delete
                </button>
            {:else}
                <Spinner color="green" />
            {/if}
        </div>
    </div>
</div>
{/if}

<div class="tree-container overflow-auto w-[100%] h-[800px] relative bg-[var(--extradarkbackground)]">
    <div class="grid-lines absolute inset-0 pointer-events-none"></div>
    <div class="tree relative z-1 ml-[1%] sm:ml-[3%] lg:ml-[5%] xl:ml-[10%]" bind:this={container}></div>
</div>

{#if animate}
<div class="pt-6 pb-6 mx-auto max-w-[90%] sm:max-w-[60%] lg:max-w-[40%] flex flex-col gap-5" in:fade={{duration: 300}}>
    
    <div class="w-[100%] sm:max-w-[80%] mx-auto text-[var(--white)]">
        <div class="flex flex-col">
            <Input name="name" type="text" class="focus:outline-none focus:ring-transparent text-base" style="border-color: var(--darkbackground);" placeholder="Search Tree" bind:value={searchQuery} autocomplete="off">
                <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Input>
        </div>
        <div class="pt-2 w-[95%] mx-auto">
            {#if searchResults.length > 0}
                {#each searchResults as result}
                    <div class="flex flex-row justify-between pb-1">
                        {result.name} <button class="underline" onclick={() => {openTreeById(result.id)}}>Show</button>
                    </div>
                {/each}
            {:else}
                {#if searchQuery.length >= 3}
                    No results.
                {/if}
            {/if}
        </div>
    </div>

    <div class="notification-scroll-container w-[90%] sm:max-w-[80%] mx-auto text-[var(--white)] max-h-[250px] overflow-y-auto rounded-lg">
        {#each data.recentRecords as { id, created, name, link, link_text } (id)}
            <div class="bg-[var(--white)] text-[var(--darkbackground)] rounded-lg p-2 my-2 flex flex-row items-center justify-between">
                <div class="icon ml-2 mr-4 scale-125">
                    {#if name === "Amazon"}
                    🛒
                    {:else if name === "Article"}
                    🔍
                    {:else if name === "Podcast"}
                    🎧
                    {:else if name === "Purchase"}
                    💰
                    {:else if name === "Website"}
                    🔍
                    {:else if name === "YouTube"}
                    🎥
                    {:else}
                    💡
                    {/if}
                </div>
                <div class="flex flex-col">
                    <div class="title w-[20ch] text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis">
                        {#if link_text}
                            {link_text}
                        {:else}
                            {name}
                        {/if}
                    </div>
                </div>
                <div class="ml-auto mr-2">
                    <div class="time text-xs">
                        {timeAgo(created)}
                    </div>
                    <div class="flex flex-row justify-end">
                        <button class="underline text-xs" onclick={() => {openTreeById(id)}}>Show</button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <div>
        <Accordion flush >
            <AccordionItem>
                <span slot="header" class="text-2xl text-[var(--white)] mx-auto">How to Contribute?</span>
                <div slot="arrowup"><ChevronUpOutline class="h-4 w-4 -me-0.5 text-white" /></div>
                    <span slot="arrowdown"><ChevronDownOutline class="h-4 w-4 -me-0.5 text-white" /></span>
                <p class="mb-2">
                    1. Find a location in the tree where your contribution fits (try to be mindful of the categories).<br /><br />
                    2. Click the dotted line "Add" button.<br /><br />
                    3. Select Node or URL, fill out the necessary information.<br /><br />
                    4. Submit your recommendation!
                </p>
            </AccordionItem>
            <AccordionItem>
                <span slot="header" class="text-2xl text-[var(--white)] mx-auto">What is Allowed?</span>
                <div slot="arrowup"><ChevronUpOutline class="h-4 w-4 -me-0.5 text-white" /></div>
                    <span slot="arrowdown"><ChevronDownOutline class="h-4 w-4 -me-0.5 text-white" /></span>
                <p class="mb-2">
                    The best contributions are treatments you have personal experience with.<br /><br />
                    The first categories (Pharmacological, Dietary Supplements, Detox & Herx) are for single active ingredients.<br /><br />
                    Blended products, mixes by your physician, and other less commonly established ideas need to be placed in the Brands & Blends, or Miscellaneous category.
                </p>
            </AccordionItem>
            <AccordionItem>
                <span slot="header" class="text-2xl text-[var(--white)] mx-auto">Can't Find Contribution?</span>
                <div slot="arrowup"><ChevronUpOutline class="h-4 w-4 -me-0.5 text-white" /></div>
                    <span slot="arrowdown"><ChevronDownOutline class="h-4 w-4 -me-0.5 text-white" /></span>
                <p class="mb-2">
                    Your contribution was likely moved!<br /><br />
                    I try my best not to delete community additions, but I do recategorize them.<br /><br />
                    Use the search feature to find the location of specific items!
                </p>
            </AccordionItem>
        </Accordion>
    </div>
</div>

<div class="flex flex-col ml-auto mr-auto pt-6 pb-6 max-w-[90%] opacity-40">
    <MedicalDisclaimer />
</div>

<Footer />

<!-- svelte-ignore a11y_consider_explicit_label -->
<button class="sm:hidden fixed bottom-0 left-0 ml-8 bg-white rounded-t w-11 h-11 z-10 flex items-center justify-center p-2" onclick={scrollPage}>
    {#if pagePosition < 550}
        <svg fill="var(--darkbackground)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon flat-color w-full h-full">
            <g>
                <path id="primary" d="M2.13,4.51A1,1,0,0,1,3,4a1,1,0,0,1,.49.13L12,8.86l8.51-4.73a1,1,0,0,1,1,1.74l-9,5a1,1,0,0,1-1,0l-9-5A1,1,0,0,1,2.13,4.51Zm18.38,8.62L12,17.86,3.49,13.13A1,1,0,0,0,3,13a1,1,0,0,0-.49,1.87l9,5a1,1,0,0,0,1,0l9-5a1,1,0,1,0-1-1.74Z" style="fill: var(--darkbackground);"></path>
            </g>
        </svg>
    {:else}
        <svg fill="var(--darkbackground)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon flat-color w-full h-full">
            <g transform="rotate({pagePosition < 550 ? 0 : 180}, 12, 12)">
                <path id="primary" d="M2.13,4.51A1,1,0,0,1,3,4a1,1,0,0,1,.49.13L12,8.86l8.51-4.73a1,1,0,0,1,1,1.74l-9,5a1,1,0,0,1-1,0l-9-5A1,1,0,0,1,2.13,4.51Zm18.38,8.62L12,17.86,3.49,13.13A1,1,0,0,0,3,13a1,1,0,0,0-.49,1.87l9,5a1,1,0,0,0,1,0l9-5a1,1,0,1,0-1-1.74Z" style="fill: var(--darkbackground);"></path>
            </g>
        </svg>
    {/if}
</button>

{/if}

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

    .notification-scroll-container {
        -ms-overflow-style: none; /* for Internet Explorer, Edge */
        scrollbar-width: none; /* for Firefox */
        overflow-y: auto;
        -webkit-mask-image: linear-gradient(180deg, var(--darkbackground) 80%, transparent);
    }
    .notification-scroll-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
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