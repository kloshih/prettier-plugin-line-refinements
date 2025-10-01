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
} as Partial<prettier.Options>

describe('lineRefinementsClassPadding', () => {
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

