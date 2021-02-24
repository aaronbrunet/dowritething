import React, { useState, useEffect } from 'react'
import { firestore } from '../firebase/firebase.js'
import { useDocument } from 'react-firebase-hooks/firestore'

import { _formatTime as formatTime } from '../utils/Utils.js'
import { WordCount } from './WordCount'
import { GoalList } from './GoalList'

export const Project = (props) => {
    const { currentProject, currentUser, setEdit } = props
    const [value,loading,error] = useDocument(firestore.doc(`users/${currentUser.uid}/projects/${currentProject.id}`))
    const [project,setProject] = useState(currentProject)

    useEffect(() => {        
        //value ? project.current = value.data() : project.current = null
        if(value){
            var newProject = value.data()
            newProject.id = value.id
            console.log(newProject)
            setProject(()=> newProject)
        }
    },[value])
    //console.log(JSON.stringify(value.data()))
    
    const ToggleDefault = () => {
        //console.log(currentProject.id)
        const projectsRef = firestore.collection(`users/${currentUser.uid}/projects/`)
        projectsRef.get()
        .then((snapshot)=>{
            snapshot.forEach((proj) => {
               //console.log(proj.id)
            if(proj.id===currentProject.id){
                //console.log(`Setting ${proj.data().name} to default`)                
                projectsRef.doc(proj.id).update({
                    default: !currentProject.default
                })
            } else {
                //console.log(`Removing ${proj.data().name} from default`)
                projectsRef.doc(proj.id).update({
                    default: false
                })
            }})
        })
    }

    return (
        <div>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Document: Loading...</span>}
        {/* {value && <span>Document: {JSON.stringify(value.data())}</span>} */}
        {project &&         
            (<div className="container block p-6 shadow-lg rounded-lg flex justify-between h-screen sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
                <div className="flex flex-col">
                    <div className="inline-flex">
                        <div className="font-medium text-xl mt-4 mr-4">{project.name}</div>                       
                        <button onClick={()=>ToggleDefault()}>
                        
                        <svg className="inline-flex mt-2 justify-items-center content-center items-center h-full w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke='currentColor' fill={project.default ? `currentColor` : `none`}>                        
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        
                        
                        </button>
                        <button className="mx-auto mt-4 block w-1/4 text-center content-center items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white  transition duration-300 ease-in-out" onClick={()=>setEdit('edit')}>Edit</button>
                    </div>                    
                    
                    <div id="project-info" className="prose">                    
                    <p className='description'>{project.description}</p>
                    <h3 className="count_h3">{ project.wordcount } total words</h3>
                    <p className="font-small text-sm">Last updated {project.revised && formatTime(project.revised)}</p>          
                    </div>
                    
                </div>            
                <div className="flex flex-col h-full">   
                    <GoalList currentProject={project}/>
                    </div>
                <div className="flex flex-col h-full">   
                    <WordCount currentProject={project} currentUser={currentUser}/>
                </div>                
            </div>)}
    </div>
    )
}