import { describe, it, expect } from 'bun:test'

import prettier from 'prettier'

const prettierrc = {
    useTabs: false,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 140,
    tabWidth: 4,
    semi: false,
    plugins: ['./plugin.js'],
    overrides: [
        {
            files: '*.svelte',
            options: {
                parser: 'svelte',
            },
        },
    ],
} as Partial<prettier.Options>

describe('block-insidelinepadding', () => {
    const cases = [
        {
            note: 'class bodies with a single member may have no inside line padding',
            input: trim`//
            class Person {
                name: string
            }`,
            output: trim`//
            class Person {
                name: string
            }`,
        },
        {
            note: 'class bodies with at least one constructor/method should have inside line padding',
            input: trim`//
            class Person {
                constructor(name: string) { 
                    this.name = name 
                }
            }`,
            output: trim`//
            class Person {

                constructor(name: string) { 
                    this.name = name 
                }

            }`,
        },
    ]

    cases.forEach(({ note, input, output }) => {
        it(note, async () => {
            const result = await prettier.format(input, { parser: 'typescript', ...prettierrc })
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

/**
 * Removes leading indentation, measured by, the greatest common indent
 * @param str
 */
function dedent(str: string, opts?: { trim: boolean | 'start' | 'end' }) {
    const lines = str.split('\n')
    let minIndent: string | undefined
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]!
        const match = line.match(/^\s*(?=\S)/)
        if (match) {
            const indent = match[0]
            if (minIndent === undefined || indent.length < minIndent.length) {
                minIndent = indent
            }
        }
    }
    if (minIndent) {
        str = lines.map((line) => (line.startsWith(minIndent!) ? line.slice(minIndent!.length) : line)).join('\n')
    }
    if (opts?.trim === true) {
        str = str.trim()
    } else if (opts?.trim === 'start') {
        str = str.replace(/^\s+/, '')
    } else if (opts?.trim === 'end') {
        str = str.replace(/\s+$/, '')
    }
    return str
}

/**
 * Template literal tag to dedent multiline strings
 */
function trim(strings: TemplateStringsArray, ...values: any[]) {
    let result = ''
    for (let i = 0; i < strings.length; i++) {
        result += strings[i]
        if (i < values.length) {
            result += values[i]
        }
    }
    return dedent(result, { trim: true })
}
