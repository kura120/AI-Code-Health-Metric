const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

class TimeComplexityMetric {
    parseCode(code) {
        return parser.parse(code, {
            sourceType: 'module',
            plugins: ['jsx']
        });
    }

    evaluateFunction(code) {
        try {
            const ast = this.parseCode(code);
            const analysis = this.analyzeCode(ast);
            
            // Simple array access or return statement = O(1)
            if (analysis.isConstantTime) {
                return 1.0;
            }
            
            return this.calculateComplexity(analysis.loops, analysis.recursion);
        } catch (error) {
            return 0.2;
        }
    }

    analyzeCode(ast) {
        let analysis = {
            loops: { nested: false, single: false },
            recursion: false,
            isConstantTime: true
        };

        traverse(ast, {
            ForStatement(path) {
                analysis.isConstantTime = false;
                if (path.findParent(parent => parent.isForStatement())) {
                    analysis.loops.nested = true;
                } else {
                    analysis.loops.single = true;
                }
            },
            ReturnStatement(path) {
                // Check if it's a simple return or array access
                const isSimpleReturn = !path.findParent(parent => 
                    parent.isForStatement() || 
                    parent.isWhileStatement()
                );
                analysis.isConstantTime = analysis.isConstantTime && isSimpleReturn;
            }
        });

        return analysis;
    }

    calculateComplexity(loops, recursion) {
        if (loops.nested) return 0.4; // O(n²)
        if (loops.single) return 0.8; // O(n)
        if (recursion) return 0.6;    // O(log n)
        return 1.0;                   // O(1)
    }
}

module.exports = TimeComplexityMetric;