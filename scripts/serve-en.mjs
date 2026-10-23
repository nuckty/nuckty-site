/** An independently owned nginx preview outside the cleaned build directory. */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { generateNginxConfig } from 'nuckty';

const root = path.resolve(import.meta.dirname, '..');
const directory = path.join(root, '.preview/en');
const conf = path.join(directory, 'nginx.conf');
const pidFile = path.join(directory, 'nginx.pid');

async function activePid() {
    let pid;

    try {
        pid = Number((await readFile(pidFile, 'utf8')).trim());
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }

        throw error;
    }

    if (!Number.isInteger(pid) || pid <= 0) {
        throw new Error('Invalid English preview PID');
    }

    try {
        process.kill(pid, 0);
    } catch (error) {
        if (error.code === 'ESRCH') {
            await rm(pidFile);

            return null;
        }

        throw error;
    }

    const command = execFileSync('ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' }).trim();

    if (!command.startsWith('nginx: master process ') || !command.includes(`-c ${conf} `)) {
        throw new Error('English preview PID belongs to another process');
    }

    return pid;
}

const running = await activePid();

if (process.argv.includes('--stop')) {
    if (running !== null) {
        execFileSync('nginx', ['-c', conf, '-s', 'quit'], { stdio: 'inherit' });
    }
} else {
    if (running !== null) {
        throw new Error('English preview is already running; stop it before starting another');
    }

    await mkdir(path.join(directory, 'logs'), { recursive: true });
    await writeFile(conf, generateNginxConfig(path.join(root, 'site/en'), 'nuckty-en', pidFile, 8093, path.join(directory, 'logs')));
    const child = spawn('nginx', ['-c', conf, '-g', 'daemon off;'], { stdio: 'inherit' });
    child.on('error', (error) => { throw error; });
    child.on('exit', (code) => { process.exitCode = code ?? 1; });
}

