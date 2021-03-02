import { React,useState } from 'react'
import "tailwindcss/tailwind.css"

//firebase
import firebase, { auth, firestore } from './firebase/firebase.js'

//hooks
import { useAuthState } from 'react-firebase-hooks/auth'

import { Nav } from './components/Nav'
import { ProjectSelect } from './components/ProjectSelect'
import { Project } from './components/Project'
import { EditForm } from './components/EditForm'
import { Modal } from './components/Modal'

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
  //const userRef = user ? firestore.collection('users').doc(auth.currentUser.uid) : null

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
                currentUser={user}                
                currentProject={currentProject}
                defaultSelection={defaultSelection}
                _setProject={_setProject} 
                _setEdit={setEdit}
                _setAdd={setAdd}
                />                    
            </div>
            <div id='project-view' className=''>
              {!currentProject && 'Loading...'}
                {currentProject &&(<>
                <Project 
                  currentProject={currentProject} 
                  currentUser={user} 
                  />                
                </>)}
                { editing && 
                <Modal title='Manage Projects'>
                    <EditForm editType={editType} 
                      input={currentProject}
                      model={projectModel}                                        
                      flag={flag}                       
                      project={dummyProject}                       
                      _addProject={_addProject}                      
                      _setEditing={setEditing}                      
                      editing={editing} />
                </Modal>
                }
              
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


// /* CSV */
// 7e6551,938581,466362,8896ab,c5d5e4

// /* Array */
// ["7e6551","938581","466362","8896ab","c5d5e4"]

// /* Object */
// {"Raw Umber":"7e6551","Cinereous":"938581","Deep Space Sparkle":"466362","Cool Grey":"8896ab","Beau Blue":"c5d5e4"}

// /* Extended Array */
// [{"name":"Raw Umber","hex":"7e6551","rgb":[126,101,81],"cmyk":[0,20,36,51],"hsb":[27,36,49],"hsl":[27,22,41],"lab":[45,7,15]},{"name":"Cinereous","hex":"938581","rgb":[147,133,129],"cmyk":[0,10,12,42],"hsb":[13,12,58],"hsl":[13,8,54],"lab":[57,5,4]},{"name":"Deep Space Sparkle","hex":"466362","rgb":[70,99,98],"cmyk":[29,0,1,61],"hsb":[178,29,39],"hsl":[178,17,33],"lab":[40,-11,-3]},{"name":"Cool Grey","hex":"8896ab","rgb":[136,150,171],"cmyk":[20,12,0,33],"hsb":[216,20,67],"hsl":[216,17,60],"lab":[62,0,-13]},{"name":"Beau Blue","hex":"c5d5e4","rgb":[197,213,228],"cmyk":[14,7,0,11],"hsb":[209,14,89],"hsl":[209,36,83],"lab":[85,-2,-9]}]