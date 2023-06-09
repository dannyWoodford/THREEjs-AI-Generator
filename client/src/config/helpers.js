export const getContrastingColor = (color) => {
	// Remove the '#' character if it exists
	const hex = color.replace('#', '')

	// Convert the hex string to RGB values
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	// Calculate the brightness of the color
	const brightness = (r * 299 + g * 587 + b * 114) / 1000

	// Return black or white depending on the brightness
	return brightness > 128 ? 'black' : 'white'
}

function getTextBetweenTripleBackticks(str) {
	const regex = /```([\s\S]*?)```/g
	const matches = str.match(regex)
	if (matches) {
		return matches.map((match) => match.replace(/```/g, '').trim())
	}
	return []
}

function removeJavaScriptWord(str) {
	const regex = /\bjavascript\b/gi
	return str.replace(regex, '').trim()
}

function removeJSWord(str) {
  const regex = /\bjs\b/gi
	return str.replace(regex, '').trim()
}

export const sanitizeResponse = (string) => {
	const removeBackticks = getTextBetweenTripleBackticks(string)
	const removeJavaScript = removeJavaScriptWord(removeBackticks[0] === undefined ? string : removeBackticks[0])
	const removeJS = removeJSWord(removeJavaScript)

	return removeJS
}
