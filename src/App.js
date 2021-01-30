import { React,useState } from 'react'
import './App.css';

//firebase
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

//hooks
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Title } from './components/Title'
import { AddWordCount } from './components/AddWordCount'

firebase.initializeApp({
  apiKey: "AIzaSyDzG4HdlHob3LmULQ2MsKHo4ZCo1UzJPBQ",
  authDomain: "dowritething-4c0f3.firebaseapp.com",
  projectId: "dowritething-4c0f3",
  storageBucket: "dowritething-4c0f3.appspot.com",
  messagingSenderId: "530471616269",
  appId: "1:530471616269:web:b98c7b996259f924243a44",
  measurementId: "G-19L5Y8YZGM"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [count,setCount] = useState(0)  
  const [countList,addCountList] = useState([])
  const [lastUpdate,setLastUpdate] = useState('Never')

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
        <Title />
      </header> 
        <div id="main">
          {user ?
          <>
          <SignOut />
          <AddWordCount count={count} _setCount={update} _addList={addToList} list={countList}/>
          <h3 className="count_h3">Word Count: { count }</h3>
          <h4>Last Updated: {lastUpdate}</h4>
          <h3 className="count-list_h3">Word Count History</h3>
          {countList.length>0 ? <ul>{list}</ul> : 'Add a wordcount above'}
          <WordCountList />
          </>
          :
          <SignIn />
          }

        </div> 
       
    </div>
  );
}

function SignIn() {
  const signInAuth = () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider)
  }  

  return (    
    <button onClick={signInAuth}>Sign in</button>
  )
}

function SignOut() {  
  return auth.currentUser && (<>
    <p>{auth.currentUser.uid}</p><button onClick={() => auth.signOut()}>Sign out</button>
  </>)
}

function WordCountList() {
  const wcRef = firestore.collection('wordcount')
  const query = wcRef.where('uuid','==','notme').limit(20)
  //const query = wcRef.orderBy('timestamp').limit(20)
  const [wordcounts] = useCollectionData(query, {idField: 'id'})

  return (
    <>
    <p>List</p>
    {wordcounts && wordcounts.map(wc => <WordCount key={wc.uid} wordcount={wc}/>)}
    </>
  )
}

function WordCount(props) {
  const {count,timestamp,uuid,project} = props.wordcount
  return <p>Count: {count}; UUID: {uuid}</p>
}

export default App;
