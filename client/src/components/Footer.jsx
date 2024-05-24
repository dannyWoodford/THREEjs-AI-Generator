import { useSnapshot } from 'valtio'

import { Logo } from './Logo'
import state from '../store'

export function Footer() {
	const snap = useSnapshot(state)

	return (
		<div className={`pmndrs-menu ${snap.intro ? '' : 'hide'}`}>
			<div>
				<Logo style={{ width: 42, height: 42 }} color={'#b0b0b0'} />
			</div>
			<div>
				<span>
					<b>
						<a target='_blank' rel='noopener noreferrer' href='https://dannywoodforddev.web.app/home'>
							Danny Woodford
						</a>
					</b>
				</span>
				<a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/danny-woodford-54b418126/'>
					LinkedIn
				</a>
				<a target='_blank' rel='noopener noreferrer' href='https://github.com/dannyWoodford'>
					Github
				</a>
			</div>
			<div>
				<span>
					<a target='_blank' rel='noopener noreferrer' href='https://github.com/dannyWoodford/THREEjs-AI-Generator/tree/main'>
						View Code
					</a>
				</span>
			</div>
		</div>
	)
}