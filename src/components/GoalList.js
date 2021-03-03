import React, { useState } from 'react'
import { firestore } from '../firebase/firebase.js'

import { Modal } from './Modal'

const goal = {
  count: 0,
  timestamp: null,
  start: null,
  end: null,
  type: 'fixed',
  repeat: null,
  active: false,
  completed: false    
}

export const GoalList = (props) => {  

  const { currentUser, currentProject, goals, goalRef } = props
  const [currentGoal,setCurrentGoal] = useState(goal) 
  const [edit,setEdit] = useState(false)  
    
  const handleInputChange = input => {
    setCurrentGoal({...currentGoal, count: parseInt(input)})
  }

  const addGoal = newGoal => {     
      // const wcRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/wordcount`)
      goalRef.add({
          count: newGoal.count,
          timestamp: firestore.Timestamp.now(),
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
      <Modal title='Add a New Goal'>
        <input type="number" name="count" value={currentGoal.count} onChange={(e) => handleInputChange(e.target.value)} />   
        <div className='button-row flex flex-row mt-4'>
                <button className="flex flex-col items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 mr-2 hover:text-spring-wood-800 hover:bg-white">
                  Add Progress
                </button>
                <button onClick={()=> setEdit(()=> !edit)} className="flex flex-col items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">
                  Cancel
                </button>
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