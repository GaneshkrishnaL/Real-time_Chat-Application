import React, { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'

type TextFieldAdditionalProps = {
    label: string
    error: string
}

const TextField: FC<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
        TextFieldAdditionalProps
> = (props) => {
    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type ?? 'text'}
                name={props.name}
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
            {props.error && <small>{props.error}</small>}
        </div>
    )
}

export default TextField
