/** Render official npm install examples from the verified deployment package set. */
export function packageExamples(text, versions) {
    return text.split('\n').map((line) => {
        if (!/\b(?:npm (?:install|exec)|npx)\b/.test(line)) {
            return line;
        }

        return line.replace(/(@nuckty\/[a-z0-9-]+)@\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?/g, (example, name) => versions[name] ? `${name}@${versions[name]}` : example);
    }).join('\n');
}
