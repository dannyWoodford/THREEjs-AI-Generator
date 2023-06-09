const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff)
renderer.shadowMap.enabled = true

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

let sphere_geometry = new THREE.SphereGeometry(1, 128, 128)
let material = new THREE.MeshNormalMaterial()

let sphere = new THREE.Mesh(sphere_geometry, material)
scene.add(sphere)

let update = function () {
	// change '0.003' for more aggressive animation
	let time = performance.now() * 0.003
	//console.log(time)

	//go through vertices here and reposition them

	// change 'k' value for more spikes
	let k = 3
	for (let i = 0; i < sphere.geometry.vertices.length; i++) {
		let p = sphere.geometry.vertices[i]
		p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k))
	}
	sphere.geometry.computeVertexNormals()
	sphere.geometry.normalsNeedUpdate = true
	sphere.geometry.verticesNeedUpdate = true
}

function animate() {
	//sphere.rotation.x += 0.01;
	//sphere.rotation.y += 0.01;

	update()
	/* render scene and camera */
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
