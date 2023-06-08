import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader, sanitizeResponse } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, AIGenerator, ColorPicker, CustomButton, FilePicker, Tab } from '../components'

const Customizer = () => {
	const snap = useSnapshot(state)

	const [file, setFile] = useState('')

	const [prompt, setPrompt] = useState('')
	const [promptCode, setPromptCode] = useState(
		'Write three.js code that creates a yellow sphere with arguments of [2, 32, 32]. The sphere should castShadow. Have the sphere bounce off a blue floor. The floor should have a height and width of 60. The max height of the bounce should be 5. The floor should receiveShadow. All materials should be MeshPhongMaterial and have a shininess of 100. Do not add lights. Set the camera at a position of [0, 5, 10]. Make the background of the scene white. Enable shadows.'
		// 'Write three.js code that creates an earth with a radius of 5. A moon should orbit around the earth. the moon should have a radius of 1. Do not add lights. Set the camera at a position of [0, 0, 10]. Make the background of the scene black.'
	)
	const [generatingImg, setGeneratingImg] = useState(false)
	const [generatingCode, setGeneratingCode] = useState(false)

	const [activeEditorTab, setActiveEditorTab] = useState('')
	const [activeFilterTab, setActiveFilterTab] = useState({
		logoShirt: true,
		stylishShirt: false,
	})

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

			console.log('%csanitizeResponse', 'color:yellow;font-size:16px;', sanitizeResponse(data.code))

			state.generatedCode = sanitizeResponse(data.code)
			state.isCodeGenerated = true
		} catch (error) {
			alert(error)
		} finally {
			setGeneratingCode(false)
			setActiveEditorTab('')
		}
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
				</>
			)}
		</AnimatePresence>
	)
}

export default Customizer
