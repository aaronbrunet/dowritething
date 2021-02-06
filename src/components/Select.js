import { React, useState } from'react'

export const Select = ( props ) => {
    const [selected,setSelected] = useState('default')
    const {name,options,placeholder,_onChange} = props

    const handleOnChange = (input) => {
        setSelected(input)
        let index = options.findIndex(option => { return option.id === input })
        _onChange(options[index])
        console.log(options[index])
    }

    return (
        <>
        <select name={name} value={selected} onChange={(e)=>handleOnChange(e.target.value)}>
            <option value='default' disabled>{placeholder}</option>
            {options && options.map(option=>
                <option key={option.id} value={option.id}>{option.name}</option>
            )}
        </select>
        </>
    )
}