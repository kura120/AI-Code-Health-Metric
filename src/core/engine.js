const WeightStrategy = require('./weightStrategy');
const FolderStructureMetric = require('../metrics/folderStructure');
const CodeQualityMetric = require('./codeQuality');
const ComplexityMetrics = require('./complexities');
const ModelDetector = require('../ai/modelDetector');

class Engine {
    constructor() {
        this.weightStrategy = new WeightStrategy();
        this.metrics = {
            folderStructure: new FolderStructureMetric(),
            codeQuality: new CodeQualityMetric(),
            complexity: new ComplexityMetrics(),
            aiDetector: new ModelDetector()
        };
    }

    async evaluateProject(projectPath) {
        const results = {
            folderStructure: await this.metrics.folderStructure.evaluate(projectPath),
            codeQuality: await this.metrics.codeQuality.evaluate(projectPath),
            complexity: this.normalizeComplexity(this.metrics.complexity.calculateCyclomaticComplexity(projectPath)),
            aiConfidence: Math.min(await this.metrics.aiDetector.evaluate(projectPath), 10) / 10
        };
    
        const weights = this.weightStrategy.getCurrentWeights();
        const totalScore = Object.entries(weights).reduce((sum, [metric, weight]) => 
            sum + (Number(results[metric]) * weight), 0);
    
        return {
            ...results,
            overallScore: Math.round(totalScore * 10) / 10
        };
    }

    normalizeComplexity(complexityResult) {
        const rawScore = complexityResult.average;
        
        return Math.min(10 - rawScore, 10) / 10;
    }
    
    calculateOverallScore(results) {
        const weights = this.weightStrategy.getCurrentWeights();
        const total = Object.entries(results).reduce((score, [metric, value]) => 
            score + (value * (weights[metric] || 0)), 0);
        return total / Object.keys(weights).length;
    }
}

module.exports = Engine;