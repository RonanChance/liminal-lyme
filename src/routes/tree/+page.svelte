<script>
    import { onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import Footer from "../../lib/components/Footer.svelte";
    import * as d3 from 'd3';
    /** @type {import('./$types').PageData} */
	export let data;

    let svg;
    let root;

    onMount(async () => {
        const margin = { top: 0, right: 120, bottom: 20, left: 120 };
        const width = 1280 - margin.right - margin.left;
        const height = 800 - margin.top - margin.bottom;
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
            nodes.forEach(d => { d.y = d.depth * 180; });

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

            nodeEnter.append('title')
                .text(d => d.data.description);

                nodeEnter.each(function(d) {
                const currentNode = d3.select(this);
                const textNode = currentNode.select('text');
                const textWidth = textNode.node().getBBox().width;

                if (d.data.article) {
                    currentNode.append('foreignObject')
                        .attr('x', textWidth + 25) // Adjust position as needed
                        .attr('y', -13) // Adjust position as needed
                        .attr('width', 60) // Width of the button
                        .attr('height', 30) // Height of the button
                        .append('xhtml:button')
                        .attr('class', 'article-button')
                        .text('Article')
                        .on('click', (event, d) => {
                            event.stopPropagation();
                            console.log('Article clicked', d.data.article);
                            window.open(d.data.article, '_blank');
                        });
                }

                if (d.data.purchase) {
                    currentNode.append('foreignObject')
                        .attr('x', textWidth + 85) // Adjust position as needed
                        .attr('y', -13) // Adjust position as needed
                        .attr('width', 80) // Width of the button
                        .attr('height', 30) // Height of the button
                        .append('xhtml:button')
                        .attr('class', 'purchase-button')
                        .text('Buy')
                        .on('click', (event, d) => {
                            event.stopPropagation();
                            console.log('Purchase clicked', d.data.purchase);
                            window.open(d.data.purchase, '_blank');
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

<TopBanner />

<div class="text-center text-2xl text-white mt-12">Chronic Illness Treatment Framework</div>

<div id="tree"></div>

<Footer />

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
        fill: #ccc;
    }

    #tree :global(path.link) {
        fill: none;
        stroke: #cccccc20;
        stroke-width: 1px;
    }

    #tree :global(.article-button), #tree :global(.purchase-button) {
        background-color: var(--white);
        color: var(--black);
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    }

    #tree :global(.article-button:hover), #tree :global(.purchase-button:hover){
        background-color: var(--supplement_highlight);
        color: var(--white);
    }
</style>