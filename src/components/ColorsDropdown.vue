<template>
  <Dropdown :options=colors :selectedValue="selectedColor" v-on:onSelectionChange="handleChange" />
</template>
  
  <script>
 
  import Dropdown from './shared/DropDown.vue';
  export default {
    name: 'ColorsDropDown',
    props: ["selectedColor"],
    components: {
        Dropdown
    },
    data: () => ({
            colors: [
              { id: "red", label: "Red" },
              { id: "green", label: "Green" },
              { id: "blue", label: "Blue" },
            ]
        }),
    methods: {
      handleChange(e) {
        this.$emit('onSelectionChange', e)
      },
    },
  }
  </script>
  
  <style scoped>
  
  </style>
  