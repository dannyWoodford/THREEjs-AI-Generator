import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
// import { CodeInput } from '@srsholmes/react-code-input'

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, AIGenerator, ColorPicker, CustomButton, FilePicker, Tab } from '../components'

const Customizer = () => {
	const snap = useSnapshot(state)

	const [file, setFile] = useState('')

	const [prompt, setPrompt] = useState('')
	const [promptCode, setPromptCode] = useState(
		'Write a three.js function that takes scene as a callback. Creates a yellow sphere with a radius of 0.02 and adds it to the scene.'
	)
	const [generatingImg, setGeneratingImg] = useState(false)
	const [generatingCode, setGeneratingCode] = useState(false)

	const [activeEditorTab, setActiveEditorTab] = useState('')
	const [activeFilterTab, setActiveFilterTab] = useState({
		logoShirt: true,
		stylishShirt: false,
	})

	// const [input, setInput] = useState(snap.generatedCode)


	// show tab content depending on the activeTab
	const generateTabContent = () => {
		switch (activeEditorTab) {
			case 'colorpicker':
				return <ColorPicker />
			case 'filepicker':
				return <FilePicker file={file} setFile={setFile} readFile={readFile} />
			case 'aipicker':
				return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit} />
			case 'aigenerator':
				return <AIGenerator promptCode={promptCode} setPromptCode={setPromptCode} generatingCode={generatingCode} handleSubmit={handleSubmitCode} />
			default:
				return null
		}
	}

	const handleSubmit = async (type) => {
		if (!prompt) return alert('Please enter a prompt')

		try {
			setGeneratingImg(true)

			const response = await fetch('http://localhost:8080/api/v1/dalle', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt,
				}),
			})

			const data = await response.json()

			handleDecals(type, `data:image/png;base64,${data.photo}`)
		} catch (error) {
			alert(error)
		} finally {
			setGeneratingImg(false)
			setActiveEditorTab('')
		}
	}

	const handleSubmitCode = async (type) => {
		if (!promptCode) return alert('Please enter a prompt')

		try {
			setGeneratingCode(true)

			// v1/chat/completions

			const response = await fetch('http://localhost:8080/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					promptCode,
				}),
			})

			const data = await response.json()

			const codeBlocks = getTextBetweenTripleBackticks(data.code)

			// console.log('%ccodeBlocks', 'color:green;font-size:14px;', data.code)
			// console.log('%ccodeBlocks', 'color:green;font-size:14px;', typeof codeBlocks[0])
			// console.log('%ccodeBlocks', 'color:green;font-size:14px;', codeBlocks[0])
			console.log('%ccodeBlocks', 'color:red;font-size:16px;', codeBlocks[0] === undefined ? data.code : codeBlocks[0])
			// console.log('%ccodeBlocks TYPE', 'color:orange;font-size:12px;', codeBlocks[0] === undefined ? typeof data.code : typeof codeBlocks[0])
			
			state.generatedCode = codeBlocks[0] === undefined ? data.code : codeBlocks[0]
			state.isCodeGenerated = true

			// handleDecals(type, `data:image/png;base64,${data.photo}`)
		} catch (error) {
			alert(error)
		} finally {
			setGeneratingCode(false)
			setActiveEditorTab('')
		}
	}

	function getTextBetweenTripleBackticks(str) {
		const regex = /```([\s\S]*?)```/g
		const matches = str.match(regex)
		if (matches) {
			return matches.map((match) => match.replace(/```/g, '').trim())
		}
		return []
	}

	const handleDecals = (type, result) => {
		const decalType = DecalTypes[type]

		state[decalType.stateProperty] = result

		if (!activeFilterTab[decalType.filterTab]) {
			handleActiveFilterTab(decalType.filterTab)
		}
	}

	const handleActiveFilterTab = (tabName) => {
		switch (tabName) {
			case 'logoShirt':
				state.isLogoTexture = !activeFilterTab[tabName]
				break
			case 'stylishShirt':
				state.isFullTexture = !activeFilterTab[tabName]
				break
			default:
				state.isLogoTexture = true
				state.isFullTexture = false
				break
		}

		// after setting the state, activeFilterTab is updated

		setActiveFilterTab((prevState) => {
			return {
				...prevState,
				[tabName]: !prevState[tabName],
			}
		})
	}

	const readFile = (type) => {
		reader(file).then((result) => {
			handleDecals(type, result)
			setActiveEditorTab('')
		})
	}

	return (
		<AnimatePresence>
			{!snap.intro && (
				<>
					<motion.div key='custom' className='absolute top-0 left-0 z-10' {...slideAnimation('left')}>
						<div className='flex items-center min-h-screen'>
							<div className='editortabs-container tabs'>
								{EditorTabs.map((tab) => (
									<Tab key={tab.name} tab={tab} handleClick={() => setActiveEditorTab(tab.name)} />
								))}

								{generateTabContent()}
							</div>
						</div>
					</motion.div>

					<motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
						<CustomButton type='filled' title='Go Back' handleClick={() => (state.intro = true)} customStyles='w-fit px-4 py-2.5 font-bold text-sm' />
					</motion.div>

					<motion.div className='filtertabs-container' {...slideAnimation('up')}>
						{FilterTabs.map((tab) => (
							<Tab key={tab.name} tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]} handleClick={() => handleActiveFilterTab(tab.name)} />
						))}
					</motion.div>

					<div className='codeinput-container' >
						{/* <CodeInput
							placeholder='Input your code here...'
							onChange={snap.generatedCode}
							language={'javascript'}
							autoHeight={false}
							resize='both'
							value={snap.generatedCode}
						/> */}
					</div>
				</>
			)}
		</AnimatePresence>
	)
}

export default Customizer
