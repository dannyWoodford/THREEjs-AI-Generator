import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'

import state from '../store'
import { headContainerAnimation, headContentAnimation, headTextAnimation, slideAnimation } from '../config/motion'

const Home = () => {
	const snap = useSnapshot(state)

	return (
		<AnimatePresence>
			{snap.intro && (
				<motion.section className='home' {...slideAnimation('left')}>
					<motion.div className='home-content' {...headContainerAnimation}>
						<motion.div {...headTextAnimation}>
							<h1 className='head-text'>
								GIVE IT <br className='xl:block hidden' /> A TRY
							</h1>
						</motion.div>
						<motion.div {...headContentAnimation} className='flex flex-col gap-5 sub-text'>
							<p className='max-w-md font-normal text-gray-300 text-base'>
								Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong>Unleash your imagination</strong> and define your own
								style.
							</p>
						</motion.div>
					</motion.div>
				</motion.section>
			)}
		</AnimatePresence>
	)
}

export default Home
