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
  const [countList,addCountList] = useState([])
  const [lastUpdate,setLastUpdate] = useState('Never')
  const [currentProject,setCurrentProject] = useState(null)
  const [totalCount,setTotalCount] = useState(0)

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
  const _setProject = (project) => {
    setCurrentProject(project)
    setTotalCount(project.wordcount)
  }

  const update = newCount => {
    setCount(newCount)
    if(count < 0){setCount(0)}
    updateTime()
  }

  const addToList = newCount => {
    const arr = countList
    const now = Date().toLocaleString()
    //const length = arr.length
    const wordcount = {}
    wordcount.count = newCount
    wordcount.time = now
    arr.push(wordcount)
    addCountList(arr)    
    updateTime()
  }

  const updateTime = () => {
    let newUpdate = countList.length>0 ? countList.reduce((max,wordcount) => (wordcount.time > max ? wordcount.time : max),countList[0].time) : 'Never'
    setLastUpdate(newUpdate)
  }

  const removeFromList = (value,idx) => {    
    let result = parseInt(count) - parseInt(value)
    update(result)
    let arr = countList
    arr = arr.filter((item,i) => i !== idx)
    addCountList(arr)
    if (arr.length === 0) {
      setCount(0)
    }
    updateTime()
  }

  const list = countList.map((wordcount,index)=>(
    <li key={index} className='list'>{wordcount.count} <button onClick={() => removeFromList(wordcount.count,index)}>X</button>
    <br/>{wordcount.time}</li>
  ))

  //const lastUpdate = countList.length>0 ? countList.reduce((max,wordcount) => (wordcount.now > max ? wordcount.now: max),countList[0].now) : null

  const [user] = useAuthState(auth)
  
  return (
    <div className="App">
      <header className="App-header">
      <div className='auth-panel'>{ user ? <><SignOut /> <p className='greeting'>Hi, {auth.currentUser.displayName}</p></>: <SignIn />}</div>
        <Title />
        
      </header> 
        <div id="main">
          {user ? <>
          <div className='left'>
          <Projects _setProject={_setProject}/>  
          <button>Add Project+</button>        
          </div>
          <div className='right'>
          {currentProject && currentProject.id &&(<>
            <div className='left-inner'>
              <h1>{currentProject.name}</h1>
              <p className='description'>{currentProject.description}</p>
              <h3 className="count_h3">Word Count: { totalCount }</h3>
              <h4>Last Updated: {lastUpdate}</h4>          
              <AddWordCount count={count} _setCount={update} _addList={addToList} list={countList}/>          
            </div>            
            <div className='right-inner'>              
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

function Projects(props) {  
  const userRef = firestore.collection('users').doc(auth.currentUser.uid)
  const projectRef = firestore.collection('projects')
  const query = projectRef.where('owner','==',userRef)
 // const query = projectRef.orderBy('timestamp')
  const [projects] = useCollectionData(query,{idField: 'id'})

  return (<>
    <h1>Projects</h1>
    {projects && projects.map(project =><Project _setProject={props._setProject} key={project.uid} project={project}/>)}
  </>)
}
function Project(props) {
  const {name,timestamp,id,wordcount} = props.project
  
  return <h3 onClick={()=>props._setProject(props.project)}>{name}</h3>
}

function WordCountList(props) {  
  const wcRef = firestore.collection('projects/'+props.currentProject.id+'/wordcount')
  const query = wcRef.orderBy('timestamp','asc').limit(20)
  const [wordcounts] = useCollectionData(query, {idField: 'id'})

  return (
    <>
    <h3 className="count-list_h3">Word Count History</h3>
    {wordcounts && wordcounts.map(wc => <WordCount key={wc.uid} wordcount={wc}/>)}
    </>
  )
}

function WordCount(props) {
  const {count,timestamp,uuid,project} = props.wordcount
  const date = timestamp.toDate().toLocaleDateString()
  const time = timestamp.toDate().toLocaleTimeString()
  return (<div className='wc-history-item'>  
  <h3 className='wc-history-item-count'>Count: {count}</h3>
  <p className='wc-history-item-time'>Added on {date} at {time}</p>
  </div>)
}

export default App;
