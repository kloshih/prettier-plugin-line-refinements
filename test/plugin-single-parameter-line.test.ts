import { describe, it, expect } from 'bun:test'
import { trim } from './util.js'
import prettier from 'prettier'

const prettierrc = {
    useTabs: false,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 140,
    tabWidth: 4,
    semi: false,
    plugins: ['./plugin.js'],
    lineRefinementsSingleParameterLine: true,
} as Partial<prettier.Options>

describe('lineRefinementsSingleParameterLine', () => {
    const cases = [
        {
            note: 'Callables with a single param, will stay on one line',
            input: trim`//
            throw new Error('This is a long error message which exceeds the print width, yet still not be broken into multiple lines')
            `,
            output: trim`//
            throw new Error('This is a long error message which exceeds the print width, yet still not be broken into multiple lines')
            `,
        },
        {
            note: 'Special case for tagged template literals, spanning new lines',
            input: trim`//
            const cmd = new Command('cli').
                describe(\`
                    This is a long description which exceeds the print width, yet still not be broken into multiple lines
                \`)
            `,
            output: trim`//
            const cmd = new Command('cli').describe(\`
                    This is a long description which exceeds the print width, yet still not be broken into multiple lines
                \`)
            `,
        },
        {
            note: 'Multiple callables on one line',
            input: trim`//
            console.log(format('This is a long log message which exceeds the print width, yet still not be broken into multiple lines').trimStart())
            `,
            output: trim`//
            console.log(format('This is a long log message which exceeds the print width, yet still not be broken into multiple lines').trimStart())
            `,
        },
    ]

    cases.forEach(({ note, input, output }) => {
        it(note, async () => {
            let result = await prettier.format(input, { parser: 'typescript', ...prettierrc })
            // surrounding spaces aren't important
            output = output.trim()
            result = result.trim()
            console.log(`input:\n---\n${input}\n---\n` + `output:\n---\n${output}\n---\n` + `formatted:\n---\n${result}\n---`)
            expect(result).toEqual(output)
        })
    })

    // it('should succeed', async () => {
    // 	const formatted = prettier.format(sampleFunc01.toString(), { parser: 'typescript' });
    // 	console.log(`source:\n---\n${sampleFunc01.toString()}\n---\nformatted:\n---${formatted}\n---`);
    // 	// expect(formatted).toMatchSnapshot();
    // });
})
