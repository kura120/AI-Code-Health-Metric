const MetricEngine = require('../src/core/engine');
const ScoreConverter = require('../src/core/scoreConverter');

describe('AI Project Analysis Tests', () => {
    let engine;

    beforeEach(() => {
        engine = new MetricEngine();
    });

    test('Complete Project Analysis', async () => {
        const results = await engine.evaluateProject('./test-project');
        const score = ScoreConverter.formatOutput(results);

        expect(score.overallScore).toBeDefined();
        expect(score.rating).toBeDefined();
        expect(score.detailedScores).toMatchObject({
            folderStructure: expect.any(Number),
            codeQuality: expect.any(Number),
            complexity: expect.any(Number),
            aiConfidence: expect.any(Number)
        });

        console.log(`
=== AI Project Health Report ===
Overall Score: ${score.overallScore}/10
Rating: ${score.rating}

Detailed Analysis:
- Folder Structure: ${score.detailedScores.folderStructure}/10
- Code Quality: ${score.detailedScores.codeQuality}/10
- Complexity: ${score.detailedScores.complexity}/10
- AI Detection Confidence: ${score.detailedScores.aiConfidence}/10
        `);
    });
});
