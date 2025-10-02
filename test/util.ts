
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

function init() {

    // throw new Error('This is a long error message which exceeds the print width, yet still not be broken into multiple lines')

    // const cmd = new Command('cli').
    //     describe(`
    //         This is a long description which exceeds the print width, yet still not be broken into multiple lines
    //     `)

    // console.log(format('This is a long log message which exceeds the print width, yet still not be broken into multiple lines').trimStart())

}

module.exports = { dedent, trim }