export const config = {
    maxObjects: 8,
    undoRedoLimit: 5,
    canvasWidth: 800,
    canvasHeight: 800,
    objectEvents: ["object:modified", "object:added", "object:removed"],
    selectionEvents: ["selection:created", "selection:updated"],
    selectionClearEvent: "selection:cleared"
}

export const rectDefaults = {
    fill: 'red',
    width: 100,
    height: 100,
    left:0,
    top:0
};