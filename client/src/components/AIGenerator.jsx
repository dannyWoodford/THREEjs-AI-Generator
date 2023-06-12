import React from 'react'
import { Checkbox, List, ListItem, ListItemPrefix, Typography } from '@material-tailwind/react'

import CustomButton from './CustomButton'
import state from '../store'

const AIGenerator = ({ promptCode, setPromptCode, generatingCode, handleSubmit, checkboxState, setCheckboxState }) => {
	const handleCheckboxChange = (stateValue) => {
		const attribute = stateValue

		setCheckboxState((prevState) => ({
			...prevState,
			[attribute]: !checkboxState[attribute],
		}))
	}

	return (
		<div className='aigenerator-container'>
			<textarea placeholder='Ask AI...' rows={5} value={promptCode} onChange={(e) => setPromptCode(e.target.value)} className='aigenerator-textarea' />
			<div className='flex flex-wrap gap-3'>
				{generatingCode ? (
					<CustomButton type='outline' title='Asking AI...' customStyles='text-sm' />
				) : (
					<CustomButton
						type='filled'
						title='Prompt OpenAI'
						handleClick={() => {
							state.intro = false
							handleSubmit()
						}}
						customStyles='text-sm'
					/>
				)}
			</div>
			<List>
				<ListItem className='p-0'>
					<label htmlFor='vertical-list-stats' className='px-3 flex items-center w-full cursor-pointer'>
						<ListItemPrefix className='mr-3'>
							<Checkbox
								id='vertical-list-stats'
								ripple={false}
								className='hover:before:opacity-0'
								containerProps={{
									className: 'p-0',
								}}
								checked={checkboxState.enableStats}
								onChange={() => handleCheckboxChange('enableStats')}
							/>
						</ListItemPrefix>
						<Typography color='blue-gray' className='font-medium'>
							Enable Stats Panel
						</Typography>
					</label>
				</ListItem>
				<ListItem className='p-0'>
					<label htmlFor='vertical-list-shadows' className='px-3 flex items-center w-full cursor-pointer'>
						<ListItemPrefix className='mr-3'>
							<Checkbox
								id='vertical-list-shadows'
								ripple={false}
								className='hover:before:opacity-0'
								containerProps={{
									className: 'p-0',
								}}
								checked={checkboxState.enableShadows}
								onChange={() => handleCheckboxChange('enableShadows')}
							/>
						</ListItemPrefix>
						<Typography color='blue-gray' className='font-medium'>
							Enable Shadows
						</Typography>
					</label>
				</ListItem>
				<ListItem className='p-0'>
					<label htmlFor='vertical-list-orbitControls' className='px-3 flex items-center w-full cursor-pointer'>
						<ListItemPrefix className='mr-3'>
							<Checkbox
								id='vertical-list-orbitControls'
								ripple={false}
								className='hover:before:opacity-0'
								containerProps={{
									className: 'p-0',
								}}
								checked={checkboxState.enableOrbitControls}
								onChange={() => handleCheckboxChange('enableOrbitControls')}
							/>
						</ListItemPrefix>
						<Typography color='blue-gray' className='font-medium'>
							Enable OrbitControls
						</Typography>
					</label>
				</ListItem>
			</List>
		</div>
	)
}

export default AIGenerator
