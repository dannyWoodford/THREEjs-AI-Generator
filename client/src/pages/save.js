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































// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(800, 200, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create sun
const sunGeometry = new THREE.SphereGeometry(50, 32, 32);
const sunMaterial = new THREE.MeshLambertMaterial({ emissive: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true;
sun.receiveShadow = true;
scene.add(sun);

// Create planets
const planetData = [
  { name: "Mercury", radius: 10, distance: 100, color: 0xd9d9d9 },
  { name: "Venus", radius: 15, distance: 150, color: 0xf4a460 },
  { name: "Earth", radius: 20, distance: 200, color: 0x0000ff },
  { name: "Mars", radius: 17, distance: 250, color: 0xff4500 },
  { name: "Jupiter", radius: 35, distance: 300, color: 0xffd700 },
  { name: "Saturn", radius: 30, distance: 350, color: 0xc2b280 },
  { name: "Uranus", radius: 25, distance: 400, color: 0x00ffff },
  { name: "Neptune", radius: 23, distance: 450, color: 0x00008b },
];

const planets = [];
const orbitLines = [];

for (let i = 0; i < planetData.length; i++) {
  const planet = planetData[i];
  const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
  const planetMaterial = new THREE.MeshLambertMaterial({ color: planet.color });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;
  scene.add(planetMesh);
  planets.push(planetMesh);

  const orbitLineGeometry = new THREE.CircleGeometry(planet.distance, 64);
  orbitLineGeometry.vertices.shift();
  const orbitLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const orbitLineMesh = new THREE.LineLoop(orbitLineGeometry, orbitLineMaterial);
  orbitLineMesh.rotation.x = -Math.PI / 2;
  scene.add(orbitLineMesh);
  orbitLines.push(orbitLineMesh);
}

// Animate function
function animate() {
  requestAnimationFrame(animate);
  stats.update();

  // Rotate planets and orbit lines
  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    const orbitLine = orbitLines[i];
    planet.position.setX(Math.cos(Date.now() * 0.001 * (i + 1) * 0.5) * planetData[i].distance);
    planet.position.setZ(Math.sin(Date.now() * 0.001 * (i + 1) * 0.5) * planetData[i].distance);
    orbitLine.position.setY(-0.1);
    orbitLine.rotation.z += 0.01;
  }

  // Render scene
  renderer.render(scene, camera);
}

animate();
// Add OrbitControls
let controls = new THREE.OrbitControls(camera, renderer.domElement);

let genSpotLight = new THREE.SpotLight(0xffa95c,1);
genSpotLight.position.set(-25,30,25);
genSpotLight.castShadow = true;
scene.add( genSpotLight );

let ambLight = new THREE.AmbientLight('white', 0.4)
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
document.querySelector('canvas').style.outline = "none"
