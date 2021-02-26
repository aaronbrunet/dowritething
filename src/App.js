import { React,useState } from 'react'
//import './App.css';
import "tailwindcss/tailwind.css"

//firebase
import firebase, { auth, firestore } from './firebase/firebase.js'

//hooks
import { useAuthState } from 'react-firebase-hooks/auth'

import { Nav } from './components/Nav'
//import { Title } from './components/Title'
import { ProjectSelect } from './components/ProjectSelect'
import { Project } from './components/Project'
//import { WordCount } from './components/WordCount'
//import { GoalList } from './components/GoalList'
import { EditForm } from './components/EditForm'

//import { _formatTime as formatTime, _formatDate as formatDate, _interpretFields as interpretFields } from './utils/Utils.js'
import { projectModel } from './globals/Constants'

import { SignIn } from './security/Security'

function App() {
  const [currentProject,setCurrentProject] = useState(null)
  const [defaultSelection,setDefaultSelection] = useState(null)
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
    project && setCurrentProject(()=>project)  
    console.log('Set project')
    //console.log(`${nowDate} ${nowTime}`)
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
            revised: now,
            default: false
        }).then(function (docRef){
          docRef.get().then(function(doc){            
            var current = doc.data()     
            current.id=doc.id        
            if(current.wordcount > 0) {
              const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${doc.id}/wordcount`)
              //const wcRef = doc.collection('wordcount')
              wcRef.add({
                  count: parseInt(current.wordcount),
                  timestamp: project.timestamp
              }).then(function(){
                  console.log('New count added!')
                  setCurrentProject(()=>current)
                  setDefaultSelection(()=>current)
                }).catch(function(error) {
                  console.error('Error adding new count: '+error)
                })
            } else {             
              setCurrentProject(()=>current)
              setDefaultSelection(()=>current)
              
            }
            setEditing(()=>!editing)
          })
        }).catch(function(error) {
            console.error('Error adding new count: '+error)
        })        
        
  }

  return (
    <div className="App bg-spring-wood-400">     
      {user ? <>
        <Nav user={user} />     
        <div id="main" className="container px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <div id='project-select' className='left m-2'>            
              <ProjectSelect 
                _setProject={_setProject} 
                _addProject={_addProject} 
                _userRef={userRef}
                dummyProject={dummyProject}
                edit={editing}
                _setEdit={setEdit}
                _setAdd={setAdd}
                currentProject={currentProject}
                defaultSelection={defaultSelection}
                />                    
            </div>
            <div id='project-view' className=''>
              {!currentProject && 'Loading...'}
                {currentProject && !editing &&(<>
                <Project currentProject={currentProject} currentUser={user} setEdit={setEdit}/>                
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
          </div> 
          </>
          :
            <div className="p-40 container mx-auto block font-title text-center">
              <h1 className="text-spring-wood-900 font-bold text-4xl m-4">Do The Write Thing.</h1>
              <SignIn override="Get Started"/>
            </div>
          }        
    </div>
  );
}

export default App;
