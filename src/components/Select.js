import { React, useState } from'react'

export const Select = ( props ) => {
    const [selected,setSelected] = useState('default')
    const {name,options,placeholder,_onChange} = props

    const handleOnChange = (input) => {
        setSelected(input)
        let index = options.findIndex(option => { return option.id === input })
        _onChange(options[index])
        //console.log(options[index])
    }

    return (
        <>
        <select class="inline-flex mr-4 flex-row justify-between w-48 px-2 py-2 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-spring-wood-600" name={name} value={selected} onChange={(e)=>handleOnChange(e.target.value)}>
            <option class="w-48 py-2 my-2 bg-white rounded-lg shadow-xl" value='default' disabled>{placeholder}</option>
            {options && options.map(option=>
                <option key={option.id} value={option.id} class="-48 py-2 my-2 bg-white rounded-lg shadow-xl"
                >{option.name}</option>
            )}
        </select>
        </>
    )
}