import { proxy } from 'valtio'

const state = proxy({
	intro: true,
	color: 'orange',
	d3Generator: false,
	generatedCode: '',
})

export default state
