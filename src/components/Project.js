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
            newProject.id = currentProject.id
            //console.log(newProject)
            setProject(()=> newProject)
        }
    },[value,currentProject])
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
            (<div id='project-container' className="container block p-6 shadow-lg rounded-lg h-screen sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
                <div id='project-top-bar' className='flex flex-nowrap flex-row border-solid border-2 border-red'>
                    <div className="flex flex-col w-1/3 border-solid border-2 border-blue">
                        <div id='project-title-bar' className='flex flex-row h-auto p-4 m-4'>
                            <div className="text-4xl flex-col font-bold mt-4 mr-4">{project.name}</div>                       
                            <button onClick={()=>ToggleDefault()} className='flex-col'>                        
                                <svg className="mt-2 justify-items-center content-center items-center h-full w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke='currentColor' fill={project.default ? `currentColor` : `none`}>                        
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                            </button>                            
                        </div>                        
                        <p className='flex flex-row h-auto prose px-4 mx-4'>{project.description}</p>
                        <p className='flex flex-row h-auto prose font-small text-sm px-4 mx-4'>Last updated {project.revised && formatTime(project.revised)}</p>          
                    </div>                    
                    
                    <div id="project-info" className="flex flex-col w-1/3 prose border-solid border-2 border-green">                    
                    
                    <h3 className="count_h3">{ project.wordcount } total words</h3>
                    
                    </div>

                    <div className="flex flex-col w-1/3">   
                    <GoalList currentProject={project}/>
                    </div>    
                </div>            
                
                <div className="flex flex-row h-full border-solid border-2 border-yellow">   
                    <WordCount currentProject={project} currentUser={currentUser}/>
                </div>                
            </div>)}
    </div>
    )
}