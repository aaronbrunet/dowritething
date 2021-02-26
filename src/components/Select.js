import { React, useState, useEffect } from'react'

export const Select = ( props ) => {    
    const {name,options,placeholder,_onChange,selection} = props
    const [selected,setSelected] = useState(selection)

    const handleOnChange = (input) => {
        setSelected(input)
        let index = options.findIndex(option => { return option.id === input })
        _onChange(options[index])
    }    

    useEffect(()=>{
        if(selection === 'default') {
            setSelected('default')
        }
        else if(selection && selection !==  'default'){            
            let index = options.findIndex(option => { return option.id === selection.id })
            _onChange(options[index])
            setSelected(()=>selection.id)
        }
    },[selection])
    
    return (
        <>
        <select className="flex-col mr-4 justify-between w-48 px-2 py-2 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:border-spring-wood-600" name={name} defaultValue={selected} value={selected} onChange={(e)=>handleOnChange(e.target.value)}>            
            <option key='0' className="w-48 py-2 my-2 bg-white rounded-lg shadow-xl" value='default' disabled>{placeholder}</option>
            {options && options.map(option=>
                <option key={option.id} value={option.id} className="-48 py-2 my-2 bg-white rounded-lg shadow-xl"
                >{option.name}</option>
            )}            
        </select>
        </>
    )
}