import { proxy } from 'valtio'

const state = proxy({
	intro: true,
	d3Generator: false,
	generatedCode: '',
})

export default state
