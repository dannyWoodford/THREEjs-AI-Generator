import { proxy } from 'valtio'

const state = proxy({
	intro: true,
	color: 'orange',
	isCodeGenerated: false,
	isLogoTexture: true,
	isFullTexture: false,
	logoDecal: './threejs.png',
	fullDecal: './threejs.png',
	generatedCode: '',
})

export default state
