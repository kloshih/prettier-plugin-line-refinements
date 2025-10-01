# prettier-plugin-line-refinements

Line refinement rules for Prettier

### Rules

#### Collapsed single-parameter function-like calls

```ts
throw new Error(`This is a long error message which exceeds the print width, yet still not be broken into multiple lines`)

// Special case for tagged template literals, spanning new lines
const cmd = new Command(`cli`).
    describe(`
        This is a long description which exceeds the print width, yet still not be broken into multiple lines
    `)

// This includes 2 cases: 1) format(...) call is not rewrapped, and 2) the console.log(...) call is also not rewrapped, since only one argument is passed.
console.log(format(`This is a long log message which exceeds the print width, yet still not be broken into multiple lines`).trimStart())
```

#### Inside-line padding for complex blocks

For class definitions, which contain at least one immediate callable definition, a constructor, method, getter/setter, or field definition, at least one line of padding is required at the start and end of the block. If a comment occupies the first or last line, the requirement is considered satisfied.

```ts
// Contains no callables
class Person1 {
    name: string
    age: number
}

// Contains a callable, start/end padding required
class Person2 {

    name: string
    age: number
    constructor(name: string, age: number) { 
        this.name = name 
        this.age = age
    }

}

// Padding is blank line or comment
class Person3 {
    // start comment
    name: string
    age: number
    constructor(name: string, age: number) { 
        this.name = name 
        this.age = age
    }
    // end comment
}
```

