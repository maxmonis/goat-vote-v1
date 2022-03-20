import { ChangeEventHandler } from 'react'

interface InputProps {
  name?: string
  value?: string
  type?: string
  handleBlur?: ChangeEventHandler<HTMLInputElement>
  handleChange?: ChangeEventHandler<HTMLInputElement>
  label?: string
  error?: string
  persistentLabel?: boolean
}

export const Input = ({
  name,
  value,
  type,
  handleBlur,
  handleChange,
  label,
  error,
  persistentLabel,
}: InputProps) => (
  <div className='input-container'>
    <input
      name={name}
      id={label}
      required
      type={type || 'text'}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      pattern={type === 'number' ? '[0-9]*' : ''}
    />
    <label
      htmlFor={label}
      className={persistentLabel ? 'persistent-label' : 'floating-label'}>
      {label}
    </label>
    {error && <p className='input-error'>{error}</p>}
  </div>
)

interface SwitchProps {
  bool: boolean
  toggle: Function
  label1?: string
  label2?: string
}

export const Switch = ({ bool, toggle, label1, label2 }: SwitchProps) => (
  <div className='switch-container'>
    {label1 && <label>{label1}</label>}
    <label className='switch'>
      <input type='checkbox' checked={bool} onChange={() => toggle()} />
      <span className='slider'></span>
    </label>
    {label2 && <label>{label2}</label>}
  </div>
)
