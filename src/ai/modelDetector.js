const fs = require('fs');
const path = require('path');

class ModelDetector {
    constructor() {
        this.aiPatterns = {
            placeholders: {
                pattern: /\[Your\s*[^\]]+\]/g,
                weight: 0.3
            },
            templateComments: {
                pattern: /\/\/\s*(Function to|Simulate|Update|This will|Here we)/i,
                weight: 0.2
            },
            genericDataStructures: {
                pattern: /{(\s*[a-zA-Z]+:\s*('[^']*'|\[[^\]]*\])\s*,?\s*)+}/g,
                weight: 0.15
            },
            ellipsisComments: {
                pattern: /\/\/\s*\.\.\./g,
                weight: 0.2
            },
            dummyData: {
                pattern: /'Your [A-Z][a-z]+ [A-Z]?[a-z]*'|'Lorem ipsum'/g,
                weight: 0.15
            }
        };

        this.humanPatterns = {
            specificImports: {
                pattern: /require\(['"]\.\.?\/[^'"]+['"]\)/g,
                weight: 0.25
            },
            complexErrorHandling: {
                pattern: /catch\s*\([^)]+\)\s*{[^}]+}/g,
                weight: 0.25
            },
            configurationObjects: {
                pattern: /module\.exports\s*=\s*{[\s\S]+?}/g,
                weight: 0.25
            },
            productionComments: {
                pattern: /\/\*[\s\S]*?\*\/|\/\/.*TODO|FIXME|NOTE/g,
                weight: 0.25
            }
        };
    }

    async evaluate(projectPath) {
        try {
            const files = this.getAllJavaScriptFiles(projectPath);
            let totalScore = 0;

            for (const file of files) {
                const code = fs.readFileSync(file, 'utf8');
                totalScore += this.analyzeFile(code);
            }

            return files.length > 0 ? totalScore / files.length : 0.5;
        } catch (error) {
            return 0.5;
        }
    }

    analyzeFile(code) {
        const aiScore = this.checkPatterns(code, this.aiPatterns);
        const humanScore = this.checkPatterns(code, this.humanPatterns);
        
        return this.calculateConfidenceScore(aiScore, humanScore);
    }

    checkPatterns(code, patterns) {
        let score = 0;
        let totalWeight = 0;

        for (const [name, {pattern, weight}] of Object.entries(patterns)) {
            const matches = (code.match(pattern) || []).length;
            score += matches > 0 ? weight : 0;
            totalWeight += weight;
        }

        return score / totalWeight;
    }

    calculateConfidenceScore(aiScore, humanScore) {
        const totalScore = aiScore + humanScore;
        if (totalScore === 0) return 0.5;
        
        return aiScore / totalScore;
    }

    getAllJavaScriptFiles(dir) {
        let files = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                files = files.concat(this.getAllJavaScriptFiles(fullPath));
            } else if (item.endsWith('.js')) {
                files.push(fullPath);
            }
        }

        return files;
    }
}

module.exports = ModelDetector;