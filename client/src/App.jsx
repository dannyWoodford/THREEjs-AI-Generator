import React, { useState, useEffect, useMemo } from 'react'
import { useSnapshot } from 'valtio'
import Split from 'react-split'

import { sanitizeResponse } from './config/helpers'
import { AIGenerator } from './components'

import state from './store'
import Home from './pages/Home'
import Editor from './components/Editor'
import { Footer } from './components/Footer'

function App() {
	const snap = useSnapshot(state)

	const [js, setJs] = useState()
	const [srcDoc, setSrcDoc] = useState()

	const [promptCode, setPromptCode] = useState(
		'Create the solar system with the 8 planets and a sun. The planets should orbit the sun and have white orbit lines to show their path. The orbit lines should be made with LineLoop and have a "x" rotation of "-Math.PI / 2". PLanets and sun materials should be MeshLambertMaterial. Orbit lines materials should be MeshBasicMaterial. Planets should have color closest to the real planets. The sun would have a yellow emissive. PerspectiveCamera should have a far of 5000, a "y" position of 200, and a "x" position of 800.'
	)
	const [generatingCode, setGeneratingCode] = useState(false)
	const [isCodeGenerated, setIsCodeGenerated] = useState(false)

	useEffect(() => {
		// console.log('Switch Generator', snap.d3Generator)

		// Reset promptCode and animated intro text when switching generators

		if (snap.d3Generator) {
			setPromptCode('Create an interactive sunburst visualization with random data.')
		} else {
			setPromptCode(
				'Create the solar system with the 8 planets and a sun. The planets should orbit the sun and have white orbit lines to show their path. The orbit lines should be made with LineLoop and have a "x" rotation of "-Math.PI / 2". PLanets and sun materials should be MeshLambertMaterial. Orbit lines materials should be MeshBasicMaterial. Planets should have color closest to the real planets. The sun would have a yellow emissive. PerspectiveCamera should have a far of 5000, a "y" position of 200, and a "x" position of 800.'
			)
		}

		state.intro = true
	}, [snap.d3Generator])

	useEffect(() => {
		// console.log('Reset while waiting for generated code', generatingCode)
		// Reset when asking for a new prompt or switching generators

		// generatingCode is needed as a dependency to reset screen when asking for a new prompt
		// snap.d3Generator is needed as a dependency to reset screen when switching generators

		setJs('')
		setIsCodeGenerated(false)

		const timeout = setTimeout(() => {
			setSrcDoc(
				`
				<!DOCTYPE html>
				<html>

				<head>
					<script src="https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.min.js"></script>
					<script src="https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.min.js"></script>
				</head>
				<script type="module">
					// Three.js setup
					const renderer = new THREE.WebGLRenderer({ antialias: true });

					renderer.setSize(window.innerWidth, window.innerHeight);
					document.body.appendChild(renderer.domElement);

					renderer.setClearColor('#001c95');
					renderer.setPixelRatio(window.devicePixelRatio);
					renderer.setSize(window.innerWidth, window.innerHeight);

					const scene = new THREE.Scene();
					const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
					camera.position.z = 0;

					const sphereGeometry = new THREE.SphereGeometry(1, 256, 128);
					const material = new THREE.MeshNormalMaterial();
					const sphere = new THREE.Mesh(sphereGeometry, material);
					scene.add(sphere);

					const simplex = new SimplexNoise();
					let mouse = { x: 0, y: 0 };

					const handleMouseMove = (event) => {
						mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
					};

					window.addEventListener('mousemove', handleMouseMove);

					const update = function() {
						const time = performance.now() * 0.0003;
						const k = 4;

						for (let i = 0; i < sphere.geometry.attributes.position.count; i++) {
							const vertex = new THREE.Vector3(
								sphere.geometry.attributes.position.getX(i),
								sphere.geometry.attributes.position.getY(i),
								sphere.geometry.attributes.position.getZ(i)
							);

							const noiseValue = simplex.noise3D(
								vertex.x * k + time + mouse.x * 0.5,
								vertex.y * k + mouse.y * 0.5,
								vertex.z * k
							);

							vertex.normalize().multiplyScalar(1 + 0.04 * noiseValue);

							sphere.geometry.attributes.position.setXYZ(i, vertex.x, vertex.y, vertex.z);
						}
						sphere.geometry.computeVertexNormals();
						sphere.geometry.attributes.position.needsUpdate = true;
					};

					function animate() {
						if (camera.position.z <= 3.05) {
							camera.position.z += 0.05;
						}

						update();
						renderer.render(scene, camera);
						requestAnimationFrame(animate);
					}
					requestAnimationFrame(animate);

					window.addEventListener('resize', () => {
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
						renderer.setSize(window.innerWidth, window.innerHeight);
					});

					document.querySelector('body').style.margin = "0"
					document.querySelector('body').style.overflow = "hidden"
					document.querySelector('canvas').style.filter = "blur(14px)"
					document.querySelector('canvas').style.outline = "none"
				</script>

				</html>
				`
			)
		}, 250)
		return () => clearTimeout(timeout)
	}, [generatingCode, snap.d3Generator])

	useMemo(() => {
		if (!js) return

		// console.log('%cSWAP Canvas', 'color:red;font-size:14px;', isCodeGenerated)

		if (snap.d3Generator) {
			const timeout = setTimeout(() => {
				setSrcDoc(
					`<!DOCTYPE html>
					<html>
						<head>
							<script src="https://cdn.jsdelivr.net/npm/d3@7.1.1/dist/d3.min.js"></script>
							<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/build/three.min.js"></script>
							<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/examples/js/controls/OrbitControls.min.js"></script>
							<script src="//mrdoob.github.io/stats.js/build/stats.min.js" crossorigin="anonymous"></script>

							<style>
								html, body {
									height: 100%;
									width: 100%;
									margin: auto;
									overflow: hidden;
									display: flex;
									justify-content: center;
									align-items: center;
								}
							
								body {
									height: 100%;
									width: 100%;
									margin: auto;
									overflow: hidden;
									display: flex;
									justify-content: center;
									align-items: center;
								}

								#chart-container {
									display: block;
									height: 90%;
									width: 90%;
								}
							</style>
						</head>
						<body>
							<div id="chart-container"></div>

							<script type="module">
								${js}
							</script>
						</body>
					</html>
					`
				)
			}, 250)
			return () => clearTimeout(timeout)
		} else {
			const timeout = setTimeout(() => {
				setSrcDoc(
					`<!DOCTYPE html>
				<html>
					<head>
						<script src="https://cdn.jsdelivr.net/npm/d3@7.1.1/dist/d3.min.js"></script>
						<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/build/three.min.js"></script>
						<script src="https://cdn.jsdelivr.net/npm/three@0.122.0/examples/js/controls/OrbitControls.min.js"></script>
						<script src="//mrdoob.github.io/stats.js/build/stats.min.js" crossorigin="anonymous"></script>
					</head>
					<script type="module">
						${js}
					</script>
				</html>
				`
				)
			}, 250)
			return () => clearTimeout(timeout)
		}
	}, [js, snap.d3Generator, isCodeGenerated])

	useEffect(() => {
		if (!isCodeGenerated) return
		// console.log('isCodeGenerated', isCodeGenerated)

		// Needed to add default code to returned generated code

		if (snap.d3Generator) {
			setJs(
				snap.generatedCode
			)
		} else {
			setJs(
				snap.generatedCode
				+
				`
				// Add OrbitControls
				let controls = new THREE.OrbitControls(camera, renderer.domElement);

				let genSpotLight = new THREE.SpotLight(0xffa95c,1);
				genSpotLight.position.set(0,350,0);
				genSpotLight.castShadow = true;
				scene.add( genSpotLight );

				let ambLight = new THREE.AmbientLight('white', 0.1)
				scene.add(ambLight)

				// Handle Resize
				window.addEventListener( 'resize', onWindowResize, false );

				function onWindowResize(){
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				}

				// Fix CSS of generated iFrame
				document.querySelector('body').style.margin = "0"
				document.querySelector('body').style.overflow = "hidden"
				document.querySelector('canvas').style.outline = "none"
				`
			)
		}
	}, [isCodeGenerated, snap.d3Generator])

	const handleSubmitCode = async () => {
		if (!promptCode) return alert('Please enter a prompt')

		try {
			setGeneratingCode(true)
			setIsCodeGenerated(false)

			let input;

			if (snap.d3Generator) {
				input = `Write d3.js code. The 'id' of the div you should append it to is called 'chart-container'. The svg should be the height and width of 'chart-container'. Just return the javascript. ` +
					promptCode + ` Do not include import statements. Do not use libraries other then d3.js.`
			} else {
				input =
					`Write three.js code. ` +
					promptCode +
					` Add stats. Do not add OrbitControls. The renderer should have antialias set to true. Do not include code to handle resize. Do not include import statements. Do not use libraries other then three.js. Just return the javascript. `
			}

			// console.log('%cPROMPT + toggled code', 'color:green;font-size:22px;', input)

			// testing URL: 'http://localhost:8080/v1/chat/completions'
			const response = await fetch('https://threejs-ai-generator.onrender.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					input,
				}),
			})

			const data = await response.json()

			// console.log('%csanitizeResponse', 'color:yellow;font-size:16px;', sanitizeResponse(data.code))

			state.generatedCode = sanitizeResponse(data.code)
		} catch (error) {
			console.log('%cError', 'color:red;font-size:16px;')
			alert(error)
		} finally {
			// console.log('%cFinally -- reset', 'color:yellow;font-size:16px;')
			setGeneratingCode(false)
			setIsCodeGenerated(true)
		}
	}

	return (
		<main className='app transition-all ease-in'>
			<Home generatingCode={generatingCode} />
			<Split className='editor' sizes={[35, 65]} direction='horizontal'>
				<div className='pane top-pane'>
					<Split className='left-split' sizes={[70, 29]} direction='vertical'>
						<Editor language='javascript' value={js} onChange={setJs} />
						<AIGenerator promptCode={promptCode} setPromptCode={setPromptCode} generatingCode={generatingCode} handleSubmit={handleSubmitCode} />
					</Split>
				</div>
				<div className='pane'>
					<iframe
						srcDoc={srcDoc}
						title='output'
						sandbox='allow-scripts'
						style={{ width: '100%', height: '100%', border: 'none', userSelect: 'none', position: 'relative', zIndex: '0' }}
					/>
					<Footer />
				</div>
			</Split>
		</main>
	)
}

export default App
