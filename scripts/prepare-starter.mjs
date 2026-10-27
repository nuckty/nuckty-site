/** Prepare standalone starters with exact public npm dependencies. */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'content/downloads');
const temp = mkdtempSync(path.join(tmpdir(), 'nuckty-starter-'));
const dependencies = JSON.parse(readFileSync(path.join(root, 'config/config-packages.json'), 'utf8'));
const initialPackages = new Set(['@nuckty/core', '@nuckty/ext-block-root', '@nuckty/ext-command-serve']);
function write(directory, name, content) {
    const file = path.join(directory, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof content === 'string' ? content : `${JSON.stringify(content, null, 4)}\n`);
}

try {
    mkdirSync(destination, { recursive: true });
    const receipt = {};

    for (const lang of ['ru', 'en']) {
        const ru = lang === 'ru';
        const project = path.join(temp, lang, 'nuckty-starter');
        write(project, 'package.json', { name: 'nuckty-starter', version: dependencies['@nuckty/core'], private: true, type: 'module', scripts: { build: 'nuckty build', serve: 'nuckty serve --port 8080', stop: 'nuckty stop' }, dependencies: Object.fromEntries(Object.entries(dependencies).filter(([name]) => initialPackages.has(name))) });
        write(project, '.npmrc', 'registry=https://registry.npmjs.org\n');
        write(project, 'config/config-nuckty.ts', `import { defineNucktyConfig } from '@nuckty/core';\n\nexport default defineNucktyConfig({\n    targets: { main: { configDir: 'config/', outDir: 'site/', lang: '${lang}', host: 'localhost' } },\n    ext: ['@nuckty/ext-block-root', '@nuckty/ext-command-serve'],\n});\n\n`);
        write(project, 'config/site.json', { baseUrl: 'http://localhost:8080', rootTitle: ru ? 'Мой сайт' : 'My website', bundles: ['page'] });
        write(project, 'config/levels.json', ['content', 'blocks']);
        write(project, 'config/external.json', []);
        write(project, 'config/sitemap.yml', `sitemap:\n  - ${ru ? 'Главная' : 'Home'} [/, index.md]\n`);
        write(project, 'blocks/package.json', { type: 'commonjs' });
        write(project, 'blocks/page/page.bemdecl.js', "module.exports = ['root'];\n\n");
        write(project, 'blocks/root/root.css', ':root { font-family: system-ui, sans-serif; color: #20272a; background: #f6f5ef; }\nbody { max-width: 760px; margin: 40px auto; padding: 0 20px; font-size: clamp(15px, 14px + .2vw, 18px); line-height: 1.7; }\na { color: #b5472d; }\n.article__image { width: 80px; height: auto; }\npre { padding: 16px; overflow: auto; background: #20282c; color: #e3e9d7; }\n\n');
        write(project, 'content/images/nuckty.svg', readFileSync(path.join(root, 'blocks/brand/brand.svg'), 'utf8'));
        write(project, 'content/index.md', ru ? '![nuckty](images/nuckty.svg)\n\n# Привет, nuckty\n\nЭто ваша первая страница. Измените текст в `content/index.md` и запустите `npm run build`.\n\n## Как она собирается\n\nMarkdown → BEMJSON → шаблоны → HTML.\n\n' : '![nuckty](images/nuckty.svg)\n\n# Hello, nuckty\n\nThis is your first page. Edit `content/index.md` and run `npm run build`.\n\n## How it is built\n\nMarkdown → BEMJSON → templates → HTML.\n\n');
        write(project, 'README.md', `# nuckty starter\n\nRequires Node.js 24+ and npm. Install with \`npm install\`, then run \`npm run build\`. Core/root/serve are installed initially. All packages are installed from public npm. Add an extension with npm install --save-exact @nuckty/ext-block-gallery@${dependencies['@nuckty/ext-block-gallery']}.\n\nWith nginx installed, \`npm run serve\` previews the built site at http://localhost:8080. Stop it with \`npm run stop\`.\n\nEdit \`content/index.md\`; add pages in \`config/sitemap.yml\`; declare blocks in \`blocks/page/page.bemdecl.js\`. Output is \`site/\`.\n\n`);
        write(project, 'LICENSE', readFileSync(path.join(root, 'LICENSE'), 'utf8'));
        write(project, '.gitignore', 'node_modules/\nsite/\n.build/\n\n');
        const zip = path.join(destination, `nuckty-starter-${lang}.zip`);
        execFileSync('python3', ['-c', 'import pathlib,sys,zipfile; p=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED,compresslevel=9); [z.write(f,f.relative_to(p.parent)) for f in sorted(p.rglob("*")) if f.is_file()]; z.close()', project, zip]);
        const bytes = readFileSync(zip);
        receipt[lang] = { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), packages: dependencies };
    }

    write(destination, 'receipt.json', receipt);
    process.stdout.write('Prepared Russian and English starter ZIPs with exact public npm dependencies.\n');
} finally {
    rmSync(temp, { recursive: true, force: true });
}
