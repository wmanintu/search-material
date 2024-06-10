<template>
  <div>
    <input v-model="searchQuery" placeholder="search to add" />
    <button  @click="handleSearchMaterial">search</button>
    <br />
    product code: {{ material.ProductCode }}
    <br />
    description: {{ material.Description }}
    <br />
    <button :disabled="material.ProductCode === ''" @click="handleAddButton">add</button><button @click="handleExitAddForm">cancel</button>
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
          savedQTY: null
        },
        A2: {
          QTY: null,
          savedQTY: null
        },
        A3: {
          QTY: null,
          savedQTY: null
        },
        A4: {
          QTY: null,
          savedQTY: null
        }
      }
      this.$emit('addMaterialTable', this.material)
      this.handleExitAddForm()
    }
  },
};
</script>

<style lang="scss" scoped></style>
