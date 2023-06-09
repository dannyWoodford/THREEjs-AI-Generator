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
							<p className='max-w-lg font-normal text-gray-300 text-base'>
								Have OpenAI write basic THREE.js code and edit the result. <strong>Warning!!!</strong> Prompts should be relatively basic. Code quality varies
								but can be a useful head start. Try the example prompt...
							</p>
						</motion.div>
					</motion.div>
				</motion.section>
			)}
		</AnimatePresence>
	)
}

export default Home
