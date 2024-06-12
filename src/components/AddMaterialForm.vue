<template>
  <div id="add-material-form">
    <input
      id="search-material-input-2"
      v-model="searchQuery"
      placeholder="search material"
    />
    <button id="search-material-button-2" @click="handleSearchMaterial">search</button>
    <br />
    <p id="mat-name">material: {{ material.Material }}</p>
    <br />
    <p>product code: {{ material.ProductCode }}</p>
    <br />
    <p>description: {{ material.Description }}</p>
    <br />
    <button id="add-button" :disabled="material.ProductCode === ''" @click="handleAddButton">
      add</button
    ><button id="cancel-button" @click="handleExitAddForm">cancel</button>
  </div>
</template>

<script>
import { getMaterial } from "../utils/mockData";
export default {
  props: ["toggleAddFlag"],
  data() {
    return {
      searchQuery: "",
      material: {
        ProductCode: "",
        Description: "",
      },
    };
  },
  methods: {
    handleExitAddForm() {
      this.$emit("handleExitAddForm");
    },
    handleSearchMaterial() {
      // Simulate an API call
      setTimeout(() => {
        let response = getMaterial.filter(
          (element) => element.Material == this.searchQuery.trim()
        );
        if (response.length) {
          this.material = response[0];
        } else {
          this.material = {
            ProductCode: "",
            Description: "",
          };
        }
      }, 1000); // Simulate a 1 second delay
    },
    handleAddButton() {
      this.material = {
        ...this.material,
        A1: {
          QTY: null,
          savedQTY: null,
        },
        A2: {
          QTY: null,
          savedQTY: null,
        },
        A3: {
          QTY: null,
          savedQTY: null,
        },
        A4: {
          QTY: null,
          savedQTY: null,
        },
      };
      this.$emit("addMaterialTable", this.material);
      this.handleExitAddForm();
    },
  },
};
</script>

<style lang="scss" scoped></style>
