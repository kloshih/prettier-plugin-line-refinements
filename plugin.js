export default {
	printers: {
		'typescript-estree': {
			/**
			 * A line			 
			 * @param   {any} path
			 * @param   {any} options
			 * @param   {any} print
			 * @returns
			 */
			print(path, options, print) {
				const node = path.getValue()

				// Handle function calls with a single argument to keep on one
				// line
				if (node.type === 'CallExpression' && node.arguments.length === 1) {
					const arg = node.arguments[ 0 ]

					// Check if the single argument would benefit from staying
					// on one line
					if (arg.type === 'Literal' || arg.type === 'TemplateLiteral' || arg.type === 'BinaryExpression' || arg.type === 'Identifier') {
						const callee = path.call(print, 'callee')
						const argument = path.call(print, 'arguments', 0)

						// Force inline formatting with group and ifBreak
						return [ '', callee, '(', argument, ')' ]
					}
				}
				// Return null to use default formatting
				return null
			}
		}
	}
}
