import React from 'react'

import CustomButton from './CustomButton'

const AIGenerator = ({ promptCode, setPromptCode, generatingCode, handleSubmit }) => {
	return (
		<div className='aigenerator-container'>
			<textarea placeholder='Ask AI...' rows={5} value={promptCode} onChange={(e) => setPromptCode(e.target.value)} className='aigenerator-textarea' />
			<div className='flex flex-wrap gap-3'>
				{generatingCode ? (
					<CustomButton type='outline' title='Asking AI...' customStyles='text-xs' />
				) : (
					<>
						{/* <CustomButton type='outline' title='AI Logo' handleClick={() => handleSubmit('logo')} customStyles='text-xs' /> */}

						<CustomButton type='filled' title='AI Full' handleClick={() => handleSubmit('full')} customStyles='text-xs' />
					</>
				)}
			</div>
		</div>
	)
}

export default AIGenerator
