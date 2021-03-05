import React, { useState, useEffect } from'react'
import firebase, { firestore } from '../firebase/firebase.js'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import DatePicker from 'react-datepicker'

import { Select } from './Select'
import { Modal } from './Modal'
import { ToggleDefault } from '../utils/Utils.js'

const dummyProject = {
  name: '',
  wordcount: 0,
  description: '',
  timestamp: new Date()
}

export const ProjectSelect = (props) => {    
  const { currentUser, currentProject, defaultSelection, _setProject, _setAdd } = props
  const [editProject,setEditProject] = useState(currentProject)
  const [addProject,setAddProject] = useState(dummyProject)
  const [isOpen,toggleOpen] = useState(false)
  const [edit,toggleEdit] = useState(false)
  const [add,toggleAdd] = useState(false)
  const [startDate,setStartDate] = useState(new Date())
  const [type,setType] = useState('new')

  //Project Refs
  const projectRef = firestore.collection(`users/${currentUser.uid}/projects`)  
  const query = projectRef.orderBy('name')
  const [projects] = useCollectionData(query,{idField: 'id'})
  
  useEffect(()=>{
    editProject?.id !== currentProject?.id && setEditProject(currentProject) 
  },[currentProject,editProject])

  const updateProject = (project) => {       
    toggleEdit(()=>!edit) 
    var timestamp = firebase.firestore.Timestamp.now()      
    projectRef.doc(currentProject.id).update({ 
      name: project.name,
      description: project.description,
      revised: timestamp     
    }).then(function(){
      console.log('Project information updated!')
      if(editProject.default !== currentProject.default){
         ToggleDefault(projectRef,currentProject)
      }
    }).catch(function(error) {
      console.error('Error writing to document: '+error)
    })
  }

  
/*
  const deleteProject = (project) => {
    const id = project.id
    const delRef = projectRef.doc(id)       
    delRef.delete().then(() => {
      console.log('Deleted Project '+ id)  
      //console.log('New count added!')
    }).catch(function(error) {
      console.error('Error deleting count: '+error)
    })
    
  }
*/
  const handleAdd = () => {
    add && setAddProject(dummyProject)
    toggleAdd(()=>!add)
  }

  const handleAddSubmit = () => {

  }

  const handleCancel = () => {
    add && toggleAdd(()=>!add)
    edit && toggleEdit(()=> !edit)
    setEditProject(currentProject)
  }


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
          <button onClick={()=>toggleEdit(()=>!edit)} className="flex inline-flex h-3/4 mr-2 justify-center align-middle text-center content-center items-center border border-opacity-0 shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white transition duration-500 ease-in-out">
            Edit</button>
          <button onClick={()=>handleAdd()} className="flex inline-flex h-3/4 justify-center align-middle items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 border-spring-wood-800 border-solid border border-opacity-0 hover:border-opacity-100 transition duration-500 ease-in-out">
            Add Project</button>    
      </span>
      {add && (<Modal title='Add a New Project'>
        <input onChange={(e) => setAddProject({...addProject, name:e.target.value})} value={addProject.name} className="flex flex-row" type="text" name="name" placeholder="Add a descriptive name" />
        <input onChange={(e) => setAddProject({...addProject, description:e.target.value})} value={addProject.description} className="flex flex-row" type="text" name="description" placeholder="Add description" />
        <DatePicker
              selected={addProject.timestamp}
              onChange={(date) => setAddProject({...addProject,timestamp:date})}
              showTimeInput     
              dateFormat="MM/dd/yyyy h:mm aa"
              disabled={type==='new'}
          />
        <div className="entry-radio-group">
          <label htmlFor="new-project">
            <input type="radio" onClick={()=>setType('new')} name="new-project" value='new' checked={type==='new'}/>New Project
          </label>
          <label htmlFor="old-project">
            <input type="radio" onClick={()=>setType('old')} name="old-project" value='old' checked={type==='old'} />Existing Project
          </label>
        </div>
        <div className='button-row flex flex-row mt-4'>
          <button onClick={()=>props._addProject(addProject)} className="flex flex-col items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 mr-2 hover:text-spring-wood-800 hover:bg-white">
          Add Project
          </button>
          <button onClick={()=> handleCancel()} className="flex flex-col items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">
            Cancel
          </button>
        </div>
      </Modal>)}

      {edit &&
        <Modal title={`Edit ${currentProject.name}`} delete={true} width={'sm'}>
          <label htmlFor='name' className='mt-2'>
            Project Name
            <input onChange={(e) => setEditProject({...editProject, name:e.target.value})} value={editProject.name} name='name' type='text' className='flex flex-row'/>
          </label>          
          <label htmlFor='mt-2'>
            Description
            <textarea onChange={(e) => setEditProject({...editProject, description:e.target.value})} value={editProject.description} name='description' className='flex flex-row'/>               
          </label> 
          <label htmlFor='default' className='mt-2' >
            <input onChange={(e) => setEditProject({...editProject, default:!editProject.default})} checked={editProject.default} type='checkbox' name='default'/>
            Default Project
          </label>     
          <div className='button-row flex flex-row mt-4'>
                  <button onClick={()=> updateProject(editProject)} className="flex flex-col items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 mr-2 hover:text-spring-wood-800 hover:bg-white">
                    Update Project
                  </button>
                  <button onClick={()=> handleCancel()} className="flex flex-col items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:bg-spring-wood-800 hover:text-white">
                    Cancel
                  </button>
                </div>
        </Modal>
      }
    </div>)
  }