<template>
  <div>
    <input
      :id="'input'+tab"
      :tabindex="tab"
      type="text"
      :value="stockQuantity"
      @input="handleQuantityInput"
      @keypress="handleKeyPress($event, true)"
    />
  </div>
</template>

<script>
export default {
  props: ["stockQuantity", "rowIndex", "columnName", "tab", "savedQuantity"],
  methods: {
    handleQuantityInput(event) {
      this.$emit("handleStockUpdate", {
        value: event.target.value,
        index: this.rowIndex,
        key: this.columnName,
      });
    },
    handleKeyPress(event, isPointsInput = false) {
      // Check if the entered key is a number or decimal point
      const allowedChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const allowedCharsPointsInput = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];
      const keyPressed = String.fromCharCode(event.keyCode);
      if (isPointsInput && !allowedCharsPointsInput.includes(keyPressed)) {
        event.preventDefault();
      } else if (!allowedChars.includes(keyPressed)) {
        event.preventDefault(); // Prevent the default action (typing the character)
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
