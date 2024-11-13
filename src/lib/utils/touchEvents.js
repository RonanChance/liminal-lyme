// pinch-to-zoom
export function initTouchEvents(container) {
    let scale = 1; // Scale factor for zoom
    const minScale = 0.5; // Minimum zoom level
    const maxScale = 3; // Maximum zoom level
    let initialDistance = null; // Distance between touch points

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Calculate initial distance between touches
            initialDistance = getDistance(e.touches[0], e.touches[1]);
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault(); // Prevent default behavior to avoid scrolling
            const newDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleChange = newDistance / initialDistance;

            scale = Math.min(maxScale, Math.max(minScale, scale * scaleChange));
            container.style.transform = `scale(${scale})`;
            initialDistance = newDistance; // Update initial distance for next move
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        initialDistance = null; // Reset distance on touch end
    }, { passive: true });
}

export function initDragging(container) {
    let isDragging = false;
    let startX, startY;

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

// Calculate the distance between two touch points
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}