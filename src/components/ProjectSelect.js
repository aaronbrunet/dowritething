import { React, useState } from'react'
import { auth, firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Select } from './Select'

export const ProjectSelect = (props) => {    
    const [isOpen,toggleOpen] = useState(true)
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

    const setProject = (input) => {     
      props._setProject(input)
    }

  
    return (<div id='project-select-container' className='h-full m-2 align-middle content-center'>
    <button onClick={()=>toggleOpen(()=>!isOpen)} className='inline-flex' title='Projects' aria-label='Select Projects'>{isOpen ? '📖':'📕' }</button>
    {isOpen && 
      <div id='project-select' className='inline-flex'>
        <Select 
          name="Projects" 
          options={projects} 
          placeholder="Select Project" 
          _onChange={setProject} 
          selection={selection}     
          />
        <button onClick={()=>props._setEdit('edit')} className="inline-flex text-center content-center items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white transition duration-300 ease-in-out">Edit</button>
        <button onClick={()=>props._setAdd('add')} className="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white  transition duration-300 ease-in-out">Add Project+</button>    
      </div>}
    </div>)
  }