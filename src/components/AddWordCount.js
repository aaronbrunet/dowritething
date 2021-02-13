import React, { useState } from 'react'
import firebase, { firestore } from '../firebase.js'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";



export const AddWordCount = (props) => {
    const [newCount,setNewCount] = useState(0)
    const [startDate, setStartDate] = useState(new Date());

    const AddCount = newCount => {        
        //let result = parseInt(props.count) + parseInt(newCount)
        setNewCount(0)
        props._setCount(newCount)        
        //props._addList(newCount)       
        const wcRef = firestore.collection(`users/${props.currentUser.uid}/projects/${props.currentProject.id}/wordcount`)
        wcRef.add({
            count: parseInt(newCount),
            timestamp: firebase.firestore.Timestamp.now()
        }).then(function(){
            console.log('New count added!')
          }).catch(function(error) {
            console.error('Error adding new count: '+error)
          })
    }

    const handleInputChange = input => {
        setNewCount(parseInt(input))
    }

    const handleClick = () => {
        newCount !== 0 && AddCount(newCount)        
    }

    return (
        <>
        <input className="entry" type="number" name="count" placeholder="Add new wordcount" value={newCount} onChange={(e) => handleInputChange(e.target.value)} />
        {/* <input className="entry" type="date" name="date" placeholder="When was this written?"/> */}
        <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeInput     
            dateFormat="MM/dd/yyyy h:mm aa"   
            withPortal  
        />
        <button onClick={() => handleClick()}>Add Word Count+</button>
        </>
    )

}