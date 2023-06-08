import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Environment, Center, OrbitControls } from '@react-three/drei'
import { useSnapshot } from 'valtio'

import Shirt from './Shirt'
// import Backdrop from './Backdrop'
import CameraRig from './CameraRig'

import state from '../store'

const CanvasModel = () => {
	const snap = useSnapshot(state)

	useEffect(() => {
		// console.log('snap.generatedCode', snap.generatedCode)
		// console.log('snap.generatedCode TYPE', typeof snap.generatedCode)
	}, [snap.generatedCode])

 const { scene } = useThree()

	const addGeneratedCode = useMemo(() => {
		if (!snap.isCodeGenerated) return

		console.log('scene', scene)
		console.log('snap.generatedCode', snap.generatedCode)

		function addYellowSphere(callback) {
			// Define the sphere's properties
			const geometry = new THREE.SphereGeometry(0.02, 32, 32)
			const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
			const sphere = new THREE.Mesh(geometry, material)

			// Add the sphere to the callback
			callback.add(sphere)
		} 

		return addYellowSphere(scene)
	}, [snap.isCodeGenerated, scene])

	return (
		<>
			<ambientLight intensity={1.5} />
			<Environment preset='city' />
			<OrbitControls />

			{/* <CameraRig> */}
			{/* <Backdrop /> */}
			<Center>
				{!snap.isCodeGenerated && <Shirt />}
				{snap.isCodeGenerated && (
					<group>
						<mesh>
							<sphereBufferGeometry args={[0.01, 32, 32]} />
							<meshStandardMaterial color='red' />
						</mesh>
						{/* <group name='Generated Code'>{snap.generatedCode}</group> */}
						{addGeneratedCode}
					</group>
				)}
			</Center>
			{/* </CameraRig> */}
		</>
	)
}

export default CanvasModel
