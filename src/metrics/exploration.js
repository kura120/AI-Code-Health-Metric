class ExplorationStrategy { // had help from stackoverflow
    constructor(epsilon = 0.1, decayRate = 0.995) {
        this.epsilon = epsilon;
        this.decayRate = decayRate;
        this.metrics = new Map();
    }

    // Epsilon-Greedy Strategy
    selectMetric(availableMetrics) {
        if (Math.random() < this.epsilon) {
            // Exploration: Random selection
            const randomIndex = Math.floor(Math.random() * availableMetrics.length);
            return availableMetrics[randomIndex];
        }
        // Exploitation: Select best performing metric
        return this.getBestMetric(availableMetrics);
    }

    // Upper Confidence Bound Implementation
    UCB1Select(metrics) {
        const totalTrials = Array.from(this.metrics.values())
            .reduce((sum, metric) => sum + metric.trials, 0);
        
        return metrics.reduce((best, current) => {
            const metricData = this.metrics.get(current) || { value: 0, trials: 0 };
            const ucbValue = this.calculateUCB(metricData, totalTrials);
            
            if (ucbValue > best.ucbValue) {
                return { metric: current, ucbValue };
            }
            return best;
        }, { metric: metrics[0], ucbValue: -Infinity }).metric;
    }

    calculateUCB(metricData, totalTrials) {
        const exploitation = metricData.value / (metricData.trials || 1);
        const exploration = Math.sqrt(2 * Math.log(totalTrials) / (metricData.trials || 1));
        return exploitation + exploration;
    }

    updateMetricPerformance(metric, score) {
        const currentData = this.metrics.get(metric) || { value: 0, trials: 0 };
        this.metrics.set(metric, {
            value: currentData.value + score,
            trials: currentData.trials + 1
        });
        this.closeEpsilon();
    }

    closeEpsilon() {
        this.epsilon *= this.decayRate;
    }
}

module.exports = ExplorationStrategy;
