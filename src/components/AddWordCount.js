import React, { useState } from 'react'

export const AddWordCount = props => {
    const [newCount,setNewCount] = useState(0)

    const addCount = newCount => {        
        let result = parseInt(props.count) + parseInt(newCount)
        setNewCount(0)
        props._setCount(result)        
        props._addList(newCount) 
    }

    const handleInputChange = input => {
        setNewCount(parseInt(input))
    }

    const handleClick = () => {
        newCount !== 0 && addCount(newCount)        
    }

    return (
        <>
        <input className="entry" type="number" name="new_count" placeholder="Add new wordcount" value={newCount} onChange={(e) => handleInputChange(e.target.value)} />
        <button onClick={() => handleClick()}>Add Count</button>
        </>
    )

}