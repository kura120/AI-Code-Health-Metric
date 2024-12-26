const CognitiveComplexityMetric = require('../metrics/cognitiveComplexity');
const TimeComplexityMetric = require('../metrics/timeComplexity');
const ExplorationStrategy = require('../metrics/exploration');
const fs = require('fs-extra');
const path = require('path');

class CodeQualityMetric {
    constructor() {
        this.cognitiveMetric = new CognitiveComplexityMetric();
        this.timeMetric = new TimeComplexityMetric();
        this.explorationStrategy = new ExplorationStrategy();
    }

    async evaluate(projectPath) {
        const files = await this.getJavaScriptFiles(projectPath);
        let totalScore = 0;
    
        for (const file of files) {
            const code = await fs.readFile(file, 'utf-8');
            const scores = this.calculateFileScores(code);
            const fileScore = this.combineScores(scores);
            totalScore += Math.min(fileScore, 10);
        }
    
        return Math.min(totalScore / Math.max(files.length, 1), 10);
    }

    calculateFileScores(code) {
        const baseMetrics = {
            cognitive: Math.min(this.cognitiveMetric.evaluate(code), 1.0),
            timeComplexity: Math.min(this.timeMetric.evaluateFunction(code), 1.0)
        };
    
        const additionalMetrics = {
            variableNaming: this.checkVariableNaming(code),
            functionLength: this.checkFunctionLength(code),
            commentQuality: this.checkCommentQuality(code) * 0.5,
            errorHandling: this.checkErrorHandling(code) * 0.3,
            codeReuse: this.checkCodeReuse(code) * 0.4,
            bestPractices: this.checkBestPractices(code) * 0.6
        };
    
        return { ...baseMetrics, ...additionalMetrics };
    }

    calculateAdditionalMetrics(code) {
        return {
            variableNaming: this.checkVariableNaming(code),
            functionLength: this.checkFunctionLength(code),
            commentQuality: this.checkCommentQuality(code),
            errorHandling: this.checkErrorHandling(code),
            codeReuse: this.checkCodeReuse(code),
            bestPractices: this.checkBestPractices(code)
        };
    }

    checkVariableNaming(code) {
        const patterns = {
            singleLetter: /\b[a-z]\b(?![\w\s]*['"])/g,
            meaningful: /const|let|var\s+([a-z][a-zA-Z0-9]+)\s*=/g,
            hungarian: /[a-z]+[A-Z][a-zA-Z]+/g
        };
        
        let score = 1.0;
        if ((code.match(patterns.singleLetter) || []).length > 2) score -= 0.3;
        if ((code.match(patterns.meaningful) || []).length < 2) score -= 0.2;
        return Math.max(0, score);
    }

    checkFunctionLength(code) {
        const functions = code.match(/function\s*\w*\s*\([\s\S]*?\{[\s\S]*?\}/g) || [];
        let score = 1.0;
        
        functions.forEach(func => {
            const lines = func.split('\n').length;
            if (lines > 30) score -= 0.3;
            else if (lines > 20) score -= 0.2;
            else if (lines > 10) score -= 0.1;
        });
        
        return Math.max(0, score);
    }

    checkCommentQuality(code) {
        const patterns = {
            jsdoc: /\/\*\*[\s\S]*?\*\//g,
            inlineExplanation: /\/\/\s*(?!TODO|FIXME|NOTE).*$/gm,
            todoComments: /\/\/\s*(TODO|FIXME|NOTE)/g
        };
        
        let score = 1.0;
        if (!(code.match(patterns.jsdoc) || []).length) score -= 0.3;
        if ((code.match(patterns.todoComments) || []).length > 3) score -= 0.2;
        return Math.max(0, score);
    }

    checkErrorHandling(code) {
        const patterns = {
            tryCatch: /try\s*{[\s\S]*?}\s*catch/g,
            errorChecks: /if\s*\([^)]*(?:error|err|Exception)[^)]*\)/g,
            throwStatements: /throw\s+new\s+\w+/g
        };
        
        let score = 1.0;
        if (!(code.match(patterns.tryCatch) || []).length) score -= 0.3;
        if (!(code.match(patterns.errorChecks) || []).length) score -= 0.2;
        return Math.max(0, score);
    }

    checkCodeReuse(code) {
        const patterns = {
            duplicateCode: /(.{50,})\1+/g,
            functionCalls: /\w+\([^)]*\)/g,
            utilities: /utils|helpers|common/g
        };
        
        let score = 1.0;
        if ((code.match(patterns.duplicateCode) || []).length) score -= 0.4;
        if ((code.match(patterns.functionCalls) || []).length < 2) score -= 0.2;
        return Math.max(0, score);
    }

    checkBestPractices(code) {
        const patterns = {
            magicNumbers: /(?<!\.)\b\d{4,}\b(?!\.)/g,
            constUsage: /const\s+\w+\s*=/g,
            arrowFunctions: /=>\s*{/g,
            templateLiterals: /`[^`]*\${[^}]*}[^`]*`/g
        };
        
        let score = 1.0;
        if ((code.match(patterns.magicNumbers) || []).length > 2) score -= 0.2;
        if (!(code.match(patterns.constUsage) || []).length) score -= 0.2;
        return Math.max(0, score);
    }

    combineScores(scores) {
        const weights = {
            cognitive: 0.2,
            timeComplexity: 0.2,
            variableNaming: 0.15,
            functionLength: 0.1,
            commentQuality: 0.1,
            errorHandling: 0.1,
            codeReuse: 0.1,
            bestPractices: 0.05
        };
    
        const normalizedScores = {};
        for (const metric in scores) {
            normalizedScores[metric] = Math.min(scores[metric] / 10, 1);
        }
    
        let weightedSum = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            weightedSum += (normalizedScores[metric] || 0) * weight;
        }
    
        return Math.min(weightedSum * 10, 10);
    }
    
    
    async getJavaScriptFiles(dir) {
        const files = [];
        const items = await fs.readdir(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                files.push(...await this.getJavaScriptFiles(fullPath));
            } else if (item.endsWith('.js')) {
                files.push(fullPath);
            }
        }

        return files;
    }
}

module.exports = CodeQualityMetric;
