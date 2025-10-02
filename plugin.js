
const { /* parsers,  */doc } = require('prettier')
const { parsers } = require('prettier/parser-typescript')
const prettierPluginEstree = require('prettier/plugins/estree')
const { /* concat, line, */ hardline, indent, /* group, softline */ } = doc.builders

const tsParsers = parsers.typescript
const defaultPrinter = prettierPluginEstree.printers.estree

/**
 * @typedef {import('prettier').Parser} Parser
 * @typedef {import('prettier').Printer} Printer
 * @typedef {import('prettier').Plugin} Plugin
 * @typedef {import('prettier').AstPath} AstPath
 * @typedef {import('prettier').Doc} Doc
 * @typedef {import('prettier').ParserOptions} ParserOptions
 */


// console.log(`plugin loaded`)

module.exports = {
	parsers: {
		typescript: {
			...tsParsers,
		}
	},
	printers: {
		estree: {
			...defaultPrinter,
			print(path, options, print) {
				// let val = defaultPrinter.print(path, options, print)
				let val = printNode(path, options, print)
				if (val == null)
					val = defaultPrinter.print(path, options, print)
				return val
				// const node = path.getValue()

				// // ✅ This will actually show up in your output
				// if (node.type === 'Program') {
				// 	console.log('🎯 Plugin is being called!')
				// }
				// switch (node.type) {
				// 	case 'ClassDeclaration':
				// 	case 'ClassExpression':
				// 		if (options.lineRefinementsClassPadding) {
				// 			return printClassDeclaration(path, options, print)
				// 		}
				// 		break
				// 	case 'CallExpression':
				// 	case 'NewExpression':
				// 	case 'OptionalCallExpression':
				// 	case 'OptionalNewExpression':
				// 		if (options.lineRefinementsSingleParameterLine) {
				// 			return printCallExpression(path, options, print)
				// 		}
				// }
			}
		}
	},

	options: {
		lineRefinementsClassPadding: {
			type: 'boolean',
			default: false,
			description: 'Add padding inside class bodies that contain callable members'
		},
		lineRefinementsSingleParameterLine: {
			type: 'boolean',
			default: false,
			description: 'Keep single parameter calls on one line'
		}
	}
}

function printNode(path, options, print) {
	const node = path.getValue()

	switch (node.type) {
		case 'ClassDeclaration':
		case 'ClassExpression':
			if (options.lineRefinementsClassPadding) {
				return printClassDeclaration(path, options, print)
			}
			break
		case 'CallExpression':
		case 'NewExpression':
		case 'OptionalCallExpression':
		case 'OptionalNewExpression':
			if (options.lineRefinementsSingleParameterLine) {
				return printCallExpression(path, options, print)
			}
	}
	return null
}


function printClassDeclaration(path, options, print) {
	const node = path.getValue()
	const bodyContent = node.body.body

	// Check if class contains callable members
	const hasCallables = bodyContent.some(member => {
		return (
			member.type === 'MethodDefinition' ||
			(member.type === 'PropertyDefinition' && member.value && (member.value.type === 'FunctionExpression' || member.value.type === 'ArrowFunctionExpression'))
		)
	})

	if (hasCallables) {
		// Get the original source to detect existing blank lines
		const sourceCode = options.originalText

		// Print everything except the body first
		const classHeader = node.id ? [ 'class ', path.call(print, 'id') ] : [ 'class' ]
		const superClass = node.superClass ? [ ' extends ', path.call(print, 'superClass') ] : []

		// For the body, we need to manually format it with padding
		const bodyMembers = path.map(print, 'body', 'body')

		// Add line breaks between members, preserving existing blank lines
		const membersWithBreaks = []
		for (let i = 0; i < bodyMembers.length; i++) {
			membersWithBreaks.push(bodyMembers[i])

			if (i < bodyMembers.length - 1) {
				// Check if there's already a blank line between this member and the next
				const currentMember = bodyContent[i]
				const nextMember = bodyContent[i + 1]

				if (currentMember && nextMember && sourceCode) {
					const currentEnd = currentMember.end || currentMember.range?.[1]
					const nextStart = nextMember.start || nextMember.range?.[0]

					if (currentEnd && nextStart) {
						const textBetween = sourceCode.slice(currentEnd, nextStart)
						const hasExistingBlankLine = /\n\s*\n/.test(textBetween)

						if (hasExistingBlankLine) {
							// Preserve the blank line
							membersWithBreaks.push(hardline, hardline)
						} else {
							// Just add a single line break
							membersWithBreaks.push(hardline)
						}
					} else {
						membersWithBreaks.push(hardline)
					}
				} else {
					membersWithBreaks.push(hardline)
				}
			}
		}

		const bodyWithPadding = [
			'{',
			hardline,
			indent([ hardline, ...membersWithBreaks, hardline ]),
			hardline,
			'}'
		]

		return [ classHeader, superClass, ' ', bodyWithPadding ]
	}
	return null
}

function printCallExpression(path, _options, print) {
	const node = path.getValue()
	if (node.arguments.length === 1) {
		const callee = path.call(print, 'callee')
		const argument = path.call(print, 'arguments', 0)
		switch (node.type) {
			case 'NewExpression':
				return [ 'new ', callee, '(', argument, ')' ]
			case 'OptionalNewExpression':
				return [ 'new ', callee, '?.(', argument, ')' ]
			default:
				return [ '', callee, '(', argument, ')' ]
		}
	}
	return null
}