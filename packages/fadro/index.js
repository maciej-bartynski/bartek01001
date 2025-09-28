#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function copyDirContent(from, to) {
    const sourceDir = path.join(__dirname, from);
    const destDir = path.join(process.cwd(), to);

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(sourceDir).forEach(file => {
        const src = path.join(sourceDir, file);
        const dest = path.join(destDir, file);
        fs.copyFileSync(src, dest);
    });
}

function copyConfig() {
    const configName = 'cursorignore';
    const cursorignore = path.join(__dirname, 'config', configName);
    fs.copyFileSync(cursorignore, `.${configName}`);
}

function addToGitignore() {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const entryToAdd = '\n# Fadro\n' + 'docs/task-log.md';

    let content = '';

    if (fs.existsSync(gitignorePath)) {
        content += fs.readFileSync(gitignorePath, 'utf8');
    } else {
        return;
    }

    const lines = content.split(/\r?\n/);
    if (!lines.includes('# Fadro')) {
        const newContent = content.endsWith('\n') ? content + entryToAdd + '\n' : content + '\n' + entryToAdd + '\n';
        fs.writeFileSync(gitignorePath, newContent, 'utf8');
    }
}

copyDirContent('rules', '.cursor/rules');
copyDirContent('docs', 'docs');
copyConfig();
addToGitignore();

console.log(`✔ Fadro ready to work`);