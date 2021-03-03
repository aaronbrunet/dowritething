import React, { useState, useEffect } from 'react'
import firebase from '../firebase/firebase.js'
import DatePicker from 'react-datepicker'

import { Modal } from './Modal'

const today = new Date()

const dummyGoal = {
  count: 0,
  timestamp:  today,
  start: today,
  end: null,
  type: 'fixed',
  repeat: null,
  active: false,
  completed: false    
}

export const GoalList = (props) => {  

  const { currentUser, currentProject, goals, goalRef } = props
  const [currentGoal,setCurrentGoal] = useState()
  const [editGoal,setEditGoal] = useState(dummyGoal) 
  const [edit,setEdit] = useState(false)  
  const [minDate,setMinDate] = useState(0)
  const [minEndDate,setMinEndDate] = useState(new Date(today + 1))
  const [dailyGoal,setDailyGoal] = useState(0)

  

  useEffect(()=> {
    if(editGoal.start && editGoal.end && editGoal.count > 0){
      var length, count = 0
      editGoal.type === 'recurring' ? length = minDate : length = getLength(editGoal.start,editGoal.end)
      var count = getDailyCount(editGoal.count,length)
      setDailyGoal(()=>count)
    }    
  },[editGoal.start, editGoal.end, editGoal.count, editGoal.type, minDate])

  useEffect(()=>{
    if(editGoal.type === 'recurring'){
      handleRepeatChange('weekly')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[editGoal.type])

  useEffect(()=>{
    var startDate, endDate = today
    editGoal.start ? startDate = editGoal.start : startDate = (today - 1)
    editGoal.type === 'recurring' ? endDate = addDays(startDate, minDate) : endDate = addDays(startDate,1)
    setMinEndDate(()=>endDate)
  },[editGoal.type,editGoal.start,minDate])

  const addGoal = newGoal => {     
      // const wcRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/wordcount`)
      goalRef.add({
          count: newGoal.count,
          timestamp: firebase.firestore.Timestamp.now(),
          start: newGoal.start,
          end: newGoal.end,
          type: newGoal.type,
          repeat: newGoal.repeat,
          active: false,
          completed: false
      }).then(function(){
          console.log('New goal added!')          
        }).catch(function(error) {
          console.error('Error adding new count: '+error)
        })         
  } 

  const handleRepeatChange = (input) => {
    setEditGoal({...editGoal,repeat:input})
    switch(input) {
      case 'daily':
        setMinDate(()=>1) 
        break
      case 'weekly':
        setMinDate(()=>7)  
        break
      case 'monthly':
        setMinDate(()=>30)  
        break
      case 'yearly':
        setMinDate(()=>365)
        break
      default:
        setMinDate(()=>1)
    }
  } 

  const setEndDate = (date) => {
    setEditGoal({...editGoal,end: date})
  }

  const handleCancel = () => {
    setEdit(()=>!edit)
    setEditGoal(()=>dummyGoal)
  }

  const completeEdit = () => {
    addGoal(editGoal)
    setCurrentGoal(()=>editGoal)
    setEdit(()=>!edit)
    setEditGoal(()=>dummyGoal)
  }

  const addDays = (startDate, added) => {
    var date = new Date(startDate)
    date.setDate(date.getDate() + added)
    return date
  }

  const getLength = (startDate,endDate) => {
    var result = new Date(endDate) - new Date(startDate)
    result = Math.floor(Math.abs(result / (1000 * 60 * 60 * 24)))    
    return result
  }

  const getDailyCount = (totalCount,timespan) => {
    var result = Math.ceil(totalCount / timespan)
    return result
  }


  return (<>
    <div className="container bg-white w-auto shadow-md p-6 m-6">
      <div className="inline-flex font-medium text-xl m-2">Goals</div>
      {goals?.length<=3 && 
      (<button onClick={()=>setEdit(()=>!edit)} className="m-2 inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white transition duration-300 ease-in-out">
        Add Goal</button>)}
      {(!goals || (goals?.length === 0)) && (<p>No goal currently set.</p>)}
      {goals?.map(goal => <Goal key={goal.uid} goal={goal}/>)}      
    </div>  
    {edit &&  
      <Modal title='Add a New Goal' width='md'>
        <div className='mt-4 w-full '>
          <div className='inline-flex'>Starting on</div>
          <DatePicker 
            selected={editGoal.start}
            onChange={date => setEditGoal({...editGoal,start: date})}
            minDate={today}
            placeholderText='Set start date'
            dateFormat="MM/dd/yyyy"   
            className='inline-flex m-2' 
            mandatory
          />
        </div>
        <div className='flex flex-row'>I will write</div>
        <input type="number" name="count" onChange={(e) => setEditGoal({...editGoal, count: parseInt(e.target.value)})} placeholder='Add your wordcount goal' value={editGoal.count} className='w-auto max-w-1/2' />   
        <span className='inline-flex relative -ml-24 text-spring-wood-800'>words</span>       
        <div className='mt-4 mb-4 w-full'>
          <label htmlFor="goal-fixed" className='p-2'>
            <input type="radio" onChange={(e)=>setEditGoal({...editGoal, type: e.target.value})} name="goal-fixed" value='fixed' checked={editGoal.type==='fixed'}/>
          Total
          </label>
          <label htmlFor="goal-recurring" className='p-2'>
            <input type="radio" onChange={(e)=>setEditGoal({...editGoal, type: e.target.value})} name="goal-recurring" value='recurring' checked={editGoal.type==='recurring'} />
          Every...
          </label>
        </div>
        {editGoal.type==='recurring' && (
          <select  onChange={(e)=>handleRepeatChange(e.target.value)} value={editGoal.repeat} defaultValue='weekly' className="flex-col mr-4 justify-between w-48 px-2 py-2 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:border-spring-wood-600">
            <option value='daily'>Day</option>
            <option value='weekly'>Week</option>
            <option value='monthly'>Month</option>
            <option value='yearly'>Year</option>
          </select>
        )}
        <div className='mt-4 w-full '>
          <div className='inline-flex'>{editGoal.type==='fixed' ? 'By' : 'Until'}</div>
          <DatePicker 
            selected={editGoal.end}
            onChange={date => setEndDate(date)}
            minDate={minEndDate}
            placeholderText='Set end date'
            dateFormat="MM/dd/yyyy"   
            className='inline-flex m-2' 
          />
        </div>        
        {dailyGoal>0 && (
          <div>That's {dailyGoal} words a day!</div>
        )}
        <div className='button-row flex flex-row mt-4'>
          <button onClick={()=> completeEdit()} className='flex flex-col items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 mr-2 hover:text-spring-wood-800 hover:bg-white'>
          Add Goal</button>
          <button onClick={()=> handleCancel()} className="flex flex-col items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">
          Cancel</button>
        </div>
      </Modal>
    }
  </>)

  function Goal(props) {
    const {count,timestamp,type,repeat,start,end} = props.goal
    const date = timestamp.toDate().toLocaleDateString()
    const time = timestamp.toDate().toLocaleTimeString()
    const _start = start.toDate().toLocaleDateString()
    const _end = end.toDate().toLocaleDateString()
    return (<div className='m-2 goal-item prose'>  
    <h4 className='goal-count'>{count} words</h4>
    { type === 'fixed' && (<>
      <p className='goal-fixed'>By {_end} <br/> 
      Starting on {_start}</p> 
      <p className="text-xs text-gray-400">Added on {date} at {time}</p>
    </>)}
    { type === 'recurring' && (<>
      <p className='goal-repeat'>Per {repeat}</p>
      <p className='goal-repeat'>From {_start} to {_end}</p>
      <p className='goal-added'>Added on {date} at {time}</p>
    </>)}
    </div>)
  }
}