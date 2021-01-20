import { useState } from 'react'
import './App.css';
import { HelloWorld } from './components/HelloWorld'
import { AddWordCount } from './components/AddWordCount'

function App() {
  const [count,setCount] = useState(0)  
  const [countList,addCountList] = useState([])

  const update = newCount => {
    setCount(newCount)
  }

  const addToList = newCount => {
    const arr = countList
    arr.push(newCount)
    addCountList(arr)
  }

  const list = countList.map((item,index)=>(
    <li className="index">{item}</li>
  ))

  return (
    <div className="App">
      <header className="App-header">
        <HelloWorld />        
        <AddWordCount count={count} _setCount={update} _addList={addToList}/>
        <h3 className="count_h3">Word Count: { count }</h3>
        <h3 className="count-list_h3">Word Count History</h3>
        <ul>{list}</ul>
      </header>      
    </div>
  );
}

export default App;
