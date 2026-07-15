const { calculateStockConsumptionInBaseUnits } = require('../src/controllers/stockUtils');

describe('calculateStockConsumptionInBaseUnits', () => {
  it('converts weight variants to kilograms for stock deduction', () => {
    expect(calculateStockConsumptionInBaseUnits(250, 'g', 2)).toBe(0.5);
    expect(calculateStockConsumptionInBaseUnits(500, 'g', 3)).toBe(1.5);
    expect(calculateStockConsumptionInBaseUnits(1, 'kg', 4)).toBe(4);
  });

  it('converts liquid variants to litres for stock deduction', () => {
    expect(calculateStockConsumptionInBaseUnits(250, 'ml', 1)).toBe(0.25);
    expect(calculateStockConsumptionInBaseUnits(500, 'ml', 2)).toBe(1);
    expect(calculateStockConsumptionInBaseUnits(1, 'l', 4)).toBe(4);
  });

  it('keeps piece-based stock unchanged', () => {
    expect(calculateStockConsumptionInBaseUnits(5, 'pcs', 3)).toBe(15);
    expect(calculateStockConsumptionInBaseUnits(1, 'piece', 1)).toBe(1);
  });
});
