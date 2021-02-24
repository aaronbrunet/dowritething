import { React, useState } from'react'
import { auth, firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Select } from './Select'

export const ProjectSelect = (props) => {    
    const projectRef = firestore.collection(`users/${auth.currentUser.uid}/projects`)  
    const query = projectRef.orderBy('name')
    const [projects] = useCollectionData(query,{idField: 'id'})
    var selection
    if(!props.defaultSelection){
      if(projects){
        selection = projects.find(option =>  option.default)
      } else {
        selection = 'default'
      }
    } else {
      selection = props.defaultSelection
    }
    //!props.defaultSelection && projects ?  : findDefault = props.defaultSelection

    const setProject = (input) => {
      //setValue(()=>input)
      props._setProject(input)
    }

  
    return (<>
      {/* <h1>Projects</h1> */}
      <Select 
        name="Projects" 
        options={projects} 
        placeholder="Select Project" 
        _onChange={setProject} 
        selection={selection}     
        />
  
      {/* <ul className='project-list'>    
      {projects && projects.map(project =><li key={project.uid} className='project-list-item' onClick={()=>props._setProject(project)}><h3>{project.name}</h3></li>)    }
      </ul> */}
      <button onClick={()=>props._setAdd('add')} className="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white  transition duration-300 ease-in-out">Add Project+</button>
    </>)
  }