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

    const icons = {
        Amazon: "#icon-amazon",
        Article: "#icon-article",
        Podcast: "#icon-podcast",
        Purchase: "#icon-purchase",
        Website: "#icon-website",
        YouTube: "#icon-youtube"
    };

    let searchResults = $state([]);
    let searchQuery = $state("");

    let width = 3000;
    let height = 8000;
    let i = 0;
    const duration = 600;
    let recordsTree = null;

    let container = $state();
    let outerContainer = $state();

    onMount(async () => {
        animate = true
        recordsTree = buildNestedRecords(data.records)
        initTree();
        initDragging(container);
        initTouchEvents(container); // pinch-to-zoom
        if (outerContainer) {
            let scrollAmount;
            if (window.innerWidth <= 400) scrollAmount = 3800;
            else if (window.innerWidth <= 768) scrollAmount = 3770;
            else if (window.innerWidth <= 1280) scrollAmount = 3680;
            else if (window.innerWidth <= 1440) scrollAmount = 3730;
            else if (window.innerWidth <= 1920) scrollAmount = 3700;
            else if (window.innerWidth <= 2560) scrollAmount = 3600;
            else scrollAmount = 3600;
            outerContainer.scrollTop = scrollAmount;
        }
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
            addNodeToRecentRecords(result.record);
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
                    name: 'Add Node', 
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

        // add the new node alphabetically
        let insertionIndex = parent.children.findIndex(element => element.data.name.localeCompare(newNodeData.name, undefined, { sensitivity: 'base' }) > 0);
        if (insertionIndex === -1) {
            parent.children.push(newNode);
        } else {
            parent.children.splice(insertionIndex, 0, newNode);
        }
        update(root);
    }

    function addNodeToRecentRecords(record) {
        data.recentRecords.unshift(record);
        data = { ...data };
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
            removeNodeFromRecentRecords();
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

    function removeNodeFromRecentRecords() {
        data.recentRecords.shift();
        data = { ...data };
    }

    // TREE UPDATES

    function update(source) {
        
        const nodes = tree(root).descendants();
        const links = tree(root).links();

        // Reduce distance for leaf nodes
        nodes.forEach(d => {
            // d.y = d.depth * (d.children || d._children ? 250 : 210);
            d.y = d.y + (d.children || d._children ? 0 : -150);
            // d.x = d.x / 2.5;
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

        nodeEnter.append('g') // Grouping for text + icon
            .attr('class', 'node-group') 
            .each(function (d) {
                const group = d3.select(this);

            // Append SVG icons based on node name
            if (d.data.name === "Amazon") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 5)
                    .attr('y', -8)
                    .append('use')
                    .attr('xlink:href', '#icon-amazon'); // Your icon reference
            } else if (d.data.name === "Article") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 5)
                    .attr('y', -8)
                    .append('use')
                    .attr('xlink:href', '#icon-article'); 
            } else if (d.data.name === "Podcast") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 5)
                    .attr('y', -8)
                    .append('use')
                    .attr('xlink:href', '#icon-podcast'); 
            } else if (d.data.name === "Purchase") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 5)
                    .attr('y', -8)
                    .append('use')
                    .attr('xlink:href', '#icon-purchase'); 
            } else if (d.data.name === "Website") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 5)
                    .attr('y', -8)
                    .append('use')
                    .attr('xlink:href', '#icon-website'); 
            } else if (d.data.name === "YouTube") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 5)
                    .attr('y', -8)
                    .append('use')
                    .attr('xlink:href', '#icon-youtube'); 
            } else if (d.data.name === "Add Node") {
                group.append('svg')
                    .attr('class', 'icon')
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 80)
                    .attr('y', -8)
                    .style('opacity', 0.5)
                    .append('use')
                    .attr('xlink:href', '#icon-add-node'); 
                group.append('text')
                    .attr('x', d => d.children || d._children ? -10 : 10)
                    .attr('dy', '.3em')
                    .style('opacity', 0.5)
                    .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
                    .text(d.data.name)
                    .attr('class', 'name-text');
            } else {
                group.append('text')
                    .attr('x', d => d.children || d._children ? -10 : 10)
                    .attr('dy', '.3em')
                    .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
                    .text(d.data.name)
                    .attr('class', 'name-text');
            }
        });

    // Conditionally add the "remove" icon if not verified
    nodeEnter.filter(d => !d.data.verified)
        .append('svg')
        .attr('class', 'remove-button')
        .attr('width', 16)
        .attr('height', 16)
        .style('cursor', 'pointer')
        .style('fill', 'red')
        .style('opacity', 0.7)
        .on('click', (event, d) => {
            event.stopPropagation();
            selectedNode = d;
            deleteMode = true;
        })
        .each(function(d) {
            // Calculate the width of the name text
            const nameWidth = this.previousSibling.getBBox().width;
            d3.select(this)
                .attr('x', d.children || d._children ? -(nameWidth + 35) : -20)
                .attr('y', -8);
        })
        // Add an invisible rectangle for a larger click target width/height
        .append('rect')
        .attr('width', 32)
        .attr('height', 32)
        .attr('x', -8)
        .attr('y', -8)
        .style('fill', 'transparent')
        .style('pointer-events', 'all');
        
        // Add the icon inside the svg
        nodeEnter.select('.remove-button')
            .append('use')
            .attr('xlink:href', '#icon-remove')
            .attr('x', 0)
            .attr('y', 0);

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
                    .attr('x', 30)
                    .attr('y', -12)
                    .attr('width', linkTextWidth + 25)
                    .attr('height', 30)
                    .attr('color', '#f8f8f895')
                    .append('xhtml:span')
                    .html(`<a href="${d.data.link.startsWith('http') ? d.data.link : `https://${d.data.link}`}" target="_blank" class="underline" style="text-decoration: underline;">
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
        tree.nodeSize([40, 235])
        diagonal = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);

        svg = d3.select('.tree')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(105,4000)`);

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
            top: 10,
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

<div class="tree-container overflow-auto bg-[var(--darkbackground)] max-h-[55vh] sm:max-h-[70vh] sm:max-w-[80%] sm:mx-auto sm:mt-4 rounded-lg outline outline-1 mx-2 mt-2" style="outline-color: rgba(255, 255, 255, 0.4);" bind:this={outerContainer}>
    <div class="grid-lines absolute top-0 left-0 w-full h-full pointer-events-none" style="height: 8000px;"></div>
    <div class="tree relative z-1 sm:ml-[6%] lg:ml-[5%] xl:ml-[13%] 3xl:ml-[18%] 4xl:ml-[25%]" bind:this={container}></div>
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
                <div class="icon ml-2 mr-4">
                    <svg width="25" height="25">
                        <use href={icons[name] || "#icon-tree"} />
                    </svg>
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

{/if}

<!-- Define SVGs -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <defs>
        <symbol id="icon-amazon" viewBox="0 0 24 24">
            <svg viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Amazon-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-601.000000, -560.000000)"> <g id="Amazon" transform="translate(601.000000, 560.000000)"> <path d="M25.4026553,25.9595294 C24.660417,27.4418824 23.3876054,28.3962353 22.0103725,28.7181176 C21.8015298,28.7181176 21.4826213,28.8225882 21.1637129,28.8225882 C18.835399,28.8225882 17.458166,27.0211765 17.458166,24.3727059 C17.458166,20.9788235 19.4703937,19.392 22.0103725,18.6465882 C23.3876054,18.3303529 24.9793255,18.2230588 26.5682233,18.2230588 L26.5682233,19.4964706 C26.5682233,21.9331765 26.6726447,23.8390588 25.4026553,25.9595294 L25.4026553,25.9595294 Z M26.5682233,13.3524706 C25.1909904,13.4569412 23.5992703,13.5614118 22.0103725,13.7703529 C19.574815,14.0922353 17.1392576,14.5157647 15.1298521,15.4701176 C11.2098182,17.0597647 8.55977364,20.4508235 8.55977364,25.4287059 C8.55977364,31.6856471 12.5842289,34.8621176 17.6726531,34.8621176 C19.3659723,34.8621176 20.7432053,34.6475294 22.0103725,34.3341176 C24.0282445,33.696 25.7187415,32.5298824 27.7309692,30.4094118 C28.8965372,31.9990588 29.2182679,32.7444706 31.2276733,34.4385882 C31.7582467,34.6475294 32.28882,34.6475294 32.7093276,34.3341176 C33.9821392,33.2724706 36.208854,31.3637647 37.3715998,30.3049412 C37.9021732,29.8814118 37.7977518,29.2432941 37.4760212,28.7181176 C36.3132753,27.2329412 35.1448851,25.9595294 35.1448851,23.0992941 L35.1448851,13.5614118 C35.1448851,9.53505882 35.4666157,5.82494118 32.5004849,3.072 C30.0649275,0.849882353 26.2493149,0 23.2831841,0 L22.0103725,0 C16.6115064,0.313411765 10.8937319,2.64564706 9.61809814,9.32329412 C9.40643324,10.1731765 10.0442501,10.4894118 10.4675799,10.5938824 L16.3998415,11.3364706 C17.0348362,11.2291765 17.3537447,10.6983529 17.458166,10.1731765 C17.9859172,7.84094118 19.8937235,6.67482353 22.0103725,6.46023529 L22.4365245,6.46023529 C23.7093361,6.46023529 25.086569,6.99105882 25.8259851,8.05270588 C26.6726447,9.32329412 26.5682233,11.0202353 26.5682233,12.5054118 L26.5682233,13.3524706 L26.5682233,13.3524706 Z" fill="#b0b8bf"> </path> <path d="M47.9943556,35.9463529 L47.9943556,35.9435294 C47.971778,35.4437647 47.8673567,35.0625882 47.658514,34.7463529 L47.6359364,34.7152941 L47.6105366,34.6842353 C47.3988717,34.4527059 47.1956734,34.3651765 46.9755419,34.2691765 C46.3179696,34.0150588 45.3612442,33.8795294 44.2097872,33.8767059 C43.382883,33.8767059 42.4713128,33.9557647 41.5540982,34.1562353 L41.551276,34.0941176 L40.6284171,34.4018824 L40.6114839,34.4103529 L40.0893771,34.5797647 L40.0893771,34.6023529 C39.47696,34.8564706 38.9209869,35.1727059 38.4045245,35.5482353 C38.0827939,35.7882353 37.8175072,36.1072941 37.8033962,36.5957647 C37.7949296,36.8611765 37.9303952,37.1661176 38.1533489,37.3468235 C38.3763025,37.5275294 38.6359448,37.5896471 38.8645429,37.5896471 C38.9181647,37.5896471 38.9689643,37.5868235 39.0141194,37.5783529 L39.0592746,37.5755294 L39.093141,37.5698824 C39.5446928,37.4738824 40.2022651,37.4089412 40.9727253,37.3016471 C41.6331198,37.2282353 42.3330251,37.1745882 42.9397978,37.1745882 C43.368772,37.1717647 43.7554132,37.2028235 44.0206999,37.2592941 C44.1533432,37.2875294 44.2521202,37.3214118 44.3057419,37.3496471 C44.3254973,37.3552941 44.3396083,37.3637647 44.3480749,37.3694118 C44.3593637,37.4061176 44.3762969,37.5021176 44.3734747,37.6348235 C44.3791191,38.1430588 44.164632,39.0861176 43.8683012,40.0065882 C43.5804369,40.9270588 43.2304843,41.8503529 42.999064,42.4630588 C42.94262,42.6042353 42.9059314,42.7595294 42.9059314,42.9289412 C42.900287,43.1745882 43.0018862,43.4738824 43.2163733,43.6715294 C43.425216,43.8691765 43.696147,43.9482353 43.9219229,43.9482353 L43.9332117,43.9482353 C44.2718756,43.9454118 44.5597398,43.8098824 44.8080933,43.6150588 C47.1505182,41.5087059 47.9661336,38.1430588 48,36.2484706 L47.9943556,35.9463529 Z M41.0489247,38.8658824 C40.8090378,38.8630588 40.5635065,38.9195294 40.3349084,39.0268235 C40.0780883,39.1284706 39.8156239,39.2470588 39.5672704,39.3515294 L39.2032068,39.504 L38.7290774,39.6931765 L38.7290774,39.6988235 C33.5785648,41.7882353 28.16841,43.0136471 23.1618295,43.1209412 C22.9783866,43.1265882 22.7921215,43.1265882 22.614323,43.1265882 C14.7403887,43.1322353 8.31706456,39.4785882 1.83729642,35.8785882 C1.61152053,35.76 1.37727804,35.6978824 1.15150215,35.6978824 C0.860815683,35.6978824 0.561662624,35.808 0.344353327,36.0112941 C0.12704403,36.2174118 -0.00277710907,36.5138824 4.50895989e-05,36.816 C-0.00277710907,37.2084706 0.208887791,37.5698824 0.505218651,37.8042353 C6.58705678,43.0870588 13.25309,47.9943529 22.2192152,48 C22.3941915,48 22.57199,47.9943529 22.7497885,47.9915294 C28.453452,47.8644706 34.902176,45.936 39.9087564,42.7905882 L39.9398006,42.7708235 C40.5945507,42.3783529 41.2493008,41.9322353 41.8673623,41.4381176 C42.2511813,41.1529412 42.516468,40.7068235 42.516468,40.2437647 C42.4995348,39.4221176 41.8024517,38.8658824 41.0489247,38.8658824 Z" id="Fill-237" fill="#FF9A00"> </path> </g> </g> </g> </g></svg>
        </symbol>

        <symbol id="icon-article" viewBox="0 0 24 24">
            <svg viewBox="0 0 48 48" enable-background="new 0 0 48 48" id="_x3C_Layer_x3E_" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="analysis_x2C__analytics_x2C__magnifier"> <g> <g> <rect fill="#B3E5FC" height="6" id="XMLID_7_" transform="matrix(0.707 -0.7072 0.7072 0.707 -13.014 31.4223)" width="4" x="29.418" y="28.418"></rect> <path d="M32.126,35.661l-4.95-4.95l3.535-3.536l4.95,4.95L32.126,35.661z M28.59,30.711l3.536,3.536l2.121-2.122 l-3.536-3.536L28.59,30.711z" fill="#0277BD"></path> </g> <g> <path d="M45.207,42.379l-2.828,2.828c-0.391,0.391-1.023,0.391-1.414,0l-9.899-9.899 c-0.391-0.391-0.391-1.023,0-1.414l2.828-2.829c0.391-0.39,1.023-0.39,1.414,0l9.899,9.9 C45.598,41.355,45.598,41.988,45.207,42.379z" fill="#8C9EFF" id="XMLID_6_"></path> <path d="M41.672,45.999c-0.384,0-0.769-0.146-1.061-0.438l-9.899-9.899c-0.585-0.585-0.585-1.536,0-2.121 l2.828-2.829c0.584-0.584,1.535-0.583,2.121,0l9.899,9.9c0.585,0.585,0.585,1.537,0,2.122l-2.828,2.828 C42.44,45.853,42.056,45.999,41.672,45.999z M34.601,31.272c-0.128,0-0.256,0.049-0.354,0.146l-2.828,2.829 c-0.195,0.195-0.195,0.512,0,0.707l9.899,9.899c0.195,0.195,0.512,0.195,0.707,0l2.828-2.828c0.195-0.195,0.195-0.512,0-0.708 l-9.899-9.9C34.856,31.321,34.729,31.272,34.601,31.272z" fill="#0277BD"></path> </g> <path d="M43.602,41.273c-0.128,0-0.256-0.049-0.354-0.146l-7.778-7.778c-0.195-0.195-0.195-0.512,0-0.707 s0.512-0.195,0.707,0l7.778,7.778c0.195,0.195,0.195,0.512,0,0.707C43.857,41.224,43.729,41.273,43.602,41.273z" fill="#E8EAF6"></path> </g> <g> <circle cx="18.5" cy="18.5" fill="#E1F5FE" id="XMLID_1_" r="16"></circle> <path d="M18.5,35C9.402,35,2,27.598,2,18.5S9.402,2,18.5,2S35,9.402,35,18.5c0,3.703-1.198,7.202-3.466,10.119 c-0.171,0.218-0.485,0.256-0.701,0.087c-0.218-0.169-0.258-0.483-0.088-0.701C32.874,25.266,34,21.979,34,18.5 C34,9.953,27.047,3,18.5,3S3,9.953,3,18.5S9.953,34,18.5,34c4.027,0,7.844-1.538,10.745-4.33c0.198-0.19,0.515-0.186,0.707,0.014 c0.191,0.199,0.186,0.516-0.014,0.707C26.85,33.363,22.788,35,18.5,35z" fill="#0277BD"></path> <g> <circle cx="18.5" cy="18.5" fill="#B3E5FC" id="XMLID_9_" r="13.5"></circle> <path d="M18.5,32.5c-7.72,0-14-6.28-14-14s6.28-14,14-14s14,6.28,14,14S26.22,32.5,18.5,32.5z M18.5,5.5 c-7.168,0-13,5.832-13,13s5.832,13,13,13s13-5.832,13-13S25.668,5.5,18.5,5.5z" fill="#FFFFFF"></path> </g> <path d="M17.627,8.536c-0.258,0-0.477-0.198-0.497-0.459c-0.022-0.275,0.183-0.517,0.457-0.539 C17.889,7.513,18.192,7.5,18.5,7.5C18.776,7.5,19,7.724,19,8s-0.224,0.5-0.5,0.5c-0.28,0-0.557,0.012-0.831,0.034 C17.654,8.535,17.641,8.536,17.627,8.536z" fill="#FFFFFF"></path> <path d="M8,19c-0.276,0-0.5-0.224-0.5-0.5c0-4.645,2.938-8.811,7.313-10.367c0.261-0.094,0.547,0.043,0.639,0.304 c0.093,0.26-0.043,0.546-0.303,0.639C11.172,10.49,8.5,14.277,8.5,18.5C8.5,18.776,8.276,19,8,19z" fill="#FFFFFF"></path> </g> </g> </g></svg>
        </symbol>

        <symbol id="icon-podcast" viewBox="0 0 24 24">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#7D98B3;" d="M239.304,417.391v77.913c0,9.22,7.474,16.696,16.696,16.696c9.22,0,16.696-7.475,16.696-16.696 v-77.913c0-9.223-7.475-16.696-16.696-16.696C246.778,400.696,239.304,408.169,239.304,417.391"></path> <path style="fill:#1F63AD;" d="M322.78,478.609H189.215c-9.22,0-16.696,7.473-16.696,16.696c0,9.22,7.475,16.696,16.696,16.696 H322.78c9.22,0,16.696-7.475,16.696-16.696C339.475,486.082,331.999,478.609,322.78,478.609z"></path> <path style="fill:#004999;" d="M322.78,478.609h-66.783V512h66.783c9.22,0,16.696-7.475,16.696-16.696 C339.475,486.082,331.999,478.609,322.78,478.609z"></path> <path style="fill:#B8C8D9;" d="M406.26,250.437c-0.014,82.793-67.357,150.244-150.261,150.261 c-82.794-0.017-150.248-67.355-150.262-150.261c0-9.223-7.474-16.696-16.695-16.696c-9.222,0-16.695,7.473-16.695,16.696 c0.03,101.307,82.342,183.62,183.651,183.65c101.308-0.03,183.62-82.343,183.651-183.65c0-9.223-7.474-16.696-16.695-16.696 C413.734,233.741,406.26,241.214,406.26,250.437L406.26,250.437z"></path> <path style="fill:#A3B8CC;" d="M439.652,250.437c0-9.223-7.475-16.696-16.696-16.696c-9.22,0-16.693,7.473-16.693,16.696h-0.002 c-0.014,82.792-67.357,150.244-150.261,150.261v33.389C357.308,434.057,439.618,351.744,439.652,250.437z"></path> <path style="fill:#E6F3FF;" d="M255.999,0c-58.769,0-107.519,43.743-115.535,100.174c-1.001,5.341-1.335,11.018-1.335,16.696 v133.565c0,64.445,52.424,116.87,116.87,116.87s116.87-52.424,116.87-116.87V116.87C372.869,52.424,320.444,0,255.999,0z"></path> <path style="fill:#CFDBE6;" d="M372.869,116.87v133.565c0,64.445-52.424,116.87-116.87,116.87V0 C320.444,0,372.869,52.424,372.869,116.87z"></path> <path style="fill:#1F63AD;" d="M139.13,233.739v16.696c0.03,64.49,52.378,116.839,116.87,116.87 c64.492-0.03,116.839-52.38,116.87-116.87v-16.696H139.13z"></path> <path style="fill:#004999;" d="M255.999,233.739v133.565c64.492-0.03,116.839-52.38,116.87-116.87v-16.696H255.999z"></path> <g> <path style="fill:#A3B8CC;" d="M372.869,116.87v16.696h-50.087c-9.351,0-16.696-7.347-16.696-16.696 c0-9.351,7.345-16.696,16.696-16.696h48.751C372.534,105.515,372.869,111.192,372.869,116.87z"></path> <path style="fill:#A3B8CC;" d="M372.869,166.957v33.391h-50.087c-9.351,0-16.696-7.347-16.696-16.696 c0-9.351,7.345-16.696,16.696-16.696H372.869z"></path> </g> <g> <path style="fill:#B8C8D9;" d="M205.912,116.87c0,9.348-7.345,16.696-16.696,16.696H139.13V116.87 c0-5.678,0.334-11.354,1.335-16.696h48.752C198.566,100.174,205.912,107.519,205.912,116.87z"></path> <path style="fill:#B8C8D9;" d="M205.912,183.652c0,9.348-7.345,16.696-16.696,16.696H139.13v-33.391h50.087 C198.566,166.957,205.912,174.301,205.912,183.652z"></path> </g> </g></svg>
        </symbol>

        <symbol id="icon-purchase" viewBox="0 0 24 24">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 508.1 508.1" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#54C0EB;" d="M486.8,145.75H21.2c-11.7,0-21.2,9.5-21.2,21.2v60.6c0,11.7,9.5,21.2,21.2,21.2h465.7 c11.7,0,21.2-9.5,21.2-21.2v-60.6C508,155.25,498.5,145.75,486.8,145.75z"></path> <g> <path style="fill:#c8c8c8;" d="M185.7,10.55l-147,147.1c-14,14-14,36.8,0,50.8s36.8,14,50.8,0l147-147.1c14-14,14-36.8,0-50.8 S199.8-3.45,185.7,10.55z"></path> <path style="fill:#c8c8c8;" d="M469.3,157.65l-147-147.1c-14-14-36.8-14-50.8,0s-14,36.8,0,50.8l147.1,147.1c14,14,36.8,14,50.8,0 C483.4,194.45,483.4,171.65,469.3,157.65z"></path> </g> <g> <circle style="fill:#40596B;" cx="62.6" cy="184.45" r="14.8"></circle> <circle style="fill:#40596B;" cx="445.4" cy="184.45" r="14.8"></circle> </g> <path style="fill:#84DBFF;" d="M36.6,248.75l2.4,14.1l36.3,217.2c2.9,16.2,16.9,28,33.4,28h290.6c16.4,0,30.5-11.8,33.4-28 l36.3-217.2l2.4-14.1L36.6,248.75L36.6,248.75z M129.4,406.45c0,8.5-6.9,15.5-15.5,15.5s-15.5-6.9-15.5-15.5v-97.6 c0-8.5,6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5V406.45z M199.5,406.45c0,8.5-6.9,15.5-15.5,15.5c-8.5,0-15.5-6.9-15.5-15.5v-97.6 c0-8.5,6.9-15.5,15.5-15.5c8.5,0,15.5,6.9,15.5,15.5V406.45z M269.5,406.45c0,8.5-6.9,15.5-15.5,15.5c-8.5,0-15.5-6.9-15.5-15.5 v-97.6c0-8.5,6.9-15.5,15.5-15.5c8.5,0,15.5,6.9,15.5,15.5V406.45z M339.5,406.45c0,8.5-6.9,15.5-15.5,15.5 c-8.5,0-15.5-6.9-15.5-15.5v-97.6c0-8.5,6.9-15.5,15.5-15.5c8.5,0,15.5,6.9,15.5,15.5V406.45z M409.5,406.45 c0,8.5-6.9,15.5-15.5,15.5l0,0c-8.5,0-15.5-6.9-15.5-15.5v-97.6c0-8.5,6.9-15.5,15.5-15.5l0,0c8.5,0,15.5,6.9,15.5,15.5V406.45z"></path> <polygon style="fill:#73CCE0;" points="471.4,248.75 469,262.85 38.9,262.85 36.6,248.75 "></polygon> </g></svg>
        </symbol>

        <symbol id="icon-website" viewBox="0 0 24 24">
            <svg viewBox="0 0 48 48" enable-background="new 0 0 48 48" id="_x3C_Layer_x3E_" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="analysis_x2C__analytics_x2C__magnifier"> <g> <g> <rect fill="#B3E5FC" height="6" id="XMLID_7_" transform="matrix(0.707 -0.7072 0.7072 0.707 -13.014 31.4223)" width="4" x="29.418" y="28.418"></rect> <path d="M32.126,35.661l-4.95-4.95l3.535-3.536l4.95,4.95L32.126,35.661z M28.59,30.711l3.536,3.536l2.121-2.122 l-3.536-3.536L28.59,30.711z" fill="#0277BD"></path> </g> <g> <path d="M45.207,42.379l-2.828,2.828c-0.391,0.391-1.023,0.391-1.414,0l-9.899-9.899 c-0.391-0.391-0.391-1.023,0-1.414l2.828-2.829c0.391-0.39,1.023-0.39,1.414,0l9.899,9.9 C45.598,41.355,45.598,41.988,45.207,42.379z" fill="#8C9EFF" id="XMLID_6_"></path> <path d="M41.672,45.999c-0.384,0-0.769-0.146-1.061-0.438l-9.899-9.899c-0.585-0.585-0.585-1.536,0-2.121 l2.828-2.829c0.584-0.584,1.535-0.583,2.121,0l9.899,9.9c0.585,0.585,0.585,1.537,0,2.122l-2.828,2.828 C42.44,45.853,42.056,45.999,41.672,45.999z M34.601,31.272c-0.128,0-0.256,0.049-0.354,0.146l-2.828,2.829 c-0.195,0.195-0.195,0.512,0,0.707l9.899,9.899c0.195,0.195,0.512,0.195,0.707,0l2.828-2.828c0.195-0.195,0.195-0.512,0-0.708 l-9.899-9.9C34.856,31.321,34.729,31.272,34.601,31.272z" fill="#0277BD"></path> </g> <path d="M43.602,41.273c-0.128,0-0.256-0.049-0.354-0.146l-7.778-7.778c-0.195-0.195-0.195-0.512,0-0.707 s0.512-0.195,0.707,0l7.778,7.778c0.195,0.195,0.195,0.512,0,0.707C43.857,41.224,43.729,41.273,43.602,41.273z" fill="#E8EAF6"></path> </g> <g> <circle cx="18.5" cy="18.5" fill="#E1F5FE" id="XMLID_1_" r="16"></circle> <path d="M18.5,35C9.402,35,2,27.598,2,18.5S9.402,2,18.5,2S35,9.402,35,18.5c0,3.703-1.198,7.202-3.466,10.119 c-0.171,0.218-0.485,0.256-0.701,0.087c-0.218-0.169-0.258-0.483-0.088-0.701C32.874,25.266,34,21.979,34,18.5 C34,9.953,27.047,3,18.5,3S3,9.953,3,18.5S9.953,34,18.5,34c4.027,0,7.844-1.538,10.745-4.33c0.198-0.19,0.515-0.186,0.707,0.014 c0.191,0.199,0.186,0.516-0.014,0.707C26.85,33.363,22.788,35,18.5,35z" fill="#0277BD"></path> <g> <circle cx="18.5" cy="18.5" fill="#B3E5FC" id="XMLID_9_" r="13.5"></circle> <path d="M18.5,32.5c-7.72,0-14-6.28-14-14s6.28-14,14-14s14,6.28,14,14S26.22,32.5,18.5,32.5z M18.5,5.5 c-7.168,0-13,5.832-13,13s5.832,13,13,13s13-5.832,13-13S25.668,5.5,18.5,5.5z" fill="#FFFFFF"></path> </g> <path d="M17.627,8.536c-0.258,0-0.477-0.198-0.497-0.459c-0.022-0.275,0.183-0.517,0.457-0.539 C17.889,7.513,18.192,7.5,18.5,7.5C18.776,7.5,19,7.724,19,8s-0.224,0.5-0.5,0.5c-0.28,0-0.557,0.012-0.831,0.034 C17.654,8.535,17.641,8.536,17.627,8.536z" fill="#FFFFFF"></path> <path d="M8,19c-0.276,0-0.5-0.224-0.5-0.5c0-4.645,2.938-8.811,7.313-10.367c0.261-0.094,0.547,0.043,0.639,0.304 c0.093,0.26-0.043,0.546-0.303,0.639C11.172,10.49,8.5,14.277,8.5,18.5C8.5,18.776,8.276,19,8,19z" fill="#FFFFFF"></path> </g> </g> </g></svg>
        </symbol>

        <symbol id="icon-youtube" viewBox="0 0 24 24">
            <svg viewBox="0 -38 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M250.346231,28.0746923 C247.358133,17.0320558 238.732098,8.40602109 227.689461,5.41792308 C207.823743,0 127.868333,0 127.868333,0 C127.868333,0 47.9129229,0.164179487 28.0472049,5.58210256 C17.0045684,8.57020058 8.37853373,17.1962353 5.39043571,28.2388718 C-0.618533519,63.5374615 -2.94988224,117.322662 5.5546152,151.209308 C8.54271322,162.251944 17.1687479,170.877979 28.2113844,173.866077 C48.0771024,179.284 128.032513,179.284 128.032513,179.284 C128.032513,179.284 207.987923,179.284 227.853641,173.866077 C238.896277,170.877979 247.522312,162.251944 250.51041,151.209308 C256.847738,115.861464 258.801474,62.1091 250.346231,28.0746923 Z" fill="#e00000"> </path> <polygon fill="#FFFFFF" points="102.420513 128.06 168.749025 89.642 102.420513 51.224"> </polygon> </g> </g></svg>
        </symbol>
        
        <symbol id="icon-add-node" viewBox="0 0 24 24">
            <svg viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f8f8f8"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="#f8f8f8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="12" cy="12" r="9" stroke="#f8f8f8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></circle> </g></svg>
        </symbol>

        <symbol id="icon-remove" viewBox="0 0 24 24">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Remove_Minus_Circle"> <path id="Vector" d="M8 12H16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
        </symbol>

        <symbol id="icon-tree" viewBox="0 0 24 24">
            <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 469.333333m-426.666667 0a426.666667 426.666667 0 1 0 853.333334 0 426.666667 426.666667 0 1 0-853.333334 0Z" fill="#FFF59D"></path><path d="M789.333333 469.333333c0-164.266667-140.8-294.4-309.333333-275.2-128 14.933333-230.4 117.333333-243.2 245.333334-10.666667 98.133333 29.866667 185.6 98.133333 241.066666 29.866667 25.6 49.066667 61.866667 49.066667 102.4v6.4h256v-2.133333c0-38.4 17.066667-76.8 46.933333-102.4 61.866667-51.2 102.4-128 102.4-215.466667z" fill="#FBC02D"></path><path d="M652.8 430.933333l-64-42.666666c-6.4-4.266667-17.066667-4.266667-23.466667 0L512 422.4l-51.2-34.133333c-6.4-4.266667-17.066667-4.266667-23.466667 0l-64 42.666666c-4.266667 4.266667-8.533333 8.533333-8.533333 14.933334s0 12.8 4.266667 17.066666l81.066666 100.266667V789.333333h42.666667V554.666667c0-4.266667-2.133333-8.533333-4.266667-12.8l-70.4-87.466667 32-21.333333 51.2 34.133333c6.4 4.266667 17.066667 4.266667 23.466667 0l51.2-34.133333 32 21.333333-70.4 87.466667c-2.133333 4.266667-4.266667 8.533333-4.266667 12.8v234.666666h42.666667V563.2l81.066667-100.266667c4.266667-4.266667 6.4-10.666667 4.266666-17.066666s-4.266667-12.8-8.533333-14.933334z" fill="#FFF59D"></path><path d="M512 938.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#929496"></path><path d="M554.666667 960h-85.333334c-46.933333 0-85.333333-38.4-85.333333-85.333333v-106.666667h256v106.666667c0 46.933333-38.4 85.333333-85.333333 85.333333z" fill="#c7c7c7"></path><path d="M640 874.666667l-247.466667 34.133333c6.4 14.933333 19.2 29.866667 34.133334 38.4l200.533333-27.733333c8.533333-12.8 12.8-27.733333 12.8-44.8zM384 825.6v42.666667L640 832v-42.666667z" fill="#929496"></path></g></svg>
        </symbol>
    </defs>
</svg>


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
        background-size: 15px 15px;
        opacity: 0.04;
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
        -webkit-mask-image: linear-gradient(180deg, var(--darkbackground) 95%, transparent);
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