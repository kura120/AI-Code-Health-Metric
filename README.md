# Code Health Metric System
This was a school project for a research journal competition. I know the code is messy and lacking; feel free to do with it as you see fit.

A tool for evaluating code quality, complexity, and AI detection in software projects.
(README not completed / correct)
## Features

- Folder Structure Analysis
- Code Quality Assessment
- Complexity Metrics
- AI Generation Detection
- Weighted Scoring System

## Installation

Was going to turn this into an NPM package, never did. You could install it locally.

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
Determines likelihood of AI-generated code (fairly works)

Pattern recognition
Structure analysis
Framework usage

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Authors
- [@kura120](https://github.com/kura120)

