import { React,useState } from 'react'
import './App.css';

//firebase
import firebase, { auth, provider, firestore } from './firebase.js'

//hooks
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Title } from './components/Title'
import { AddWordCount } from './components/AddWordCount'

function App() {
  const [count,setCount] = useState(0)  
  const [lastUpdate,setLastUpdate] = useState('Never')
  const [currentProject,setCurrentProject] = useState(null)
  const [totalCount,setTotalCount] = useState(0)
  const [user] = useAuthState(auth)
  const userRef = user ? firestore.collection('users').doc(auth.currentUser.uid) : null

  const dummyProject = {
    name: 'Test Project',
    wordcount: 0,
    description: 'This is a dummy project. There is essentially no information provided.'
  }
  /*
  const profile = {
    //id
    //timestamp    
    //settings
  }

  const project = {
    //id
    //timestamp
    //title
    //new 
    //wordcount
    //genre
    //description
  }

  const goal = {
    //id
    //timestamp
    //name?
    //type
    //end date?
    //recurring freq?
    //count?
  }
  */

  const _setProject = (project) => {
    setCurrentProject(project)  
    setTotalCount(project.wordcount)  
    //console.log(`${nowDate} ${nowTime}`)
  }

  const _update = newCount => {
    setCount(newCount)
    console.log(newCount)
    if(count < 0){setCount(0)}
    let result = parseInt(currentProject.wordcount) + parseInt(newCount)
    setTotalCount(result)
    console.log(result)
    var timestamp = firebase.firestore.Timestamp.now()
    var nowDate = timestamp.toDate().toLocaleDateString()
    var nowTime = timestamp.toDate().toLocaleTimeString()
    var formattedTime = `${nowDate} ${nowTime}`
    setLastUpdate(()=>formattedTime)
    console.log(lastUpdate)
    firestore.collection(`users/${auth.currentUser.uid}/projects`).doc(currentProject.id).update({
      wordcount: result,
      revised: timestamp
    }).then(function(){
      console.log('Time and count updated!')
    }).catch(function(error) {
      console.error('Error writing to document: '+error)
    })
  }
  
  const _addProject = (project) => {
    const now = firebase.firestore.Timestamp.now()
    //Add new project
    //var userRef = firestore.collection('users').doc(auth.currentUser.uid)
    const projectRef = firestore.collection(`users/${auth.currentUser.uid}/projects`)
   //const projectRef = firestore.collection('projects')
       projectRef.add({
            wordcount: project.wordcount,
            created: now,
            name: project.name,
            description: project.description,
            owner: 'users/'+auth.currentUser.uid,
            revised: now
        }).then(function(){
            console.log('New count added!')
          }).catch(function(error) {
            console.error('Error adding new count: '+error)
          })
  }

  return (
    <div className="App">
      <header className="App-header">
      <div className='auth-panel'>{ user ? <><SignOut /> <p className='greeting'>Hi, {auth.currentUser.displayName}</p></>: <SignIn />}</div>
        <Title />
        
      </header> 
        <div id="main">
          {user ? <>
          <div className='left'>
            <Projects 
              _setProject={_setProject} 
              _addProject={_addProject} 
              _userRef={userRef}
              dummyProject={dummyProject}
              />                    
          </div>
          <div className='right'>
            {currentProject && currentProject.id &&(<>
            <div className='left-inner'>
              <h1>{currentProject.name}</h1>
              <p className='description'>{currentProject.description}</p>
              <h3 className="count_h3">Word Count: { totalCount }</h3>
              <h4>Last Updated: {lastUpdate}</h4>          
              <AddWordCount currentUser={user} currentProject={currentProject} count={count} _setCount={_update} />          
            </div>            
            <div className='right-inner'>   
              <GoalList currentProject={currentProject}/>
              <WordCountList currentProject={currentProject}/>
            </div>
            </>)}
          </div>
          </>
          :
            <h4>Welcome to Do (the) Write Thing</h4>
          }

        </div> 
    </div>
  );
}

//Auth
function SignIn() {
  const signInAuth = () => {      
      auth.signInWithPopup(provider)
  }  
  return (    
    <button onClick={signInAuth}>Sign in</button>
  )
}
function SignOut() {  
  return auth.currentUser && (<>
    <button onClick={() => auth.signOut()}>Sign out</button>
  </>)
}

//Projects
function Projects(props) {    
  //const projectRef = firestore.collection('projects')
  //const query = projectRef.where('owner','==',props._userRef)
  const projectRef = firestore.collection(`users/${auth.currentUser.uid}/projects`)
  //const query = projectRef.where('owner','==',props._userRef)
  const query = projectRef.orderBy('name')
  const [projects] = useCollectionData(query,{idField: 'id'})

  return (<>
    <h1>Projects</h1>
    <ul className='project-list'>
    {//projects && projects.map(project =><Project _setProject={props._setProject} key={project.uid} project={project}/>)
    }
    {projects && projects.map(project =><li key={project.uid} className='project-list-item' onClick={()=>props._setProject(project)}><h3>{project.name}</h3></li>)    }
    </ul>
    <button onClick={() => props._addProject(props.dummyProject)} className='project-button'>Add Project+</button>
  </>)
}

//Wordcount
function WordCountList(props) {  
  const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${props.currentProject.id}/wordcount`)
  const query = wcRef.orderBy('timestamp','asc').limit(20)
  const [wordcounts] = useCollectionData(query, {idField: 'id'})

  return (
    <>
    <h3 className="count-list_h3">Word Count History</h3>
    {wordcounts && wordcounts.map(wc => <WordCount key={wc.uid} wordcount={wc}/>)}
    </>
  )
  function WordCount(props) {
    const {count,timestamp} = props.wordcount
    const date = timestamp.toDate().toLocaleDateString()
    const time = timestamp.toDate().toLocaleTimeString()
    return (<div className='wc-history-item'>  
    <h3 className='wc-history-item-count'>Count: {count}</h3>
    <p className='wc-history-item-time'>Added on {date} at {time}</p>
    </div>)
  }
}

//Goals
function GoalList(props) {  
  const goalRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${props.currentProject.id}/goals`)
  const query = goalRef.where('active','==',true).limit(3)
  const [goals] = useCollectionData(query, {idField: 'id'})

  return (
    <div className='goal-panel'>
    <h3>Goals</h3>
    {goals && goals.length === 0 && (<p>No goal currently set.</p>)}
    {goals && goals.map(goal => <Goal key={goal.uid} goal={goal}/>)}
    <button>Add a Goal+</button>
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

export default App;
