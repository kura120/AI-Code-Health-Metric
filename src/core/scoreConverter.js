class ScoreConverter {
    static toTenPointScale(score) {
        return Math.round(score * 10 * 100) / 100; // Rounds to 2 decimal places
    }

    static formatOutput(metrics) {
        const tenPointMetrics = {};
        for (const [key, value] of Object.entries(metrics)) {
            tenPointMetrics[key] = this.toTenPointScale(value);
        }

        return {
            overallScore: this.toTenPointScale(metrics.overallScore),
            detailedScores: tenPointMetrics,
            rating: this.getRatingLabel(metrics.overallScore)
        };
    }

    static getRatingLabel(score) {
        const tenPointScore = this.toTenPointScale(score);
        if (tenPointScore >= 9) return "Excellent";
        if (tenPointScore >= 7) return "Good";
        if (tenPointScore >= 5) return "Average";
        if (tenPointScore >= 3) return "Needs Improvement";
        return "Poor";
    }
}

module.exports = ScoreConverter;