import React, { useState } from 'react'

export const AddWordCount = props => {
    const [count,setCount] = useState(props.count)
    const [newCount,setNewCount] = useState(0)

    const addCount = newCount => {
        let result = parseInt(count) + parseInt(newCount)
        setNewCount(0)
        props._setCount(result)
        setCount(result)
        props._addList(newCount)  
    }

    const handleInputChange = (input) => {
        let value = input    
        setNewCount(value)
    }

    const handleClick = () => {
        addCount(newCount)        
    }

    return (
        <>
        <input className="entry" type="number" name="new count" placeholder="Add new wordcount" value={newCount} onChange={(e) => handleInputChange(e.target.value)} />
        <button onClick={() => handleClick()}>Add Count</button>
        </>
    )

}