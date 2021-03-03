import { React, useState } from'react'
import { firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Select } from './Select'

export const ProjectSelect = (props) => {    
  const { currentUser, currentProject, defaultSelection, _setProject, _setEdit, _setAdd } = props
    const [isOpen,toggleOpen] = useState(false)
    const projectRef = firestore.collection(`users/${currentUser.uid}/projects`)  
    const query = projectRef.orderBy('name')
    const [projects] = useCollectionData(query,{idField: 'id'})
    var selection
    if(!defaultSelection && !currentProject){
      if(projects){
        selection = projects.find(option =>  option.default)
      } else {
        selection = 'default'
      }
    } else {
      selection = defaultSelection
    }    
  
    return (
    <div id='project-select-container' className='container flex w-full justify-items-center items-center h-12'>
      <button onClick={()=>toggleOpen(()=>!isOpen)} className='flex flex-col align-middle justify-center mr-4' title='Projects' aria-label='Select Projects'>{isOpen ? '📖':'📚' }</button>
      <span className={isOpen ? 'flex-col items-center w-full' : 'hidden' }>
          <Select 
            name="Projects" 
            options={projects} 
            placeholder="Select Project" 
            _onChange={_setProject} 
            selection={selection}     
            />
          <button onClick={()=>_setEdit('edit')} className="flex inline-flex h-3/4 mr-2 justify-center align-middle text-center content-center items-center border border-opacity-0 shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white transition duration-500 ease-in-out">
            Edit</button>
          <button onClick={()=>_setAdd('add')} className="flex inline-flex h-3/4 justify-center align-middle items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 border-spring-wood-800 border-solid border border-opacity-0 hover:border-opacity-100 transition duration-500 ease-in-out">
            Add Project</button>    
      </span>
    </div>)
  }