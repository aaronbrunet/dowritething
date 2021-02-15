import { React,useState } from 'react'
import './App.css';

//firebase
import firebase, { auth, firestore } from './firebase/firebase.js'

//hooks
import { useAuthState } from 'react-firebase-hooks/auth'

import { Title } from './components/Title'
import { AddWordCount } from './components/AddWordCount'
import { Projects } from './components/Projects'
import { WordCountList } from './components/WordCountList'
import { GoalList } from './components/GoalList'
import { EditForm } from './components/EditForm'

import { _formatTime as formatTime, _formatDate as formatDate, _interpretFields as interpretFields } from './utils/Utils.js'
import { projectModel } from './globals/Constants'

import { SignIn, SignOut } from './security/Security'

function App() {
  const [count,setCount] = useState(0)  
  const [lastUpdate,setLastUpdate] = useState('Never')
  const [currentProject,setCurrentProject] = useState(null)
  const [totalCount,setTotalCount] = useState(0)
  const [editing,setEditing] = useState(false)
  const [editType,setEditType] = useState('add')
  const [flag,setFlag] = useState('')
  const [user] = useAuthState(auth)
  const userRef = user ? firestore.collection('users').doc(auth.currentUser.uid) : null

  const dummyProject = {
    name: '',
    wordcount: 0,
    description: ''
  }

  const setEdit = (flag) => {
    //editType === 'edit' ? setEditType('') : setEditType('edit')
    setEditType('edit')
    setFlag(flag)
    setEditing(()=>!editing)    
  }
  const setAdd = (flag) => {
    setEditType('add')
    setFlag(flag)
    setEditing(()=>!editing)
   // editType === 'add' ? setEditType('') : setEditType('add')
  }
  const _setProject = (project) => {
    project && setCurrentProject(project)  
    project && setTotalCount(project.wordcount)  
    console.log('Set project')
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
    var formattedTime = formatTime(timestamp)
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
            timestamp: project.timestamp,
            name: project.name,
            description: project.description,
            owner: 'users/'+auth.currentUser.uid,
            revised: now
        }).then(function (docRef){
          docRef.get().then(function(doc){            
            var current = doc.data()             
            if(current.wordcount > 0) {
              const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${doc.id}/wordcount`)
              //const wcRef = doc.collection('wordcount')
              wcRef.add({
                  count: parseInt(current.wordcount),
                  timestamp: project.timestamp
              }).then(function(){
                  console.log('New count added!')
                  setCurrentProject(()=>current)
                }).catch(function(error) {
                  console.error('Error adding new count: '+error)
                })
            } else {
              setCurrentProject(()=>current)
            }
            setEditing(()=>!editing)
          })
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
          <div id='project-select' className='left'>
            
            <Projects 
              _setProject={_setProject} 
              _addProject={_addProject} 
              _userRef={userRef}
              dummyProject={dummyProject}
              edit={editing}
              _setAdd={setAdd}
              />                    
          </div>
          <div id='project-view' className='right'>
              {currentProject && !editing &&(<>
              <div className='left-inner'>
                <h1>{currentProject.name}</h1><button onClick={()=>setEdit('edit')}>Edit</button>
                <p className='description'>{currentProject.description}</p>
                <h3 className="count_h3">Word Count: { currentProject.wordcount }</h3>
                <h4>Last Updated: {currentProject.revised && formatTime(currentProject.revised)}</h4>          
                <AddWordCount currentUser={user} currentProject={currentProject} count={count} _setCount={_update} />          
              </div>            
              <div className='right-inner'>   
                <GoalList currentProject={currentProject}/>
                <WordCountList currentProject={currentProject}/>
              </div>
              </>)}
              { editing && <EditForm editType={editType} 
                                      input={currentProject} 
                                      model={projectModel}
                                      flag={flag} 
                                      project={dummyProject} 
                                      _addProject={_addProject}
                                      _setEditing={setEditing}
                                      editing={editing}
                                      />}
            
          </div> 
          </>
          :
            <h4>Welcome to Do (the) Write Thing</h4>
          }

        </div> 
    </div>
  );
}

export default App;
