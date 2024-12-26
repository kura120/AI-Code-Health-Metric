const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');

class ComplexityMetrics {
    calculateCyclomaticComplexity(projectPath) {
        let totalComplexity = 0;
        let fileCount = 0;

        const files = this.getJavaScriptFiles(projectPath);
        
        files.forEach(file => {
            const code = fs.readFileSync(file, 'utf-8');
            const fileComplexity = this.analyzeFileComplexity(code);
            totalComplexity += fileComplexity.average;
            fileCount++;
        });

        const finalScore = fileCount > 0 ? (totalComplexity / fileCount) : 1;

        return {
            average: finalScore,
            methods: []
        };
    }

    analyzeFileComplexity(code) {
        try {
            const ast = parser.parse(code, {
                sourceType: 'module',
                plugins: ['jsx']
            });
            
            let complexity = 1;

            traverse(ast, {
                IfStatement: () => complexity++,
                WhileStatement: () => complexity++,
                ForStatement: () => complexity++,
                DoWhileStatement: () => complexity++,
                SwitchCase: () => complexity++,
                LogicalExpression: ({ node }) => {
                    if (node.operator === '&&' || node.operator === '||') complexity++;
                },
                ConditionalExpression: () => complexity++,
                CatchClause: () => complexity++,
                FunctionDeclaration: () => complexity++,
                FunctionExpression: () => complexity++,
                ArrowFunctionExpression: () => complexity++
            });

            return { average: complexity };
        } catch (error) {
            return { average: 1 };
        }
    }

    getJavaScriptFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                files.push(...this.getJavaScriptFiles(fullPath));
            } else if (path.extname(fullPath) === '.js') {
                files.push(fullPath);
            }
        });

        return files;
    }
}

module.exports = ComplexityMetrics;
