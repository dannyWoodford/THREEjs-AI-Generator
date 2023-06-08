import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import Scene from './canvas'
import Customizer from './pages/Customizer'
import Home from './pages/Home'

function App() {
	return (
		<main className='app transition-all ease-in'>
			<Home />
			<Canvas
				shadows
				camera={{ position: [0, 0, 2], fov: 25 }}
				gl={{ preserveDrawingBuffer: true }}
				className='w-full max-w-full h-full transition-all ease-in'>
				<Suspense fallback={null}>
					<Scene />
				</Suspense>
			</Canvas>

			<Customizer />
		</main>
	)
}

export default App
