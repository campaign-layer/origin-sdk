const { Origin } = require("../dist/core.cjs");

describe("Bulk Purchase Integration", () => {
  let origin;

  beforeEach(() => {
    origin = new Origin("DEVELOPMENT");
  });

  test("should initialize Origin SDK with DEVELOPMENT environment", () => {
    expect(origin).toBeDefined();
    expect(origin.environment).toBeDefined();
    expect(origin.environment.NAME).toBe("DEVELOPMENT");
  });

  test("should have BATCH_PURCHASE_CONTRACT_ADDRESS defined", () => {
    expect(origin.environment.BATCH_PURCHASE_CONTRACT_ADDRESS).toBeDefined();
    expect(typeof origin.environment.BATCH_PURCHASE_CONTRACT_ADDRESS).toBe("string");
    expect(origin.environment.BATCH_PURCHASE_CONTRACT_ADDRESS).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  test("should have bulkBuyAccess method available", () => {
    expect(typeof origin.bulkBuyAccess).toBe("function");
  });

  test("should have bulkBuyAccessTolerant method available", () => {
    expect(typeof origin.bulkBuyAccessTolerant).toBe("function");
  });

  test("should have bulkBuyAccessSmart method available", () => {
    expect(typeof origin.bulkBuyAccessSmart).toBe("function");
  });

  test("should have previewBulkCost method available", () => {
    expect(typeof origin.previewBulkCost).toBe("function");
  });

  test("should have buildPurchaseParams method available", () => {
    expect(typeof origin.buildPurchaseParams).toBe("function");
  });

  test("should have checkActiveStatus method available", () => {
    expect(typeof origin.checkActiveStatus).toBe("function");
  });
});
