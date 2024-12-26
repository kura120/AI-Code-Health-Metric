const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

class CognitiveComplexityMetric {
    evaluate(code) {
        const complexity = this.calculateCognitiveComplexity(code);
        
        // Scoring based on cognitive complexity thresholds
        if (complexity <= 5) return 1.0;
        if (complexity <= 10) return 0.8;
        if (complexity <= 20) return 0.6;
        if (complexity <= 30) return 0.4;
        return 0.2;
    }

    calculateCognitiveComplexity(code) {
        try {
            const ast = parser.parse(code, {
                sourceType: 'module',
                plugins: ['jsx']
            });
            
            let complexity = 0;
            traverse(ast, {
                IfStatement: () => complexity++,
                WhileStatement: () => complexity++,
                ForStatement: () => complexity++,
                SwitchCase: () => complexity++,
                LogicalExpression: () => complexity++,
                ConditionalExpression: () => complexity++
            });
            
            return complexity;
        } catch (error) {
            return 0;
        }
    }

    getComplexityBreakdown(code) {
        return {
            total: this.calculateCognitiveComplexity(code),
            details: this.analyzeComplexityFactors(code)
        };
    }

    analyzeComplexityFactors(code) {
        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['jsx']
        });

        const factors = {
            nesting: 0,
            recursion: 0,
            conditionals: 0
        };

        traverse(ast, {
            IfStatement: (path) => {
                factors.conditionals++;
                factors.nesting += path.get('consequent').isBlockStatement() ? 1 : 0;
            },
            FunctionDeclaration: (path) => {
                const functionName = path.node.id.name;
                path.traverse({
                    CallExpression: (callPath) => {
                        if (callPath.node.callee.name === functionName) {
                            factors.recursion++;
                        }
                    }
                });
            }
        });

        return factors;
    }
}

module.exports = CognitiveComplexityMetric;
