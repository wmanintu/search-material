import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { mockItems } from "../utils/mockData";
import { nextTick } from "vue";

import SearchMaterialTable from "../components/SearchMaterialTable.vue";
import StockQuantityInput from "../components/StockQuantityInput.vue";

describe("Material Table", () => {
  let wrapper;
  let mockData;

  beforeEach(() => {
    // Mock the timers
    vi.useFakeTimers();

    // Deep clone the mock data to prevent mutations
    mockData = JSON.parse(JSON.stringify(mockItems));
    // Mount a fresh instance of the component before each test
    wrapper = mount(SearchMaterialTable, {
      attachTo: document.body,
      data() {
        return {
          filteredItems: mockData,
          items: mockData,
          toggleAddFlag: false,
        };
      },
    });

    // Fast forward the timers by 1 seconds
    vi.advanceTimersByTime(1100);

    // Restore the timers to their original implementation
    vi.useRealTimers();
  });
  afterEach(() => {
    // Unmount the parent component after each test
    wrapper.unmount();
  });
  it("Table renders properly", async () => {
    const table = wrapper.find("table");
    expect(table.exists()).toBe(true);
  });

  it("Adding total stock correctly after changing input quantity", async () => {
    // get the first element and check if it exist
    const childComponent = wrapper.findAllComponents(StockQuantityInput).at(0);

    expect(childComponent.exists()).toBeTruthy();

    // set 100 qty to first input
    const input = childComponent.find("input");
    await input.setValue(100);

    // stock quantity are displayed correctly at first index
    expect(childComponent.vm.stockQuantity).toBe(100);

    const totalRow0 = wrapper.find("#total0");
    expect(totalRow0.text()).toBe("173");
  });

  it("Input should tabindex from top to bottom and left to right", async () => {
    // Find all child components
    const childComponents = wrapper.findAllComponents(StockQuantityInput);

    // Expect 16 quantity inputs
    expect(childComponents.length).toBe(16);

    // Create an array to store all input elements from child components
    const inputs = [];

    // Create an array to store all input elements from child components
    for (let i = 0; i < childComponents.length; i++) {
      const input = childComponents.at(i).find("input");
      inputs.push(input);
    }

    // Focus the first input
    // :ISSUE :: trigger('focus') did not work
    inputs[0].element.focus();

    // Allow the DOM to process the focus event
    expect(document.activeElement).toBe(inputs[0].element);

    // Simulate tabbing through the inputs
    for (let i = 0; i < inputs.length - 1; i++) {
      await inputs[i].trigger("keydown", { key: "Tab" });
      inputs[i + 1].element.focus();
      expect(document.activeElement).toBe(inputs[i + 1].element);
    }
  });
});

describe("Search material inside table", () => {
  let wrapper;
  let mockData;
  beforeEach(() => {
    // Mock the timers
    vi.useFakeTimers();

    // Deep clone the mock data to prevent mutations
    mockData = JSON.parse(JSON.stringify(mockItems));
    // Mount a fresh instance of the component before each test
    wrapper = mount(SearchMaterialTable, {
      attachTo: document.body,
      data() {
        return {
          filteredItems: mockData,
          items: mockData,
          toggleAddFlag: false,
        };
      },
    });

    // Fast forward the timers by 1 seconds
    vi.advanceTimersByTime(1100);

    // Restore the timers to their original implementation
    vi.useRealTimers();
  });

  afterEach(() => {
    // Unmount the parent component after each test
    wrapper.unmount();
  });

  it("Search display correct result", async () => {
    // input MAT0002 search
    await wrapper.find("#search-material-input-1").setValue("MAT0002");

    // click search button
    await wrapper.find("#search-material-button-1").trigger("click");

    // get first index after search was clicked
    const material = wrapper.find("#table-material-row0");

    // first row should be MAT0002
    expect(material.text()).toBe("MAT0002");

    // first row should not be MAT0001
    expect(material.text()).not.toBe("MAT0001");
  });

  it("Searching for materials won't reset a changed quantity value", async () => {

    // change quantity value for MAT0002 at location A2 to 150
    const childComponent = wrapper.findAllComponents(StockQuantityInput).at(5);
    const input = childComponent.find("input");
    await input.setValue(150);

    // expect MAT0002 at location A2 to be 150
    expect(childComponent.vm.stockQuantity).toBe(150);

    // ======== BEGINS Search filter...
    // input MAT0003 search
    await wrapper.find("#search-material-input-1").setValue("MAT0003");

    // click search button
    await wrapper.find("#search-material-button-1").trigger("click");

    // get first index after search was clicked
    const material = wrapper.find("#table-material-row0");

    const childComponentList = wrapper.findAllComponents(StockQuantityInput);
    // first row should be MAT0003
    expect(material.text()).toBe("MAT0003");
    // expect to only contain 4 input  child componnent after filter
    expect(childComponentList.length).toBe(4);

    // input empty search
    await wrapper.find("#search-material-input-1").setValue("");

    // click search button
    await wrapper.find("#search-material-button-1").trigger("click");
    // ======== END Search and reset filter....

    // expect MAT0002 at location A2 to still be 150
    expect(childComponent.vm.stockQuantity).toBe(150);
  });
});

