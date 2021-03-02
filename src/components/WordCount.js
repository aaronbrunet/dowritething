import React, { useState } from 'react'
import firebase, { firestore } from '../firebase/firebase.js'
import DatePicker from 'react-datepicker'

import { Modal } from './Modal'
//import { _formatTime as formatTime } from '../utils/Utils.js'

export const WordCount = (props) => {  
    const { currentUser, currentProject } = props  
     const wcRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/wordcount`)
    // const query = wcRef.orderBy('timestamp','asc')//.limit(20)
    // const [wordcounts] = useCollectionData(query, {idField: 'id'})
    const wordcounts = props.wordcounts

    const [newCount,setNewCount] = useState(0)
    const [edit,toggleEdit] = useState(false)
    const [del,toggleDel] = useState(null)
    const [startDate, setStartDate] = useState(new Date());

    

    const addCount = newCount => {     
      // const wcRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/wordcount`)
      wcRef.add({
          count: parseInt(newCount),
          timestamp: startDate//firebase.firestore.Timestamp.now()
      }).then(function(){
          console.log('New count added!')
          updateProject(newCount)
          setNewCount(0)   
        }).catch(function(error) {
          console.error('Error adding new count: '+error)
        })
         
    }  

    const updateProject = newCount => {
      setNewCount(newCount)
      console.log(newCount)
      //if(newCount < 0){setNewCount(0)}
      let result = parseInt(currentProject.wordcount) + parseInt(newCount)
      //setTotalCount(result)
      console.log(result)
      var timestamp = firebase.firestore.Timestamp.now()      
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
      //setNewCount(()=>0)      
      
      if(newCount!==0){
        var count = newCount        
        toggleEdit(()=>!edit)
        count !== 0 && addCount(count) 
        setStartDate(()=>new Date()) 
      }
    }

    const handleCancel = () => {
        toggleEdit(()=>!edit)
        setNewCount(()=>0)
        setStartDate(new Date())
    }

    return (
      <div className="container bg-white w-auto shadow-md p-6 m-6 h-full">
        <div id='writing-history-top-bar' className='flex flex-row items-center mb-6'>
          <div className="flex-col font-medium text-xl m-2">Writing History</div>
          <button onClick={()=>toggleEdit(()=>!edit)} className="flex inline-flex h-3/4 justify-center align-middle items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white transition duration-300 ease-in-out">
            Add Progress
          </button>
        </div>
        {/* <AddWordCount /> */}
        {edit && 
            <Modal title='Update Your Progress'>              
              <input type="number" name="count" value={newCount} onChange={(e) => handleInputChange(e.target.value)} />   
              <span className='flex inline-flex relative -ml-24 text-spring-wood-800'>words</span>       
              <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeInput     
                  dateFormat="MM/dd/yyyy h:mm aa"   
                  withPortal 
                  className='flex flex-row mt-2' 
              />
              <div className='button-row flex flex-row mt-4'>
                <button onClick={() => handleClick()} className="flex flex-col items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 mr-2 hover:text-spring-wood-800 hover:bg-white">
                  Add Progress
                </button>
                <button onClick={()=> handleCancel()} className="flex flex-col items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">
                  Cancel
                </button>
              </div>
            </Modal> }
           <div className="h-3/4 overflow-y-auto">
          {wordcounts && wordcounts.map(wc => <WordCount idx={wc.id} wordcount={wc}/>)}
        </div>
      </div>
    )
    function RemoveCount (props) {
      const {idx,count} = props
      const delRef = wcRef.doc(idx)
      const deleteCount = () => {        
        delRef.delete().then(() => {
            console.log('deleted '+ idx)  
            //console.log('New count added!')
            var delCount = count * -1
            updateProject(delCount)
            setNewCount(0)   
          }).catch(function(error) {
            console.error('Error deleting count: '+error)
          })
      }

      return(<>
        <p className="flex flex-row">Are you sure?</p>
        <div className="flex flex-row">
        <button onClick={deleteCount} className="inline-flex items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 hover:text-spring-wood-800 hover:bg-white">Delete Progress</button>
        <button onClick={()=>toggleDel(false)} className="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">Cancel</button>
        </div>
      </>)

    }
    function WordCount(props) {
      const {count,timestamp} = props.wordcount
      const date = timestamp.toDate().toLocaleDateString()
      const time = timestamp.toDate().toLocaleTimeString()
      return (
      <div key={props.idx} className="container m-4 mx-auto p-4 shadow-lg rounded"> 
        {del === props.idx ?
        <RemoveCount idx={props.idx} count={count} />
        :<>
        <div className="flex flex-row w-full relative">
          <button onClick={() => toggleDel(()=>props.idx)} className="inline-flex absolute right-0 object-right">X</button>
        </div>
        <h3 className='flex flex-row wc-history-item-count'>{count} words</h3>
        <p className="flex flex-row text-xs text-gray-400">Written on {date} at {time}</p>
        </>}
      </div>)
    }
  }