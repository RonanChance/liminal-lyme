<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import Footer from "../../lib/components/Footer.svelte";
    import { Label, Input } from 'flowbite-svelte';
    import { EnvelopeSolid, FileEditSolid, LinkSolid } from 'flowbite-svelte-icons';

    import * as d3 from 'd3';
    /** @type {import('./$types').PageData} */
	export let data;

    let svg;
    let root;
    let animate = false;

    onMount(async () => {
        animate = true
        const margin = { top: 0, right: 120, bottom: 20, left: 120 };
        const width = 2560 - margin.right - margin.left;
        const height = 600 - margin.top - margin.bottom;
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
            nodes.forEach(d => { d.y = d.depth * 210; d.x = d.x * 0.7 });

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

            nodeEnter.append('circle')
                .attr('r', 1e-6)
                .style('fill', d => d._children ? 'black' : '#fff');

            nodeEnter.append('text')
                .attr('x', d => d.children || d._children ? -10 : 10)
                .attr('dy', '.35em')
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
                    .attr('y', -9)
                    .attr('width', linkTextWidth + 5)
                    .attr('height', 30)
                    .append('xhtml:div')
                    .html(`<button class="text-white">: <span class="underline">${d.data.link}</span></button>`)
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
    <div class="text-center text-2xl text-white py-6 mb-8 bg-[var(--lightbackground)]" in:fade={{delay: 0, duration: 500}}>Chronic Illness Treatment Tree</div>
{/if}

<div id="tree"></div>

{#if animate}
<div class="w-full flex justify-center bg-[var(--lightbackground)] px-4 py-8 rounded-lg" in:fade={{delay: 1000, duration: 1500}}>
    <form class="w-[85%] md:w-[50%] xl:w-[30%]">
        <div class="mb-6">
            <div class="block mb-2 text-white text-3xl text-center"> Let's Share Ideas!</div>
        </div>

        <div class="mb-6">
            <Label for="large-input" class="block mb-2 text-white text-xl">Supplement/Treatment Suggestion</Label>
            <Input id="treatment" type="text" size="lg" placeholder="Suggestion">
                <FileEditSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Input>
        </div>

        <div class="mb-6">
            <Label for="large-input" class="block mb-2 text-white text-xl">Purchase Link <span class="opacity-50">(Optional)</span></Label>
            <Input id="purchase-link" type="text" size="lg" placeholder="Purchase Link">
                <LinkSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Input>
        </div>


        <div class="mb-6">
            <Label for="large-input" class="block mb-2 text-white text-xl">Email <span class="opacity-50">(Optional)</span></Label>
            <Input id="email" type="email" size="lg" placeholder="name@gmail.com">
                <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Input>
        </div>

        <div class="text-center">
            <button type="submit" class="whitebutton">
                Submit
            </button>
        </div>
    </form>
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
        font-size: 1.1rem;
        fill: #ccc;
    }

    #tree :global(path.link) {
        fill: none;
        stroke: #cccccc20;
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
