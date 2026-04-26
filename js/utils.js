// Utilities
const utils = {
    formatCurrency: (amount) => `$${amount.toFixed(2)}`,
    generateId: () => Math.random().toString(36).substr(2, 9)
};
