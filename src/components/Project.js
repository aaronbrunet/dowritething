import React, { useState, useEffect } from 'react'
import { firestore } from '../firebase/firebase.js'
import { useDocument, useCollectionData } from 'react-firebase-hooks/firestore'

import { _formatDate as formatDate, _formatTime as formatTime, _getSum as getSum } from '../utils/Utils.js'
import { WordCount } from './WordCount'
import { GoalList } from './GoalList'

export const Project = (props) => {
    const { currentProject, currentUser } = props
    const [value,loading,error] = useDocument(firestore.doc(`users/${currentUser.uid}/projects/${currentProject.id}`))
    const [project,setProject] = useState(currentProject)
    const [today,getToday] = useState(0)
    const projectsRef = firestore.collection(`users/${currentUser.uid}/projects/`)

    //Wordcount
    const wcRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/wordcount`)
    const wcQuery = wcRef.orderBy('timestamp','asc')//.limit(20)
    const [wordcounts] = useCollectionData(wcQuery, {idField: 'id'})

    //Goal
    const goalRef = firestore.collection(`users/${currentUser.uid}/projects/${currentProject.id}/goals`)
    //const gQuery = goalRef.where('active','==',true).limit(3)
    const gQuery = goalRef.where('completed','==',false).limit(3)
    const [goals] = useCollectionData(gQuery, {idField: 'id'})

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
        projectsRef.get()
        .then((snapshot)=>{
            snapshot.forEach((proj) => {
               //console.log(proj.id)
            if(proj.id===currentProject.id){
                //console.log(`Setting ${proj.data().name} to default`)   
                var defaultStatus = proj.data().default             
                projectsRef.doc(proj.id).update({
                    default: !defaultStatus
                })
            } else {
                //console.log(`Removing ${proj.data().name} from default`)
                if(proj.data().default === true){
                    projectsRef.doc(proj.id).update({
                        default: false
                    })
                }
            }})
        })
    }

    useEffect(() => {
        if(wordcounts) {                
            console.log(formatDate(new Date())) 
            const todayArr = wordcounts.filter(wc => formatDate(wc.timestamp) === formatDate(new Date()))
            const todaySum = getSum(todayArr,'count')
            getToday(()=>todaySum)

        }
    },[wordcounts])   

    return (
        <div>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Document: Loading...</span>}
        {/* {value && <span>Document: {JSON.stringify(value.data())}</span>} */}
        {project &&         
            (<div id='project-container' className="container block bg-white p-6 shadow-lg rounded-lg h-screen sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
                <div id='project-top-bar' className='flex flex-nowrap flex-row h-1/5 border-spring-wood-800'>
                    <div id='project-title' className="flex flex-col h-full justify-center align-center items-center text-left px-6 w-1/3">
                        <div id='project-title-bar' className='flex flex-row overflow-hidden w-full h-auto'>
                            <div className="text-4xl text-left flex-col font-bold mr-4">{project.name}</div>                       
                            <button onClick={()=>ToggleDefault()} className='flex-col' aria-label="Set Default" title="Set Default">                        
                                <svg className="mt-2 justify-items-center content-center items-center h-full w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke='currentColor' fill={project.default ? `currentColor` : `none`}>                        
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                            </button>                            
                        </div>                        
                        <p className='flex flex-row h-auto prose w-full'>{project.description}</p>
                        <p className='flex flex-row h-auto prose w-full font-small text-sm'>Last updated {project.revised && formatTime(project.revised)}</p>          
                    </div>                    
                    
                    <div id="project-info" className="flex flex-col h-full justify-center items-center w-1/3 prose">                                        
                    <div className='flex flex-row items-center text-xl font-semibold'>{today}{ project.dailyGoal && ` / ${project.dailyGoal}`}</div>                        
                    <div className="flex flex-row items-center text-xl font-semibold">words for today's goal</div>
                    {project.dailyGoal && today >= project.dailyGoal ? (<div>Great job!</div>):(<div>Keep going!</div>)}    {/* <div className="flex flex-row items-center text-sm">{project.timestamp && ('Since ' + formatDate(project.timestamp,'slash'))}</div>                     */}

                    </div>

                    <div className="flex flex-col h-full justify-center items-center w-1/3 prose">   
                       {/* <div className='flex flex-row items-center text-xl font-semibold'>{today} words today</div>                         */}
                       <div className='flex flex-row items-center text-xl font-semibold'>{ project.wordcount } total words</div>                  
                    </div>    
                </div> 
                <div id='project-container-body' className='flex flex-row h-4/5'>
                    <div id='project-container-body-inner-left' className='flex flex-col w-2/3 h-full'>
                        <div className="flex flex-col h-1/5">   
                            <GoalList 
                                currentProject={project} 
                                currentUser={currentUser}
                                goals={goals}
                                goalRef={goalRef}
                            />
                        </div> 
                    </div>
                    <div id='project-container-body-inner-right' className="flex flex-col w-1/3 h-full">   
                        <WordCount 
                            currentProject={project} 
                            currentUser={currentUser} 
                            wordcounts={wordcounts}
                            wcRef={wcRef}
                        />
                    </div>                
                </div>
            </div>)}
    </div>
    )
}