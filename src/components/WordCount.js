import React, { useState } from 'react'
import firebase, { auth, firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import { _formatTime as formatTime, _formatDate as formatDate, _interpretFields as interpretFields } from '../utils/Utils.js'

export const WordCount = (props) => {  
    const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${props.currentProject.id}/wordcount`)
    const query = wcRef.orderBy('timestamp','asc').limit(20)
    const [wordcounts] = useCollectionData(query, {idField: 'id'})

    const { currentUser, currentProject } = props
  
    return (
      <div>
      <h3 className="count-list_h3">Word Count History</h3>
      <AddWordCount />
      <div className='count-list-container'>
        {wordcounts && wordcounts.map(wc => <WordCount key={wc.uid} wordcount={wc}/>)}
        </div>
      </div>
    )
    function WordCount(props) {
      const {count,timestamp} = props.wordcount
      const date = timestamp.toDate().toLocaleDateString()
      const time = timestamp.toDate().toLocaleTimeString()
      return (<div key={props.key} className='wc-history-item'>  
      <h3 className='wc-history-item-count'>Count: {count}</h3>
      <p className='wc-history-item-time'>Added on {date} at {time}</p>
      </div>)
    }

    function AddWordCount(props) {
      const [newCount,setNewCount] = useState(0)
      const [edit,toggleEdit] = useState(false)
      const [startDate, setStartDate] = useState(new Date());

      const AddCount = newCount => {        
        //let result = parseInt(props.count) + parseInt(newCount)
        //setNewCount(0)
        updateProject(newCount)
        //props._setCount(newCount)        
        //props._addList(newCount)       
        const wcRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/wordcount`)
        wcRef.add({
            count: parseInt(newCount),
            timestamp: startDate//firebase.firestore.Timestamp.now()
        }).then(function(){
            console.log('New count added!')
          }).catch(function(error) {
            console.error('Error adding new count: '+error)
          })
      }

      const updateProject = newCount => {
        setNewCount(newCount)
        console.log(newCount)
        if(newCount < 0){setNewCount(0)}
        let result = parseInt(currentProject.data().wordcount) + parseInt(newCount)
        //setTotalCount(result)
        console.log(result)
        var timestamp = firebase.firestore.Timestamp.now()
        var formattedTime = formatTime(timestamp)
        //setLastUpdate(()=>formattedTime)
        //console.log(lastUpdate)
        firestore.collection(`users/${currentUser.uid}/projects`).doc(currentProject.id).update({
          wordcount: result,
          revised: timestamp
        }).then(function(){
          console.log('Time and count updated!')
        }).catch(function(error) {
          console.error('Error writing to document: '+error)
        })
      }

      const handleInputChange = input => {
          setNewCount(parseInt(input))
      }

      const handleClick = () => {
          newCount !== 0 && AddCount(newCount) 
          setStartDate(()=>new Date())       
      }

      return (edit ? 
             <>
            <input className="entry" type="number" name="count" placeholder="Add new wordcount" value={newCount} onChange={(e) => handleInputChange(e.target.value)} />          
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeInput     
                dateFormat="MM/dd/yyyy h:mm aa"   
                withPortal  
            />
            <button onClick={() => handleClick()}>Add+</button><button onClick={()=>toggleEdit(()=>!edit)}>Cancel</button>
          </> :
          <> 
          <button onClick={()=>toggleEdit(()=>!edit)}>Add Word Count+</button>
          </>)
      }
  }