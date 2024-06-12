<template>
  <div v-show="toggleAddFlag">
    <AddMaterialForm
      :toggleAddFlag="toggleAddFlag"
      :locations="locations"
      @handleExitAddForm="handleExitAddForm"
      @addMaterialTable="addMaterialTable"
    />
  </div>
  <div v-show="!toggleAddFlag">
    <div>
      <input
        id="search-material-input-1"
        v-model="searchQuery"
        placeholder="Search Material"
      />
      <button id="search-material-button-1" @click="performSearch">Search</button>
      <button id="add-material-toggle-button" @click="toggleAddFlag = true" style="float: right">
        Add Material
      </button>
    </div>
    <br />
    <table id="material-table">
      <thead>
        <tr>
          <th>Material</th>
          <th v-for="location in locations">{{location}}</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in filteredItems" :key="item.Material">
          <td :id="'table-material-row' + rowIndex">{{ item.Material }}</td>
          <td v-for="(location, columnIndex) in locations" :key="location">
            <StockQuantityInput
              :tab="getTabIndexValue(columnIndex, rowIndex, items.length)"
              :rowIndex="rowIndex"
              :columnName="location"
              :stockQuantity.sync="item[location].QTY"
              :savedQuantity="item[location].savedQTY"
              @handle-stock-update="handleStockUpdate"
            />
          </td>
          <td>
            <StockTotal
              :item="item"
              :totalIndex="rowIndex"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <button id="save-changes-button" style="float: right" @click="handleSavebutton">Save Changes</button>
  </div>
</template>

<script>
import StockTotal from "./StockTotal.vue";
import StockQuantityInput from "./StockQuantityInput.vue";
import AddMaterialForm from "./AddMaterialForm.vue";
import { getTableData } from "../utils/mockData";
export default {
  components: {
    StockTotal,
    StockQuantityInput,
    AddMaterialForm,
  },
  data() {
    return {
      searchQuery: "",
      items: [],
      filteredItems: [],
      toggleAddFlag: false,
      locations: []
    };
  },
  methods: {
    performSearch() {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredItems = this.items.filter((item) => {
        return item.Material.toLowerCase().includes(query);
      });
    },
    getTabIndexValue(columnIndex, rowIndex, itemLength) {
      return (itemLength * columnIndex) + rowIndex + 1
    },
    fetchItems() {
      // Simulate an API call
      setTimeout(() => {
        let data = getTableData;

        let distinctCode = [...new Set(data.map((s) => s.ProductCode))];

        let distinctLocation = [...new Set(data.map((s) => s.Location))].sort();
        this.locations = distinctLocation
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
      if (!data.value) {
        this.items[data.index][data.key].QTY = null;
        this.filteredItems[data.index][data.key].QTY = null;
      } else {
        this.items[data.index][data.key].QTY = parseInt(data.value);
      }
    },
    handleExitAddForm() {
      this.toggleAddFlag = !this.toggleAddFlag;
    },
    addMaterialTable(data) {
      // handle emited value from AddMaterialForm component
      let found = this.items.find(
        (element) => element.Material === data.Material
      );
      if (!found) {
        this.items.push(data);
      }
    },
    handleSavebutton() {
      //transform table data to postData
      let postData = this.items.reduce((accumulator, current) => {
        let result = Object.keys(current)
          .filter((key) => !["Material", "ProductCode"].includes(key))
          .reduce((array, key) => {
            if (current[key].QTY !== current[key].savedQTY) {
              array.push({
                Material: current.Material,
                // ProductCode: current.ProductCode,
                Location: key,
                QTY: current[key].QTY,
              });
            }
            return array;
          }, []);
        accumulator.push(...result);
        return accumulator;
      }, []);
      console.log(postData)
    },
  },
  created() {
    this.fetchItems();
  },
};
</script>
<!-- API Commit
[{	
	Material: "",
	Location: "",
	QTY: 100
}, ...] -->

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
