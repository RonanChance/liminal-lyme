// Tree search functions

export function findNodeByIdIgnoringHidden(node, id) {
    if (node.data.id === id) return node;
    if (node.children) {
        for (let child of node.children) {
            const result = findNodeById(child, id);
            if (result) return result;
        }
    }
    return null;
}

export function findNodeById(node, id) {
    if (node.data.id === id) return node;
    const children = node.children || node._children;

    if (children) {
        for (let child of children) {
            const result = findNodeById(child, id);
            if (result) return result;
        }
    }
    return null;
}

// Tree manipulation functions

export function collapse(d) {
    if (d.children && d.depth !== 0) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

export function expand(d) {
    if (d._children) {
        d.children = d._children;
        d._children = null;
    }
}

// Tree building functions

export function buildNestedRecords(records) {
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
            node.children.push({ name: '<tspan class="opacity-50">Add <tspan style="font-size: 1.2em;">⊕</tspan></tspan>', isDummy: true, verified: true, parent: node });
        }
    });
    
    return root;
}