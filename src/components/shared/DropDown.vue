<template>
    <select v-model="mutableItem">
        <option value="">---Select---</option>
        <option v-for="option in options" :value="option.id" :key="option.id">
            {{ option.label }}
        </option>
    </select>
</template>
  
  <script>
 
  export default {
    name: 'Dropdown',
    props: ['options', "selectedValue"],
    computed: {
    mutableItem: {
        get: function () {
          return this.selectedValue;
        },
        set: function (newValue) {
          this.$emit("onSelectionChange", newValue);
        },
      },
    },
  }
  </script>
  
  <style scoped>
  
  </style>
  