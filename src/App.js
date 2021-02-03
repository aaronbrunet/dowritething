import { React,useState } from 'react'
import './App.css';



//firebase
import firebase, { auth, provider, firestore } from './firebase.js'

//hooks
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Title } from './components/Title'
import { AddWordCount } from './components/AddWordCount'

//baseweb
import { Button, SIZE, SHAPE } from 'baseui/button'
import {
  Display1,
  Display2,
  Display3,
  Display4,
  Label1,
  Label2,
  Label3,
  Label4,
  Paragraph1,
  Paragraph2,
  Paragraph3,
  Paragraph4,
} from 'baseui/typography';
import { Card, StyledBody, StyledAction } from "baseui/card";
import { Select } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Block } from 'baseui/block';

function App() {
  const [count,setCount] = useState(0)  
  const [lastUpdate,setLastUpdate] = useState('Never')
  const [currentProject,setCurrentProject] = useState()
  const [totalCount,setTotalCount] = useState(0)
  const [edit,setEdit] = useState(false)
  const [user] = useAuthState(auth)
  const userRef = user ? firestore.collection('users').doc(auth.currentUser.uid) : null

  const dummyProject = {
    name: '',
    wordcount: 0,
    description: '',
    revised: null,
    created: null
  }
  
  //Worker Functions
  const _formatTime = (timestamp) => {
    var nowDate = timestamp.toDate().toLocaleDateString()
    var nowTime = timestamp.toDate().toLocaleTimeString()
    return `${nowDate} ${nowTime}`
  }

  const _setProject = (project) => {
    console.log(project)
    setCurrentProject(project)  
    setTotalCount(project.wordcount)  
    console.log('Set project '+project.name)
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
    var formattedTime = _formatTime(timestamp)
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
        }).then(function (docRef){
          docRef.get().then(function(doc){            
            var current = doc.data()             
            if(current.wordcount > 0) {
              const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${doc.id}/wordcount`)
              //const wcRef = doc.collection('wordcount')
              wcRef.add({
                  count: parseInt(current.wordcount),
                  timestamp: firebase.firestore.Timestamp.now()
              }).then(function(){
                  console.log('New count added!')
                  setCurrentProject(()=>current)
                }).catch(function(error) {
                  console.error('Error adding new count: '+error)
                })
            } else {
              setCurrentProject(()=>current)
            }
            setEdit(()=>!edit)
          })
        }).catch(function(error) {
            console.error('Error adding new count: '+error)
        })        
        
  }

  return (    
      <div className="App">
        <header className="App-header">
        <div className='auth-panel'>{ user ? <><SignOut /> <Paragraph1>Hi, {auth.currentUser.displayName}</Paragraph1></>: <SignIn />}</div>
          <Display1>Do(the)Write Thing</Display1>
          
        </header> 
          <div id="main">
            {user ? <>
            <Card>
              <StyledBody>
                <Projects 
                  _setProject={_setProject} 
                  _addProject={_addProject} 
                  _userRef={userRef}
                  dummyProject={dummyProject}
                  edit={edit}
                  _setEdit={setEdit}
                  />        
              </StyledBody>            
            </Card>
            <Card>
            <StyledBody>
                {currentProject && !edit &&(<>
                <div className='left-inner'>
                  <h1>{currentProject.name}</h1>
                  <p className='description'>{currentProject.description}</p>
                  <h3 className="count_h3">Word Count: { currentProject.wordcount }</h3>
                  <h4>Last Updated: {currentProject.revised && _formatTime(currentProject.revised)}</h4>          
                  <AddWordCount currentUser={user} currentProject={currentProject} count={count} _setCount={_update} />          
                </div>            
                <div className='right-inner'>   
                  <GoalList currentProject={currentProject}/>
                  <WordCountList currentProject={currentProject}/>
                </div>
                </>)}
                { edit && (<EditForm project={dummyProject} _addProject={_addProject}/>)}
              
            </StyledBody>
            </Card>
            </>
            :
              <h4>Welcome to Do (the) Write Thing</h4>
            }

          </div> 
      </div>
  );
}

//Class Functions

//Auth
function SignIn() {
  const signInAuth = () => {      
      auth.signInWithPopup(provider).then(function(){
        
        const userRef = firestore.collection('users').doc(auth.currentUser.uid)
        userRef.set({
          name: auth.currentUser.displayName,
          lastLogin: firebase.firestore.Timestamp.now(),
          id: auth.currentUser.uid
        }, { merge: true})
        console.log('Signed in!')
      }).catch(function(error) {
        console.error('Error logging in: '+error)
      })
      
  }  
  return (    
    <Button size={SIZE.compact} onClick={signInAuth}>Sign in</Button>
  )
}
function SignOut() {  
  return auth.currentUser && (<>
    <Button size={SIZE.compact} onClick={() => auth.signOut()}>Sign out</Button>
  </>)
}

//Form
function EditForm(props){
  const [project,setProject] = useState(props.project)
  const [name,setName] = useState()
  const [description,setDescription] = useState()
  const [type,setType] = useState('new')
  const [wordcount,setWordcount] = useState(0)
  const handleNameChange = input => {
    setName(()=>input)
    project.name = input
    setProject(()=>project)
  }
  const handleDescChange = input => {
    setDescription(()=>input)
    project.description = input
    setProject(()=>project)

  }
  const handleWCChange = input => {
    setWordcount(()=>input)
    project.wordcount = input
    setProject(()=>project)

  }
  return (<div className='entry-form'>
    <input className="entry" type="text" name="name" placeholder="Add a descriptive name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
    <input className="entry" type="textbox" name="description" placeholder="Add description" value={description} onChange={(e) => handleDescChange(e.target.value)} />
    
    <div className="entry-radio-group">
      <label for="new-project">
        <input type="radio" onClick={()=>setType('new')} name="new-project" value='new' checked={type==='new'}/>New Project
      </label>
      <label for="old-project">
        <input type="radio" onClick={()=>setType('old')} name="old-project" value='old' checked={type==='old'} />Existing Project
      </label>
    </div>
    {type === 'old' && (<input className="entry" type="number" name="wordcount" placeholder="Add a wordcount (if not starting a new project)" value={wordcount} onChange={(e) => handleWCChange(e.target.value)} />)}
    <Button size={SIZE.large} shape={SHAPE.pill} onClick={()=>props._addProject(project)}>Add{name ? ` '${name}' ` : ' '}as new project</Button>
  </div>)
}

//Projects
function Projects(props) {
  const [value,setValue] = useState([]);    
  const projectRef = firestore.collection(`users/${auth.currentUser.uid}/projects`)  
  const query = projectRef.orderBy('name')
  const [projects] = useCollectionData(query,{idField: 'id'})

  const setProject = (input) => {
    setValue(()=>input)
    props._setProject(input[0])
  }

  function mapObjectToString(object) {
    return object.name
  }

  return (<>
    <h1>Projects</h1> 
    <Block>
    {projects &&
    (<FormControl label="Projects">
      <Select 
        value={value} 
        onChange={({value})=>setProject(value)}
        placeholder= 'Choose a project'
        options={projects}     
        labelKey="name"
        valueKey="id"  
        />
      </FormControl>)}   
    {//projects && projects.map(project =><li key={project.uid} className='project-list-item' onClick={()=>props._setProject(project)}><h3>{project.name}</h3></li>)    
    }    
    <Button shape={SHAPE.pill} onClick={() => props._setEdit(()=>!props.edit)}>Add Project+</Button>
    </Block>
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
    {(!goals || (goals && goals.length === 0)) && (<p>No goal currently set.</p>)}
    {goals && goals.map(goal => <Goal key={goal.uid} goal={goal}/>)}
    <Button size={SIZE.large} shape={SHAPE.pill}>Add a Goal+</Button>
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
