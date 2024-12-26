class WeightStrategy {
    constructor() {
        this.weights = {
            folderStructure: 0.25,
            codeQuality: 0.25,
            complexity: 0.25,
            aiConfidence: 0.25
        };
    }

    getCurrentWeights() {
        return this.weights;
    }

    updateWeight(metricName, newWeight) {
        this.weights[metricName] = newWeight;
        this.normalizeWeights();
    }

    normalizeWeights() {
        const total = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0);
        for (let metric in this.weights) {
            this.weights[metric] = this.weights[metric] / total;
        }
    }
}

module.exports = WeightStrategy;
