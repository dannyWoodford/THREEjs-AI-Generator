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

	const [js, setJs] = useState(`
// Set up the scene
const scene = new THREE.Scene()
// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 25)
// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff)
renderer.shadowMap.enabled = true

// Add the renderer to the DOM
document.body.appendChild(renderer.domElement)

// Create the yellow sphere with arguments of [2, 32, 32]
const sphereGeometry = new THREE.SphereGeometry(2, 32, 32)

const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 })

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
scene.add(sphere)

// Create the blue floor with a height and width of 90
const floorGeometry = new THREE.PlaneGeometry(90, 90)

const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 10 })

const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.set(0, 0, 0)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Set up the bounce animation
const animate = () => {
	requestAnimationFrame(animate)
	if (sphere.position.y <= 2) {
		sphere.userData.velocity.y = Math.abs(sphere.userData.velocity.y) * 0.9
	} else {
		sphere.userData.velocity.y -= 0.1
	}
	sphere.position.y += sphere.userData.velocity.y
	renderer.render(scene, camera)
}

// Set the max height of the bounce to 5
sphere.userData = { velocity: new THREE.Vector3(0, 2, 0) }

// Start the animation
animate()

let light = new THREE.SpotLight(0xffa95c, 1)
light.position.set(-25, 30, 25)
light.castShadow = true
scene.add(light)

// Add OrbitControls
let controls = new THREE.OrbitControls(camera, renderer.domElement)
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}
	`)
// 	const [js, setJs] = useState(
// 		`
// // Set up the scene 
// const scene = new THREE.Scene(); 
// // Set up the camera 
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
// camera.position.set(0, 10, 25); 
// // Set up the renderer 
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0xffffff);
// renderer.shadowMap.enabled = true;

// // Add the renderer to the DOM 
// document.body.appendChild(renderer.domElement);

// // Create the yellow sphere with arguments of [2, 32, 32] 
// const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);

// const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 });

// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.castShadow = true;
// scene.add(sphere);

// // Create the blue floor with a height and width of 90 
// const floorGeometry = new THREE.PlaneGeometry(190, 90);

// const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 10 });

// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.position.set(0, 0, 0);
// floor.rotation.x = -Math.PI / 2
// floor.receiveShadow = true;
// scene.add(floor);

// // Set up the bounce animation 
// const animate = () => { requestAnimationFrame(animate);
// 	if (sphere.position.y <= 2) { sphere.userData.velocity.y = Math.abs(sphere.userData.velocity.y) * 0.9;
// } else { sphere.userData.velocity.y -= 0.1;
// } sphere.position.y += sphere.userData.velocity.y;
// renderer.render(scene, camera);
// };

// // Set the max height of the bounce to 5 
// sphere.userData = { velocity: new THREE.Vector3(0, 2, 0) };

// // Start the animation 
// animate();

// let light = new THREE.SpotLight(0xffa95c,1);
// light.position.set(-25,30,25);
// light.castShadow = true;
// scene.add( light ); 

// 	// Add OrbitControls
// let controls = new THREE.OrbitControls(camera, renderer.domElement); 
// 	window.addEventListener( 'resize', onWindowResize, false )

// function onWindowResize(){
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// }
// 	`)
	const [srcDoc, setSrcDoc] = useState('')

	
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
		'Write three.js code that creates a yellow sphere with arguments of [2, 32, 16]. The sphere should castShadow. Have the sphere bounce off a blue floor. The floor should have a height and width of 80. The max height of the bounce should be 5. The floor should receiveShadow. The floor should have a y position of 0. The floor should have a x rotation of -Math.PI / 2. All materials should be MeshPhongMaterial and have a shininess of 100. Do not add lights. Set the camera at a position of [0, 5, 10]. Make the background of the scene white. Enable shadows. Do not include import statements.'
		// 'Write three.js code that creates an earth with a radius of 5. A moon should orbit around the earth. the moon should have a radius of 1. Do not add lights. Set the camera at a position of [0, 0, 10]. Make the background of the scene black.'
	)
	const [generatingCode, setGeneratingCode] = useState(false)

	const handleSubmitCode = async () => {
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
		}
	}

	return (
		<main className='app transition-all ease-in'>
			<Home />
			<Split className='editor' sizes={[40, 60]} direction='horizontal'>
				<div className='pane top-pane'>
					<Split className='left-split' sizes={[80, 19]} direction='vertical'>
						<Editor language='javascript' displayName='THREE.js AI Generator' value={js} onChange={setJs} />
						<AIGenerator promptCode={promptCode} setPromptCode={setPromptCode} generatingCode={generatingCode} handleSubmit={handleSubmitCode} />
					</Split>
				</div>
				<div className='pane'>
					<iframe srcDoc={srcDoc} title='output' sandbox='allow-scripts' style={{ width: '102%', height: '103%', marginLeft: '-2%', marginTop: '-2%', border: 'none' }} />
				</div>
			</Split>
		</main>
	)
}

export default App
