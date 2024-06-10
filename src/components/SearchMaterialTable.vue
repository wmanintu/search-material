<template>
  <div>
    <div>
      <input v-model="searchQuery" placeholder="Search" />
      <button @click="performSearch">Search</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Material</th>
          <th>A1</th>
          <th>A2</th>
          <th>A3</th>
          <th>A4</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in filteredItems" :key="item.Material">
          <td>{{ item.Material }}</td>
          <td>
            <StockQuantityInput
              :tab="rowIndex + 1"
              :rowIndex="rowIndex"
              columnName="A1"
              :stockQuantity.sync="item.A1.QTY"
              :savedQuantity="item.A1.savedQuantity"
              @handle-stock-update="handleStockUpdate"
            />
          </td>
          <td>
            <StockQuantityInput
              :tab="items.length + rowIndex + 1"
              :rowIndex="rowIndex"
              columnName="A2"
              :stockQuantity.sync="item.A2.QTY"
              :savedQuantity="item.A2.savedQuantity"
              @handle-stock-update="handleStockUpdate"
            />
          </td>
          <td>
            <StockQuantityInput
              :tab="(items.length * 2) + rowIndex + 1"
              :rowIndex="rowIndex"
              columnName="A3"
              :stockQuantity.sync="item.A3.QTY"
              :savedQuantity="item.A3.savedQuantity"
              @handle-stock-update="handleStockUpdate"
            />
          </td>
          <td>
            <StockQuantityInput
              :tab="(items.length * 3) + rowIndex + 1"
              :rowIndex="rowIndex"
              columnName="A4"
              :stockQuantity.sync="item.A4.QTY"
              :savedQuantity="item.A4.savedQuantity"
              @handle-stock-update="handleStockUpdate"
            />
          </td>
          <td>
            <StockTotal
              :A1="item.A1.QTY"
              :A2="item.A2.QTY"
              :A3="item.A3.QTY"
              :A4="item.A4.QTY"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import StockTotal from "./StockTotal.vue";
import StockQuantityInput from "./StockQuantityInput.vue";
import { getTableData } from "../utils/mockData";
export default {
  components: {
    StockTotal,
    StockQuantityInput,
  },
  data() {
    return {
      searchQuery: "",
      items: [],
      filteredItems: [],
    };
  },
  methods: {
    performSearch() {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredItems = this.items.filter((item) => {
        return item.Material.toLowerCase().includes(query);
      });
    },
    fetchItems() {
      // Simulate an API call
      setTimeout(() => {
        let data = getTableData;

        let distinctCode = [...new Set(data.map((s) => s.ProductCode))];

        let distinctLocation = [...new Set(data.map((s) => s.Location))].sort();

        // Begin tranforming...
        
        let transformedTableData = distinctCode.map((productCode) => {
          // group unique product code
          let filteredData = data.filter(
            (element) => element.ProductCode === productCode
          );
          // fills missing location 
          let materialLocationList = distinctLocation.reduce(
            (accumulator, current) => {
              let matchedItemLocation = filteredData.find(
                (element) => element.Location === current
              );

              let currentResult = matchedItemLocation
                ? matchedItemLocation
                : {
                    Material: filteredData[0].Material,
                    ProductCode: productCode,
                    Location: current,
                    QTY: null,
                  };

              accumulator.push(currentResult);

              return accumulator;
            },
            []
          );

          // transform row data
          return materialLocationList.reduce((accumulator, current) => {
            accumulator.Material = current.Material;
            accumulator.ProductCode = current.ProductCode;
            accumulator[current.Location] = {
              QTY: current.QTY,
              savedQTY: current.QTY,
            };
            return accumulator;
          }, {});
        });
        this.items = transformedTableData;
        this.filteredItems = transformedTableData;
      }, 1000); // Simulate a 1 second delay
    },
    handleStockUpdate(data) {
      if(!data.value) {
        this.items[data.index][data.key].QTY = null
        this.filteredItems[data.index][data.key].QTY = null
      } else {
        this.items[data.index][data.key].QTY = parseInt(data.value)
      }
    },
  },
  created() {
    this.fetchItems();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>
