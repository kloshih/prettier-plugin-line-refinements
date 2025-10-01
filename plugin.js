
import { parsers } from 'prettier/parser-typescript'
import * as prettierPluginEstree from 'prettier/plugins/estree'

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

const { doc } = require('prettier')
const { concat, line, hardline, indent, group, softline } = doc.builders

// console.log(`plugin loaded`)

export default {
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
	const body = path.call(print, 'body')
	const bodyContent = node.body.body

	// Check if class contains callable members
	const hasCallables = bodyContent.some(member => {
		return (
			member.type === 'MethodDefinition' ||
			(member.type === 'PropertyDefinition' && member.value && (member.value.type === 'FunctionExpression' || member.value.type === 'ArrowFunctionExpression'))
		)
	})

	if (hasCallables) {
		// For classes with callable members, we need to custom format the class body
		const node = path.getValue()

		// Print everything except the body first
		const classHeader = node.id ? ['class ', path.call(print, 'id')] : ['class']
		const superClass = node.superClass ? [' extends ', path.call(print, 'superClass')] : []

		// For the body, we need to manually format it with padding
		const bodyMembers = path.map(print, 'body', 'body')

		// Add line breaks between members
		const membersWithBreaks = []
		for (let i = 0; i < bodyMembers.length; i++) {
			membersWithBreaks.push(bodyMembers[i])
			if (i < bodyMembers.length - 1) {
				membersWithBreaks.push(hardline)
			}
		}

		const bodyWithPadding = [
			'{',
			hardline,
			indent([hardline, ...membersWithBreaks, hardline]),
			hardline,
			'}'
		]

		return [classHeader, superClass, ' ', bodyWithPadding]
	}
	return null
}

function printCallExpression(path, options, print) {
	const node = path.getValue()
	if (node.arguments.length === 1) {
		const callee = path.call(print, 'callee')
		const argument = path.call(print, 'arguments', 0)
		return [ '', callee, '(', argument, ')' ]
	}
	return null
}