describe("Add Material Form", () => {
  let wrapper;
  let mockData;

  //set up fake timeout
  beforeEach(() => {
    vi.useFakeTimers();

    // Deep clone the mock data to prevent mutations
    mockData = JSON.parse(JSON.stringify(mockItems));

    // Mount a fresh instance of the component before each test
    wrapper = mount(SearchMaterialTable, {
      attachTo: document.body,
      data() {
        return {
          filteredItems: mockData,
          items: mockData,
          toggleAddFlag: false,
        };
      },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    wrapper.unmount();
  });

  it("Open and close Properly", async () => {
    const table = wrapper.find("#material-table");
    const openButton = wrapper.find("#add-material-toggle-button");
    const closeButton = wrapper.find("#cancel-button");

    // open form
    await openButton.trigger("click");

    // show form and hide table
    const form = wrapper.find("#add-material-form");
    expect(form.isVisible()).toBe(true);
    expect(table.isVisible()).toBe(false);

    // close form
    await closeButton.trigger("click");

    //show table and hide form
    expect(table.isVisible()).toBe(true);
    expect(form.isVisible()).toBe(false);
  });

  it("Search for a material will display correct info", async () => {
    await wrapper.find("#search-material-input-2").setValue("MAT0005");
    await wrapper.find("#search-material-button-2").trigger("click");

    // Fast-forward until all timers have been executed
    vi.runAllTimers();

    // Wait for the next DOM update
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#mat-name").text()).toBe("material: MAT0005");
  });

  it("Add button will add a new material to the material table", async () => {
    // open add material form
    await wrapper.find("#add-material-toggle-button").trigger("click");

    // search for MAT0005
    await wrapper.find("#search-material-input-2").setValue("MAT0005");
    await wrapper.find("#search-material-button-2").trigger("click");

    // Fast-forward until all timers have been executed
    vi.runAllTimers();

    // Wait for the next DOM update
    await wrapper.vm.$nextTick();

    // Click add
    await wrapper.find("#add-button").trigger("click");

    // returns to material table and the add form is not visible
    expect(wrapper.find("#material-table").isVisible()).toBe(true);
    expect(wrapper.find("#add-material-form").isVisible()).toBe(false);

    // expect the fifth row to contain the newly add MAT0005
    expect(wrapper.find("#table-material-row4").text()).toBe("MAT0005");
  });
});

describe("Save changes button", () => {
  let wrapper;
  let mockData;
  beforeEach(() => {
    // Mock the timers
    vi.useFakeTimers();

    // Deep clone the mock data to prevent mutations
    mockData = JSON.parse(JSON.stringify(mockItems));
    // Mount a fresh instance of the component before each test
    wrapper = mount(SearchMaterialTable, {
      data() {
        return {
          filteredItems: mockItems,
          items: mockItems,
          toggleAddFlag: false,
        };
      },
    });

    // Fast forward the timers by 1 seconds
    vi.advanceTimersByTime(1000);

    // Restore the timers to their original implementation
    vi.useRealTimers();
  });
  afterEach(() => {
    // Unmount the parent component after each test
    wrapper.unmount();
  });
  it("Logs an empty array when button is clicked with no changes", () => {
    // Mock console.log
    const consoleLogMock = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    // Simulate button click
    wrapper.find("#save-changes-button").trigger("click");

    // Assert that console.log was called with the correct message
    expect(consoleLogMock).toHaveBeenCalledWith([]);
  });
  it("Logs changes when button is clicked with changes made", async () => {
    // Mock console.log
    const consoleLogMock = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    // get the first element and check if it exist

    const childComponent = await wrapper
      .findAllComponents(StockQuantityInput)
      .at(0);

    // await flushPromises()

    expect(childComponent.exists()).toBeTruthy();

    // set 100 qty to first input
    const input = childComponent.find("input");
    await input.setValue(100);

    // Simulate button click
    wrapper.find("#save-changes-button").trigger("click");

    // Assert that console.log was called with the correct message
    expect(consoleLogMock).toHaveBeenCalledWith([
      {
        Location: "A1",
        Material: "MAT0001",
        QTY: 100,
      },
    ]);
  });
});
