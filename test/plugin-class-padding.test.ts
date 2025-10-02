const { describe, it, expect } = require('bun:test')
const { trim } = require('./util.ts')
const prettier = require('prettier')

const prettierrc = {
    useTabs: false,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 80,
    tabWidth: 4,
    semi: false,
    plugins: ['./plugin.js'],
    lineRefinementsClassPadding: true,
} as any

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

            }
            `,
        },
        {
            note: 'class with multiple methods should preserve spacing between members',
            input: trim`//
            class Calculator {
                add(a: number, b: number) { return a + b }
                subtract(a: number, b: number) { return a - b }
                multiply(a: number, b: number) { return a * b }
            }`,
            output: trim`//
            class Calculator {

                add(a: number, b: number) {
                    return a + b
                }
                subtract(a: number, b: number) {
                    return a - b
                }
                multiply(a: number, b: number) {
                    return a * b
                }

            }`,
        },
        {
            note: 'class with mixed members (properties and methods)',
            input: trim`//
            class User {
                name: string
                email: string
                getName() { return this.name }
                setEmail(email: string) { this.email = email }
            }`,
            output: trim`//
            class User {

                name: string
                email: string
                getName() {
                    return this.name
                }
                setEmail(email: string) {
                    this.email = email
                }

            }`,
        },
        {
            note: 'class with up to 1 line between props and methods should be retained',
            input: trim`//
            class User {
                name: string
                email: string

                getName() { return this.name }

                setEmail(email: string) { this.email = email }
            }`,
            output: trim`//
            class User {

                name: string
                email: string

                getName() {
                    return this.name
                }

                setEmail(email: string) {
                    this.email = email
                }

            }`,
        },
        {
            note: 'class with arrow function properties should get padding',
            input: trim`//
            class EventHandler {
                private callback = () => { console.log('clicked') }
                public onClick = (event: Event) => { this.callback() }
            }`,
            output: trim`//
            class EventHandler {

                private callback = () => {
                    console.log('clicked')
                }
                public onClick = (event: Event) => {
                    this.callback()
                }

            }`,
        },
        {
            note: 'class extending another class',
            input: trim`//
            class Student extends Person {
                grade: number
                study() { console.log('studying') }
            }`,
            output: trim`//
            class Student extends Person {

                grade: number
                study() {
                    console.log('studying')
                }

            }`,
        },
        {
            note: 'empty class should not get padding',
            input: trim`//
            class Empty {}`,
            output: trim`//
            class Empty {}`,
        },
        {
            note: 'class with only static methods should get padding',
            input: trim`//
            class Utils {
                static format(text: string) { return text.trim() }
                static parse(data: string) { return JSON.parse(data) }
            }`,
            output: trim`//
            class Utils {

                static format(text: string) {
                    return text.trim()
                }
                static parse(data: string) {
                    return JSON.parse(data)
                }

            }`,
        },
        {
            note: 'class with getter and setter methods',
            input: trim`//
            class Temperature {
                private _celsius: number = 0
                get fahrenheit() { return this._celsius * 9/5 + 32 }
                set fahrenheit(f: number) { this._celsius = (f - 32) * 5/9 }
            }`,
            output: trim`//
            class Temperature {

                private _celsius: number = 0
                get fahrenheit() {
                    return (this._celsius * 9) / 5 + 32
                }
                set fahrenheit(f: number) {
                    this._celsius = ((f - 32) * 5) / 9
                }

            }`,
        },
    ]

    cases.forEach(({ note, input, output }) => {
        it(note, async () => {
            let result = await prettier.format(input, { parser: 'typescript', ...prettierrc })
            // surrounding spaces aren't important
            output = output.trim()
            result = result.trim()
            if (output != result) 
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

