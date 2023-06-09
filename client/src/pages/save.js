// // Set up the scene
// const scene = new THREE.Scene()
// // Set up the camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// camera.position.set(0, 10, 25)
// // Set up the renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true })
// renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setClearColor(0xffffff)
// renderer.shadowMap.enabled = true

// // Add the renderer to the DOM
// document.body.appendChild(renderer.domElement)

// // Create the yellow sphere with arguments of [2, 32, 32]
// const sphereGeometry = new THREE.SphereGeometry(2, 32, 32)

// const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 })

// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
// sphere.castShadow = true
// scene.add(sphere)

// // Create the blue floor with a height and width of 90
// const floorGeometry = new THREE.PlaneGeometry(90, 90)

// const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 10 })

// const floor = new THREE.Mesh(floorGeometry, floorMaterial)
// floor.position.set(0, 0, 0)
// floor.rotation.x = -Math.PI / 2
// floor.receiveShadow = true
// scene.add(floor)

// // Set up the bounce animation
// const animate = () => {
// 	requestAnimationFrame(animate)
// 	if (sphere.position.y <= 2) {
// 		sphere.userData.velocity.y = Math.abs(sphere.userData.velocity.y) * 0.9
// 	} else {
// 		sphere.userData.velocity.y -= 0.1
// 	}
// 	sphere.position.y += sphere.userData.velocity.y
// 	renderer.render(scene, camera)
// }

// // Set the max height of the bounce to 5
// sphere.userData = { velocity: new THREE.Vector3(0, 2, 0) }

// // Start the animation
// animate()

// let light = new THREE.SpotLight(0xffa95c, 1)
// light.position.set(-25, 30, 25)
// light.castShadow = true
// scene.add(light)

// // Add OrbitControls
// let controls = new THREE.OrbitControls(camera, renderer.domElement)
// window.addEventListener('resize', onWindowResize, false)

// function onWindowResize() {
// 	camera.aspect = window.innerWidth / window.innerHeight
// 	camera.updateProjectionMatrix()
// 	renderer.setSize(window.innerWidth, window.innerHeight)
// }
