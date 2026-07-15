const normalizeUnit = (unit) => String(unit || '').trim().toLowerCase();

const convertToBaseUnit = (value, unit) => {
  const normalizedUnit = normalizeUnit(unit);
  const quantity = parseFloat(value) || 0;

  if (!quantity) return 0;

  switch (normalizedUnit) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return quantity;
    case 'g':
    case 'gram':
    case 'grams':
      return quantity / 1000;
    case 'l':
    case 'litre':
    case 'liter':
    case 'litres':
    case 'liters':
      return quantity;
    case 'ml':
    case 'milliliter':
    case 'millilitre':
    case 'milliliters':
    case 'millilitres':
      return quantity / 1000;
    case 'pcs':
    case 'pc':
    case 'piece':
    case 'pieces':
    case 'unit':
    case 'units':
      return quantity;
    default:
      return quantity;
  }
};

const calculateStockConsumptionInBaseUnits = (variantValue, unit, quantity = 1) => {
  const purchaseQuantity = parseFloat(quantity) || 0;
  if (variantValue === undefined || variantValue === null || variantValue === '' || unit === undefined || unit === null || unit === '') {
    return purchaseQuantity;
  }

  const baseQuantity = convertToBaseUnit(variantValue, unit);
  return baseQuantity * purchaseQuantity;
};

module.exports = {
  normalizeUnit,
  convertToBaseUnit,
  calculateStockConsumptionInBaseUnits,
};
