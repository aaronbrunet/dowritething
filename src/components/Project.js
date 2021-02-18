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
            (<div className="container block p-6 shadow-lg rounded-lg flex justify-between h-full">
                <div className="flex flex-col">
                    <div className="inline-flex">
                        <div className="font-medium text-xl mt-4 mr-4">{project.name}</div>                       
                        {project.default && <svg className="inline-flex mt-2 justify-items-center content-center items-center h-full w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>}
                        <button className="mx-auto mt-4 block w-1/4 text-center content-center items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white  transition duration-300 ease-in-out" onClick={()=>setEdit('edit')}>Edit</button>
                    </div>                    
                    <div id="project-info" className="prose">                    
                    <p className='description'>{project.description}</p>
                    <h3 className="count_h3">{ project.wordcount } total words</h3>
                    <p className="font-small text-sm">Last updated {project.revised && formatTime(project.revised)}</p>          
                    </div>
                    
                </div>            
                <div className="flex flex-col h-full">   
                    <GoalList currentProject={value}/>
                    </div>
                <div className="flex flex-col h-full">   
                    <WordCount currentProject={value} currentUser={currentUser}/>
                </div>                
            </div>)}
    </div>
    )
}