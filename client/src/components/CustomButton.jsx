import React from 'react'

import { getContrastingColor } from '../config/helpers'

const CustomButton = ({ type, title, customStyles, handleClick }) => {
	const generateStyle = (type) => {
		if (type === 'filled') {
			return {
				backgroundColor: 'orange',
				color: getContrastingColor('orange'),
			}
		} else if (type === 'outline') {
			return {
				borderWidth: '1px',
				borderColor: 'orange',
				color: 'orange',
			}
		}
	}

	return (
		<button className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`} style={generateStyle(type)} onClick={handleClick}>
			{title}
		</button>
	)
}

export default CustomButton
