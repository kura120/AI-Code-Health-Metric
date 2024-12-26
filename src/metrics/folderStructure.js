const fs = require('fs');
const path = require('path');

class FolderStructureMetric {
    async evaluate(projectPath) {
        const stats = {
            files: this.countFiles(projectPath),
            folders: this.countSubfolders(projectPath),
            depth: this.calculateDirectoryDepth(projectPath)
        };
        
        if (stats.folders === 0) {
            return Math.min(stats.files * 0.5, 1.5) / 10;
        }
        
        const componentScores = {
            fileScore: Math.min(stats.files * 0.1, 1),
            folderScore: Math.min(stats.folders * 0.5, 2),
            depthScore: Math.min(stats.depth * 0.5, 2)
        };
        
        return Math.min(
            Object.values(componentScores).reduce((sum, score) => sum + score, 0) / 5,
            1
        );
    }
    
    countFiles(dir) {
        return fs.readdirSync(dir)
            .filter(item => fs.statSync(path.join(dir, item)).isFile())
            .length;
    }

    async analyzeStructure(projectPath) {
        return {
            projectPath,
            hasSourceFolder: this.checkDirectory(projectPath, 'src'),
            depth: this.calculateDirectoryDepth(projectPath),
            subfolders: this.countSubfolders(projectPath),
            distribution: this.evaluateFileDistribution(projectPath),
            coherence: this.evaluateProjectCoherence({ projectPath })
        };
    }

    checkDirectory(basePath, dirName) {
        const dirPath = path.join(basePath, dirName);
        return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    }

    calculateDirectoryDepth(dir) {
        let maxDepth = 0;
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                const depth = this.calculateDirectoryDepth(fullPath);
                maxDepth = Math.max(maxDepth, depth + 1);
            }
        }

        return maxDepth;
    }

    countSubfolders(dir) {
        return fs.readdirSync(dir)
            .filter(item => fs.statSync(path.join(dir, item)).isDirectory())
            .length;
    }

    evaluateFileDistribution(dir) {
        const files = this.getAllFiles(dir);
        const filesPerFolder = this.getFilesPerFolder(files);
        const avgFilesPerFolder = files.length / Math.max(this.countSubfolders(dir), 1);
        const variance = this.calculateDistributionVariance(filesPerFolder, avgFilesPerFolder);
        
        return Math.min(1 / (variance + 1), 1);
    }

    getAllFiles(dir) {
        let files = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                files = files.concat(this.getAllFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        }

        return files;
    }

    getFilesPerFolder(files) {
        const folderCounts = {};
        files.forEach(file => {
            const folder = path.dirname(file);
            folderCounts[folder] = (folderCounts[folder] || 0) + 1;
        });
        return Object.values(folderCounts);
    }

    calculateDistributionVariance(values, mean) {
        if (values.length === 0) return 0;
        return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    }

    evaluateProjectCoherence(structure) {
        let score = 0;
        score += this.hasLogicalGrouping(structure.projectPath) ? 0.5 : 0;
        score += this.hasEntryPoint(structure.projectPath) ? 0.5 : 0;
        return score;
    }

    hasLogicalGrouping(dir) {
        const items = fs.readdirSync(dir);
        const folders = items.filter(item => fs.statSync(path.join(dir, item)).isDirectory());
        return folders.length > 0;
    }

    hasEntryPoint(dir) {
        const items = fs.readdirSync(dir);
        return items.some(item => {
            const fullPath = path.join(dir, item);
            return fs.statSync(fullPath).isFile() && path.extname(item) === '.js';
        });
    }

    calculateScore(structure) {
        const baseScore = 
            (structure.hasSourceFolder ? 30 : (structure.depth >= 2 ? 20 : 10)) +
            Math.min(structure.subfolders * 10, 30) +
            Math.floor(structure.distribution * 20) +
            Math.floor(structure.coherence * 20);

        return Math.min(baseScore / 10, 10);
    }
    
    
}

module.exports = FolderStructureMetric;