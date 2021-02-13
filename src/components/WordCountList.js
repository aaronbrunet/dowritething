import { auth, firestore } from '../firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export const WordCountList = (props) => {  
    const wcRef = firestore.collection(`users/${auth.currentUser.uid}/projects/${props.currentProject.id}/wordcount`)
    const query = wcRef.orderBy('timestamp','asc').limit(20)
    const [wordcounts] = useCollectionData(query, {idField: 'id'})
  
    return (
      <div>
      <h3 className="count-list_h3">Word Count History</h3>
      <div className='count-list-container'>
        {wordcounts && wordcounts.map(wc => <WordCount key={wc.uid} wordcount={wc}/>)}
        </div>
      </div>
    )
    function WordCount(props) {
      const {count,timestamp} = props.wordcount
      const date = timestamp.toDate().toLocaleDateString()
      const time = timestamp.toDate().toLocaleTimeString()
      return (<div key={props.key} className='wc-history-item'>  
      <h3 className='wc-history-item-count'>Count: {count}</h3>
      <p className='wc-history-item-time'>Added on {date} at {time}</p>
      </div>)
    }
  }