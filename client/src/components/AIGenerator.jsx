import CustomButton from './CustomButton'
import state from '../store'

const AIGenerator = ({ promptCode, setPromptCode, generatingCode, handleSubmit }) => {
	
	return (
		<div className='aigenerator-container'>
			<textarea placeholder='Ask AI...' rows={5} value={promptCode} onChange={(e) => setPromptCode(e.target.value)} className='aigenerator-textarea' />
			<div className='flex flex-wrap gap-3'>
				{generatingCode ? (
					<CustomButton type='outline' title='Asking AI...' customStyles='text-sm' />
				) : (
					<CustomButton
						type='filled'
						title='Prompt ChatGPT'
						handleClick={() => {
							state.intro = false
							handleSubmit()
						}}
						customStyles='text-sm'
					/>
				)}
			</div>
		</div>
	)
}

export default AIGenerator
