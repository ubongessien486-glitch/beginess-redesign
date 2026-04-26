// Risk Calculator Logic
class RiskCalculator {
    constructor() {
        this.baseRisk = 0;
    }
    calculateRisk(factors) {
        return factors.reduce((acc, val) => acc + val, this.baseRisk);
    }
}
