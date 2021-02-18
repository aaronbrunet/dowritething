import { auth, firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export const GoalList = (props) => {  
    const goalRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${props.currentProject.id}/goals`)
    const query = goalRef.where('active','==',true).limit(3)
    const [goals] = useCollectionData(query, {idField: 'id'})
  
    return (
      <div class="container shadow-md p-6 m-6">
      <h3>Goals</h3>
      {(!goals || (goals && goals.length === 0)) && (<p>No goal currently set.</p>)}
      {goals && goals.map(goal => <Goal key={goal.uid} goal={goal}/>)}
      <button class="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">Add a Goal+</button>
      </div>    
    )
    function Goal(props) {
      const {count,timestamp,type,repeat,start,end} = props.goal
      const date = timestamp.toDate().toLocaleDateString()
      const time = timestamp.toDate().toLocaleTimeString()
      const _start = start.toDate().toLocaleDateString()
      const _end = end.toDate().toLocaleDateString()
      return (<div className='goal-item'>  
      <h3 className='goal-count'>Goal: {count} words</h3>
      { type === 'fixed' && (<>
        <p className='goal-fixed'>By {_end}</p>
        <p className='goal-fixed'>Starting on {_start}</p>
        <p className='goal-added'>Added on {date} at {time}</p>
      </>)}
      { type === 'recurring' && (<>
        <p className='goal-repeat'>Per {repeat}</p>
        <p className='goal-repeat'>From {_start} to {_end}</p>
        <p className='goal-added'>Added on {date} at {time}</p>
      </>)}
      </div>)
    }
  }