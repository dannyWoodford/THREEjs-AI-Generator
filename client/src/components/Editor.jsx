import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import { Controlled as ControlledEditor } from 'react-codemirror2'

import state from '../store'
import { useSnapshot } from 'valtio'


export default function Editor(props) {
		const snap = useSnapshot(state)
	const { displayName, value, icon, onChange, language } = props
	const handleChange = (editor, data, value) => {
		onChange(value)
	}

	const clickHandler = () => {
		state.d3Generator = !state.d3Generator
	}

	return (
		<div className='editor-container'>
			<div className='editor-title'>
				{displayName}
				<button className='d3-switch-button' onClick={clickHandler}>
					Switch to {snap.d3Generator ? 'THREE.js AI Generator' : 'D3 AI Generator'}
				</button>
			</div>
			<ControlledEditor
				onBeforeChange={handleChange}
				value={value}
				className='code-mirror-wrapper'
				options={{
					lineWrapping: true,
					lint: true,
					mode: language,
					theme: 'material',
					lineNumbers: true,
					autoCloseTags: true,
					matchTags: true,
					autoCloseBrackets: true,
					matchBrackets: true,
				}}
			/>
		</div>
	)
}
