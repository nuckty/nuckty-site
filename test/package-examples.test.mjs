import test from 'node:test';
import assert from 'node:assert/strict';
import { packageExamples } from '../scripts/package-examples.mjs';

test('renders selected official install versions without rewriting history or third-party examples', () => {
    const source = 'npm install --save-exact @nuckty/core@1.0.0-beta1 @alice/plugin@1.0.0\nPrevious @nuckty/core@1.0.0-beta1\nnpx @nuckty/core@1.0.0-beta1 build';
    assert.equal(packageExamples(source, { '@nuckty/core': '1.0.0-beta2' }), 'npm install --save-exact @nuckty/core@1.0.0-beta2 @alice/plugin@1.0.0\nPrevious @nuckty/core@1.0.0-beta1\nnpx @nuckty/core@1.0.0-beta2 build');
});

test('preserves punctuation after an inline install example', () => {
    assert.equal(packageExamples('Run `npm install @nuckty/core@1.0.0-beta1`.', { '@nuckty/core': '1.0.0-beta2' }), 'Run `npm install @nuckty/core@1.0.0-beta2`.');
});
