/** Pack a standalone starter without requiring nuckty's public registry names. */
import { cpSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const workspace = path.dirname(root);
const destination = path.join(root, 'content/downloads');
const temp = mkdtempSync(path.join(tmpdir(), 'nuckty-starter-'));
const excluded = new Set(['node_modules', '.git', '.build', 'site', 'dist', 'plans', 'external', '.npmrc', '.aws', '.agents', '.codex', '.coverage', 'coverage']);
const names = ['nuckty', 'nuckty-ext-block-root', 'nuckty-ext-command-serve', 'nuckty-ext-block-gallery', 'nuckty-ext-block-grid', 'nuckty-ext-markdown-typography-ru', 'nuckty-ext-markdown-video', 'nuckty-ext-command-validate-vnu', 'nuckty-ext-command-deploy-ftp', 'nuckty-ext-command-content-external', 'nuckty-ext-command-convert-images'];
const initialPackages = new Set(['nuckty', 'nuckty-ext-block-root', 'nuckty-ext-command-serve']);
const env = { ...process.env, npm_config_userconfig: path.join(temp, 'npmrc'), npm_config_globalconfig: path.join(temp, 'global.npmrc'), npm_config_registry: 'https://registry.npmjs.org', npm_config_cache: process.env.NUCKTY_NPM_CACHE ?? path.join(root, '.cache/npm-starter') };
writeFileSync(env.npm_config_userconfig, '');
writeFileSync(env.npm_config_globalconfig, '');

function write(directory, name, content) {
    const file = path.join(directory, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof content === 'string' ? content : `${JSON.stringify(content, null, 4)}\n`);
}

try {
    const archives = path.join(temp, 'archives');
    mkdirSync(archives);
    const dependencies = {};

    for (const name of names) {
        const original = path.join(workspace, name);
        const source = path.join(temp, 'sources', name);
        cpSync(original, source, { recursive: true, filter: (entry) => !excluded.has(path.basename(entry)) && !path.basename(entry).startsWith('.env') && !entry.endsWith('.tgz') && !lstatSync(entry).isSymbolicLink() });
        symlinkSync(path.join(original, 'node_modules'), path.join(source, 'node_modules'), 'dir');
        const output = execFileSync('npm', ['pack', '--json', '--offline', '--cache', env.npm_config_cache, '--pack-destination', archives], { cwd: source, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        const [packed] = JSON.parse(output.slice(output.lastIndexOf('\n[\n') + 1));
        dependencies[name] = `file:packages/${packed.filename}`;
    }

    mkdirSync(destination, { recursive: true });
    const receipt = {};

    for (const lang of ['ru', 'en']) {
        const ru = lang === 'ru';
        const project = path.join(temp, lang, 'nuckty-starter');
        cpSync(archives, path.join(project, 'packages'), { recursive: true });
        write(project, 'package.json', { name: 'nuckty-starter', version: '1.0.0-beta1', private: true, type: 'module', scripts: { build: 'nuckty build', serve: 'nuckty serve --port 8080', stop: 'nuckty stop' }, dependencies: Object.fromEntries(Object.entries(dependencies).filter(([name]) => initialPackages.has(name))) });
        write(project, '.npmrc', 'registry=https://registry.npmjs.org\n');
        write(project, 'config/config-nuckty.ts', `import { defineNucktyConfig } from 'nuckty';\n\nexport default defineNucktyConfig({\n    targets: { main: { configDir: 'config/', outDir: 'site/', lang: '${lang}', host: 'localhost' } },\n    ext: ['nuckty-ext-block-root', 'nuckty-ext-command-serve'],\n});\n\n`);
        write(project, 'config/site.json', { baseUrl: 'http://localhost:8080', rootTitle: ru ? 'Мой сайт' : 'My website', bundles: ['page'] });
        write(project, 'config/levels.json', ['content', 'blocks']);
        write(project, 'config/external.json', []);
        write(project, 'config/sitemap.yml', `sitemap:\n  - ${ru ? 'Главная' : 'Home'} [/, index.md]\n`);
        write(project, 'blocks/package.json', { type: 'commonjs' });
        write(project, 'blocks/page/page.bemdecl.js', "module.exports = ['root'];\n\n");
        write(project, 'blocks/root/root.css', ':root { font-family: system-ui, sans-serif; color: #20272a; background: #f6f5ef; }\nbody { max-width: 760px; margin: 40px auto; padding: 0 20px; font-size: clamp(15px, 14px + .2vw, 18px); line-height: 1.7; }\na { color: #b5472d; }\n.article__image { width: 80px; height: auto; }\npre { padding: 16px; overflow: auto; background: #20282c; color: #e3e9d7; }\n\n');
        write(project, 'content/images/nuckty.svg', readFileSync(path.join(root, 'blocks/brand/brand.svg'), 'utf8'));
        write(project, 'content/index.md', ru ? '![nuckty](images/nuckty.svg)\n\n# Привет, nuckty\n\nЭто ваша первая страница. Измените текст в `content/index.md` и запустите `npm run build`.\n\n## Как она собирается\n\nMarkdown → BEMJSON → шаблоны → HTML.\n\n' : '![nuckty](images/nuckty.svg)\n\n# Hello, nuckty\n\nThis is your first page. Edit `content/index.md` and run `npm run build`.\n\n## How it is built\n\nMarkdown → BEMJSON → templates → HTML.\n\n');
        write(project, 'README.md', '# nuckty starter\n\nRequires Node.js 24+ and npm. Install with `npm install`, then run `npm run build`. Core/root/serve are installed initially. The packages directory also contains the other extension archives; install one with npm install ./packages/PACKAGE-VERSION.tgz. Runtime dependencies come from public npm.\n\nWith nginx installed, `npm run serve` previews the built site at http://localhost:8080. Stop it with `npm run stop`.\n\nEdit `content/index.md`; add pages in `config/sitemap.yml`; declare blocks in `blocks/page/page.bemdecl.js`. Output is `site/`.\n\n');
        write(project, 'LICENSE', readFileSync(path.join(root, 'LICENSE'), 'utf8'));
        write(project, '.gitignore', 'node_modules/\nsite/\n.build/\n\n');
        const zip = path.join(destination, `nuckty-starter-${lang}.zip`);
        execFileSync('python3', ['-c', 'import pathlib,sys,zipfile; p=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED,compresslevel=9); [z.write(f,f.relative_to(p.parent)) for f in sorted(p.rglob("*")) if f.is_file()]; z.close()', project, zip]);
        const bytes = readFileSync(zip);
        receipt[lang] = { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), packages: dependencies };
    }

    write(destination, 'receipt.json', receipt);
    process.stdout.write('Prepared Russian and English starter ZIPs with all eleven package archives.\n');
} finally {
    rmSync(temp, { recursive: true, force: true });
}
