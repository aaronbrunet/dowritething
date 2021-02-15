import React, { useState } from 'react'
import { firestore } from '../firebase/firebase.js'
import { useDocument } from 'react-firebase-hooks/firestore'

import { _formatTime as formatTime, _formatDate as formatDate, _interpretFields as interpretFields } from '../utils/Utils.js'
import { WordCount } from './WordCount'
import { GoalList } from './GoalList'

export const Project = (props) => {
    const { currentProject, currentUser, setEdit } = props

    const [value,loading,error] = useDocument(firestore.doc(`users/${currentUser.uid}/projects/${currentProject.id}`))
    let project
    value ? project = value.data() : project = null
    //console.log(JSON.stringify(value.data()))
    
    return (
        <div>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Document: Loading...</span>}
        {/* {value && <span>Document: {JSON.stringify(value.data())}</span>} */}
        {value &&         
            (<>
            <div className='left-inner'>
                <h1>{project.name}</h1><button onClick={()=>setEdit('edit')}>Edit</button>
                {project.default && <p>Default</p>}
                <p className='description'>{project.description}</p>
                <h3 className="count_h3">Word Count: { project.wordcount }</h3>
                <h4>Last Updated: {project.revised && formatTime(project.revised)}</h4>          
              </div>            
              <div className='right-inner'>   
                <GoalList currentProject={value}/>
                <WordCount currentProject={value} currentUser={currentUser}/>
            </div></>)}
    </div>
    )
}