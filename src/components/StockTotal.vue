<template>
  <div :id="'total' + totalIndex">
    {{ calculatedTotalSum() }}
  </div>
</template>

<script>
export default {
  props: ["totalIndex", "item"],
  methods: {
    calculatedTotalSum() {
      const qtyValues = [];
      // extract quantity value
      for (const key in this.item) {
        if (
          typeof this.item[key] === "object" &&
          this.item[key].hasOwnProperty("QTY")
        ) {
          qtyValues.push(this.item[key].QTY);
        }
      }

      // return total quantity sum
      return qtyValues.reduce((total, curr) => {
        return total + curr;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped></style>
