export const getTableData = [
  {
    Material: "MAT0001",
    ProductCode: "PC000001",
    Location: "A1",
    QTY: 20,
  },
  {
    Material: "MAT0001",
    ProductCode: "PC000001",
    Location: "A2",
    QTY: 30,
  },
  {
    Material: "MAT0001",
    ProductCode: "PC000001",
    Location: "A4",
    QTY: 40,
  },
  {
    Material: "MAT0002",
    ProductCode: "PC000002",
    Location: "A1",
    QTY: 10,
  },
  {
    Material: "MAT0002",
    ProductCode: "PC000002",
    Location: "A3",
    QTY: 20,
  },
  {
    Material: "MAT0003",
    ProductCode: "PC000003",
    Location: "A1",
    QTY: 30,
  },
  {
    Material: "MAT0004",
    ProductCode: "PC000004",
    Location: "A2",
    QTY: 80,
  },
];

// API Get Material
// REQ
{
  Material: "MAT0001";
}

// RES
export const getMaterial = [
  {
    Material: "MAT0001",
    ProductCode: "PC000001",
    Description: "XXXXXXXXXXXX XXXX",
  },
  {
    Material: "MAT0002",
    ProductCode: "PC000002",
    Description: "XXXXXXXXXXXX XXXX",
  },
  {
    Material: "MAT0003",
    ProductCode: "PC000003",
    Description: "XXXXXXXXXXXX XXXX",
  },
  {
    Material: "MAT0004",
    ProductCode: "PC000004",
    Description: "XXXXXXXXXXXX XXXX",
  },
  {
    Material: "MAT0005",
    ProductCode: "PC000005",
    Description: "XXXXXXXXXXXX XXXX",
  },
  {
    Material: "MAT0006",
    ProductCode: "PC000006",
    Description: "XXXXXXXXXXXX XXXX",
  },
  {
    Material: "MAT0007",
    ProductCode: "PC000007",
    Description: "XXXXXXXXXXXX XXXX",
  },
]

// Unit Test
// mockItems
export const mockItems = [
  {
    Material: "MAT0001",
    ProductCode: "PC000001",
    A1: { QTY: 20, savedQTY: 20 },
    A2: { QTY: 30, savedQTY: 30 },
    A3: { QTY: null, savedQTY: null },
    A4: { QTY: 40, savedQTY: 40 },
  },
  {
    Material: "MAT0002",
    ProductCode: "PC000002",
    A1: { QTY: 10, savedQTY: 10 },
    A2: { QTY: null, savedQTY: null },
    A3: { QTY: 20, savedQTY: 20 },
    A4: { QTY: null, savedQTY: null },
  },
  {
    Material: "MAT0003",
    ProductCode: "PC000003",
    A1: { QTY: 30, savedQTY: 30 },
    A2: { QTY: null, savedQTY: null },
    A3: { QTY: null, savedQTY: null },
    A4: { QTY: null, savedQTY: null },
  },
  {
    Material: "MAT0004",
    ProductCode: "PC000004",
    A1: { QTY: null, savedQTY: null },
    A2: { QTY: 80, savedQTY: 80 },
    A3: { QTY: null, savedQTY: null },
    A4: { QTY: null, savedQTY: null },
  }
];
