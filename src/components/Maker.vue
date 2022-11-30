<template>
  <div class="m-auto w-10/12">
    <h1 class="text-center bg-gray-500 text-white font-bold">Maker</h1>
    <div class="flex">
      <canvas class="border" ref="can"></canvas>
      <div
        id="controls"
        class="flex flex-1 flex-col bg-gray-300 gap-5 pt-10 items-center"
      >
        <button
          :disabled="disableAddRect"
          :class="getStyles(disableAddRect)"
          @click="addNewSquare"
        >
          Add New Square
        </button>
        <button
          class="w-10/12 bg-gray-600 text-white"
          @click="evenlySpace('top')"
        >
          Evenly Space Vertically
        </button>
        <button
          class="w-10/12 bg-gray-600 text-white"
          @click="evenlySpace('left')"
        >
          Evenly Space Horizontally
        </button>
        <button
          class="w-10/12 bg-gray-600 text-white"
          @click="getCurrentCanvasObjects"
        >
          Console Log Current Objects
        </button>
        <button
          class="w-10/12 bg-gray-600 text-white"
          @click="reRenderCanvas"
        >
          Re-Render Canvas
        </button>
        <button
          :disabled="disableUndo"
          :class="getStyles(disableUndo)"
          @click="undoCanvasState"
        >
          Undo
        </button>
        <button
          :disabled="disableRedo"
          :class="getStyles(disableRedo)"
          @click="redoCanvasState"
        >
          Redo
        </button>
        <ColorsDropDown
          v-if="shapeColorOptions.show"
          v-on:onSelectionChange="onColorChange"
          :selectedColor="shapeColorOptions.selectedColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { config, rectDefaults } from "../helpers/maker";
import ColorsDropDown from "./ColorsDropdown.vue";

export default {
  name: "Maker",
  components: {
    ColorsDropDown,
  },

  data: () => ({
    canvas: null,
    shapeColorOptions: {
      show: false,
      selectedColor: undefined,
    },
    canvasState: undefined,
    redoStack: [],
    undoStack: [],
    canvasRendering: false,
    stateIndex: 0,
  }),

  mounted() {
    const ref = this.$refs.can;
    this.canvas = new fabric.Canvas(ref);
    this.canvas.setDimensions({
      width: config.canvasWidth,
      height: config.canvasHeight,
    });
    this.initEventListeners();
  },

  computed: {
    disableAddRect: function() { 
      return this.canvas?.getObjects().length + 1 === config?.maxObjects;
    },
    disableUndo: function() { 
      return (this.canvasRendering || this.undoStack.length === 0)
    },
    disableRedo: function() {
      return (this.canvasRendering || this.redoStack.length === 0);
    }
  },

  methods: {
    initEventListeners() {
      this.canvasState = JSON.stringify(this.canvas);
      config.objectEvents.forEach((eventName) =>
        this.canvas.on(eventName, this.onCanvasUpdate)
      );
      config.selectionEvents.forEach((eventName) =>
        this.canvas.on(eventName, this.onShapeSelection)
      );
      this.canvas.on(config.selectionClearEvent, this.onShapeSelectionClear);
    },

    redoCanvasState() {
      this.canvasRendering = true;
      this.undoStack.push(this.canvasState);
      this.canvasState = this.redoStack.pop();
      this.canvas.loadFromJSON(this.canvasState, () => {
        this.reRenderCanvas();
        this.canvasRendering = false;
      });
    },

    undoCanvasState() {
      this.canvasRendering = true;
      this.redoStack.push(this.canvasState);
      this.canvasState = this.undoStack.pop();
      this.canvas.loadFromJSON(this.canvasState, () => {
        this.reRenderCanvas();
        this.canvasRendering = false;
      });
    },

    onCanvasUpdate() {
      if (this.canvasRendering) return;

      if(this.canvasState) {
        this.undoStack.push(this.canvasState);
      }

      if (this.undoStack.length > config.undoRedoLimit) {
        this.undoStack.shift();
      }
      
      this.redoStack = [];
      this.canvasState = JSON.stringify(this.canvas);
    },

    onShapeSelection(obj) {
      this.shapeColorOptions.show = true;
      console.log(obj.selected[0].fill);
      this.shapeColorOptions.selectedColor = obj.selected[0].fill;
    },

    onShapeSelectionClear() {
      this.shapeColorOptions.show = false;
      console.log("clear");
      this.shapeColorOptions.selectedColor = undefined;
    },

    addNewSquare() {
      const canvasObjects = this.canvas.getObjects().length;
      const rect = new fabric.Rect({
        ...rectDefaults,
        left: canvasObjects * 20,
        top: canvasObjects * 20,
      });
      this.canvas.add(rect);
    },

    evenlySpace(direction) {
      const dimension =
        direction === "top" ? config.canvasHeight : config.canvasWidth;
      const spacingDimension =
        direction === "top" ? rectDefaults.height : rectDefaults.width;
      const objects = this.getCurrentCanvasObjects();
      const spacing =
        (dimension - objects.length * spacingDimension) / (objects.length + 1);

      objects
        .sort((a, b) => (a[direction] < b[direction] ? -1 : 1))
        .map((object, index) => {
          object.set({
            [direction]:
              index === 0
                ? spacing
                : spacing * (index + 1) + spacingDimension * index,
            [direction === "top" ? "left" : "top"]:
              dimension / 2 - spacingDimension / 2,
          });
          object.setCoords();
        });

      this.reRenderCanvas();
      this.onCanvasUpdate();
    },

    reRenderCanvas() {
      this.canvas.renderAll();
    },

    getCurrentCanvasObjects() {
      console.log(this.canvas.getObjects());
      return this.canvas.getObjects();
    },

    onColorChange(color) {
      console.log(color);
      const obj = this.canvas.getActiveObject();
      if (obj && color) {
        obj.set({
          fill: color,
        });
        this.canvas.renderAll();
        this.shapeColorOptions.selectedColor = color;
        this.onCanvasUpdate();
      }
    },

    getStyles(disabled) {
      return disabled ? "w-10/12 bg-gray-200 text-grey cursor-not-allowed" : "w-10/12 bg-gray-600 text-white";
    }

  },

  destroyed() {
    this.canvas.__eventListeners = {};
  },
};
</script>

<style scoped></style>
