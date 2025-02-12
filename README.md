# Code Health Metric System

A sophisticated tool for evaluating code quality, complexity, and AI detection in software projects.
(README not completed / correct)
## Features

- Folder Structure Analysis
- Code Quality Assessment
- Complexity Metrics
- AI Generation Detection
- Weighted Scoring System

## Installation

```bash
npm install code-health-metric
```

## Usage

```js
const Engine = require('./src/core/engine');
const engine = new Engine();

// Analyze a project
const results = await engine.evaluateProject('./your-project-path');
console.log(results);
```

## Metrics

### Folder Structure (0-10)
Evaluates project organization and file hierarchy

Source folder presence
Directory depth
File distribution

### Code Quality (0-10)
Measures code maintainability and best practices

Documentation
Naming conventions
Code organization

### Complexity (0-10)
Analyzes code complexity metrics

Cyclomatic complexity
Cognitive load
Function depth

### AI Detection (0-10)
Determines likelihood of AI-generated code

Pattern recognition
Structure analysis
Framework usage

## Contributing
Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Create a Pull Request

Authors
- [@kura120](https://github.com/kura120)

