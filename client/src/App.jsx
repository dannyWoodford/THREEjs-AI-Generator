import React, { useState, useEffect, useMemo } from 'react'
import { useSnapshot } from 'valtio'
import Split from 'react-split'

import { sanitizeResponse } from './config/helpers'
import { AIGenerator } from './components'

import state from './store'
import Home from './pages/Home'
import Editor from './components/Editor'

function App() {
	const snap = useSnapshot(state)

	const [js, setJs] = useState()
	const [srcDoc, setSrcDoc] = useState()
	
	useEffect(() => {
		if (!snap.intro) return;

		const timeout = setTimeout(() => {
			console.log('set initial')
			setSrcDoc(		`
	<!DOCTYPE html>
	<html>
		<head>
		<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/build/three.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/examples/js/controls/OrbitControls.min.js"></script>
			<script src="https://fariskassim.com/stage/rebel9/teaf/blob/v4/js/perlin.js"></script>
		</head>
		<script type="module">
			// create the renderer
			const renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			// default bg canvas color //
			renderer.setClearColor('#001c95');
			//  use device aspect ratio //
			renderer.setPixelRatio(window.devicePixelRatio);
			// set size of canvas within window //
			renderer.setSize(window.innerWidth, window.innerHeight);

			let scene = new THREE.Scene();
			let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
			camera.position.z = 0;
			
			let sphereGeometry = new THREE.SphereGeometry(1, 256, 128);
			let material = new THREE.MeshNormalMaterial();
			
			let sphere = new THREE.Mesh(sphereGeometry, material);
			scene.add(sphere);

			let update = function() {
					
				// change '0.0003' for more aggressive animation
				let time = performance.now() * 0.0003;
				
				//go through vertices here and reposition them
				
				// change 'k' value for more spikes
				let k = 6;
				
				for (let i = 0; i < sphere.geometry.vertices.length; i++) {
					let p = sphere.geometry.vertices[i];
					p.normalize().multiplyScalar(1 + 0.6 * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
				}
				sphere.geometry.computeVertexNormals();
				sphere.geometry.normalsNeedUpdate = true;
				sphere.geometry.verticesNeedUpdate = true;
			}
			
			function animate() {
				// sphere.rotation.y += 0.01;

				if (camera.position.z <= 1.05) {
					camera.position.z += 0.03;
				}

				update();
				
				/* render scene and camera */
				renderer.render(scene,camera);
				requestAnimationFrame(animate);
			}
			requestAnimationFrame(animate);

			function onWindowResize(){
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			document.querySelector('canvas').style.filter = "blur(28px)"
		</script>
	</html>
	`)
		}, 250)
		return () => clearTimeout(timeout)
	})

	useEffect(() => {
		const timeout = setTimeout(() => {
			setSrcDoc(`
				<!DOCTYPE html>
				<html>
					<head>
					<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/build/three.min.js"></script>
						<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/examples/js/controls/OrbitControls.min.js"></script>
						<script src="https://fariskassim.com/stage/rebel9/teaf/blob/v4/js/perlin.js"></script>
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
			snap.generatedCode +
				`
				let light = new THREE.SpotLight(0xffa95c,1);
				light.position.set(-25,30,25);
				light.castShadow = true;
				scene.add( light );
				
				// Add OrbitControls
				let controls = new THREE.OrbitControls(camera, renderer.domElement);
				
				window.addEventListener( 'resize', onWindowResize, false );
				function onWindowResize(){
					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();
					renderer.setSize( window.innerWidth, window.innerHeight );
				}
			`
		)
	}, [snap.isCodeGenerated])

	const [promptCode, setPromptCode] = useState(
		'Write three.js code that creates a yellow sphere with arguments of [2, 32, 16]. The sphere should castShadow. Have the sphere bounce off a blue floor. The floor should have a height and width of 110. The max height of the bounce should be 5. The floor should receiveShadow. The floor should have a y position of 0. The floor should have a x rotation of -Math.PI / 2. All materials should be MeshPhongMaterial and have a shininess of 100. Do not add lights. Set the camera at a position of [0, 5, 15]. Make the background of the scene light grey. Add a light fog. Enable shadows. Do not include import statements.'
		// 'Write three.js code that creates an earth with a radius of 5. A moon should orbit around the earth. the moon should have a radius of 1. Do not add lights. Set the camera at a position of [0, 0, 10]. Make the background of the scene black.
	)
	const [generatingCode, setGeneratingCode] = useState(false)

	const handleSubmitCode = async () => {
		if (!promptCode) return alert('Please enter a prompt')

		try {
			setGeneratingCode(true)

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
		}
	}

	return (
		<main className='app transition-all ease-in'>
			<Home />
			<Split className='editor' sizes={[40, 60]} direction='horizontal'>
				<div className='pane top-pane'>
					<Split className='left-split' sizes={[70, 29]} direction='vertical'>
						<Editor language='javascript' displayName='THREE.js AI Generator' value={js} onChange={setJs} />
						<AIGenerator promptCode={promptCode} setPromptCode={setPromptCode} generatingCode={generatingCode} handleSubmit={handleSubmitCode} />
					</Split>
				</div>
				<div className='pane'>
					<iframe srcDoc={srcDoc} title='output' sandbox='allow-scripts' style={{ width: '102%', height: '103%', marginTop: '-2%', border: 'none', userSelect: 'none' }} />
				</div>
			</Split>
		</main>
	)
}

export default App
