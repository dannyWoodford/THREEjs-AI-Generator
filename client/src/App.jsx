import React, { useState, useEffect, useMemo } from 'react'
// import { Canvas } from '@react-three/fiber'
import { useSnapshot } from 'valtio'
import Split from 'react-split'

import state from './store'
// import useLocalStorage from './config/useLocalStorage'
// import Scene from './canvas'
import Customizer from './pages/Customizer'
import Home from './pages/Home'
import Editor from './components/Editor'

function App() {
	const snap = useSnapshot(state)

	// const [js, setJs] = useLocalStorage('js', '')
	// const [html, setHtml] = useState(``)
	// 	<div id="editorApp">
	// 	<h1 id="editorApp-title">hfjkdshfkdh</h1>
	// 	<div id="editorApp-canvas"></div>
	// </div>
	// 	const [css, setCss] = useState(`
	// html {
	// 	height: 100%;
	// 	width: 100%;
	// 	background: red;
	// 	display: flex;
	// }
	// body {
	// 	height: 100%;
	// 	width: 100%;
	// 	background: blue;
	// 	display: flex;
	// 	margin: 0;
	// }
	// #editorApp {
	// 	height: 100%;
	// 	width: 100%;
	// 	background: green;
	// 	display: flex;
	// }
	// 	`)
	const [js, setJs] = useState('')
	const [srcDoc, setSrcDoc] = useState('')
	useEffect(() => {
		const timeout = setTimeout(() => {
			setSrcDoc(`
				<!DOCTYPE html>
				<html>
					<head>
						<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/build/three.min.js"></script>
						<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/examples/js/controls/OrbitControls.min.js"></script>
					</head>
					<script type="module">
						${js}
					</script>
				</html>
			`)
		}, 250)
		return () => clearTimeout(timeout)
	}, [js])

	useMemo(() => {
		if (!snap.isCodeGenerated) return

		setJs(
			snap.generatedCode 
			+
			` ` 
			+
			`let light = new THREE.SpotLight(0xffa95c,1);
			light.position.set(-25,30,25);
			light.castShadow = true;
			scene.add( light );` 
			+
			` // Add OrbitControls
			let controls = new THREE.OrbitControls(camera, renderer.domElement);` 
			+
			` window.addEventListener( 'resize', onWindowResize, false );

			function onWindowResize(){
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}`
		)
	}, [snap.isCodeGenerated])

	return (
		<main className='app transition-all ease-in'>
			<Home />
			{/* <Canvas
				shadows
				camera={{ position: [0, 0, 2], fov: 25 }}
				gl={{ preserveDrawingBuffer: true }}
				className='w-full max-w-full h-full transition-all ease-in'>
				<Suspense fallback={null}>
					<Scene />
				</Suspense>
			</Canvas> */}

			<Split className='editor' sizes={[40, 60]} direction='horizontal'>
				<div className='pane top-pane'>
					{/* <Editor language='xml' displayName='HTML' value={html} onChange={setHtml} /> */}
					{/* <Editor language='css' displayName='CSS' value={css} onChange={setCss} /> */}
					<Editor language='javascript' displayName='THREE.js AI Generator' value={js} onChange={setJs} />
				</div>
				<div className='pane'>
					<iframe srcDoc={srcDoc} title='output' sandbox='allow-scripts' 	width="100%" height="100%"></iframe>
				</div>
			</Split>

			<Customizer />
		</main>
	)
}

export default App
