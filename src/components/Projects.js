import { React, useState } from'react'
import { auth, firestore } from '../firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Select } from './Select'

export const Projects = (props) => {    
    const projectRef = firestore.collection(`users/${auth.currentUser.uid}/projects`)  
    const query = projectRef.orderBy('name')
    const [projects] = useCollectionData(query,{idField: 'id'})
  
    const setProject = (input) => {
      //setValue(()=>input)
      props._setProject(input)
    }
  
    return (<>
      <h1>Projects</h1>
      <Select 
        name="Projects" 
        options={projects} 
        placeholder="Select Project" 
        _onChange={setProject}      
        />
  
      {/* <ul className='project-list'>    
      {projects && projects.map(project =><li key={project.uid} className='project-list-item' onClick={()=>props._setProject(project)}><h3>{project.name}</h3></li>)    }
      </ul> */}
      <button onClick={()=>props._setAdd('add')} className='project-button'>Add Project+</button>
    </>)
  }