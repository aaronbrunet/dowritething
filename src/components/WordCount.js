import React, { useState } from 'react'
import firebase, { auth, firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

//import { _formatTime as formatTime } from '../utils/Utils.js'

export const WordCount = (props) => {  
    const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${props.currentProject.id}/wordcount`)
    const query = wcRef.orderBy('timestamp','asc').limit(20)
    const [wordcounts] = useCollectionData(query, {idField: 'id'})

    const { currentUser, currentProject } = props
  
    return (
      <div className="container shadow-md p-6 m-6 h-full">
      <div className="font-medium text-xl m-2 inline-flex">Writing History</div>
      <AddWordCount />
      <div className="h-3/4 overflow-y-auto">
        {wordcounts && wordcounts.map(wc => <WordCount idx={wc.id} wordcount={wc}/>)}
        </div>
      </div>
    )
    function WordCount(props) {
      const {count,timestamp} = props.wordcount
      const date = timestamp.toDate().toLocaleDateString()
      const time = timestamp.toDate().toLocaleTimeString()
      return (
      <div key={props.idx} className="container m-4 mx-auto p-4 shadow-lg rounded">  
        <h3 className='wc-history-item-count'>{count} words</h3>
        <p className="text-xs text-gray-400">Written on {date} at {time}</p>
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
        //var formattedTime = formatTime(timestamp)
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
             <div className="inline-flex">
            <input className="entry" type="number" name="count" placeholder="Add new wordcount" value={newCount} onChange={(e) => handleInputChange(e.target.value)} />          
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeInput     
                dateFormat="MM/dd/yyyy h:mm aa"   
                withPortal  
            />
            <button className="inline-flex items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 hover:text-spring-wood-800 hover:bg-white" onClick={() => handleClick()}>Add+</button>
            <button className="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white" onClick={()=>toggleEdit(()=>!edit)}>Cancel</button>
          </div> :
          <> 
          <button className="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white transition duration-300 ease-in-out" onClick={()=>toggleEdit(()=>!edit)}>Update Wordcount+</button>
          </>)
      }
  }