import { describe, it, expect } from 'bun:test';

import prettier from 'prettier';

function sampleFunc01() {
	if (true) {
		throw new Error(`
            This is a multiline error message, which should be formatted such that the first tick sticks with the open parenthesis.
        `.replace(/\s+/g, ' ').trim());
	}
}
const expected = `function sampleFunc01() {
	if (true) {
		throw new Error(\`
            This is a multiline error message, which should be formatted such that the first tick sticks with the open parenthesis.
        \`.replace(/\s+/g, ' ').trim());
	}
}`;

const prettierrc = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 140,
	plugins: ['./index.js'],
};

describe('item', () => {
	it('should succeed', async () => {
		const formatted = prettier.format(sampleFunc01.toString(), { parser: 'typescript' });
		console.log(`source:\n---\n${sampleFunc01.toString()}\n---\nformatted:\n---${formatted}\n---`);
		// expect(formatted).toMatchSnapshot();
	});
});
