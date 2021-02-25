import React, { useState } from 'react'
import { _interpretFields as interpretFields } from '../utils/Utils'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export const EditForm = (props) => {
    const [project,setProject] = useState(props.project)
    const [name,setName] = useState()
    const [description,setDescription] = useState()
    const [type,setType] = useState('new')
    const [wordcount,setWordcount] = useState(0)
    const [startDate, setStartDate] = useState(new Date());
    
    const input = props.input, model = props.model, flag = props.flag
    
    const handleNameChange = input => {
      setName(()=>input)
      project.name = input
      setProject(()=>project)
    }
    const handleDescChange = input => {
      setDescription(()=>input)
      project.description = input
      setProject(()=>project)
  
    }
    const handleWCChange = input => {
      setWordcount(()=>input)
      project.wordcount = input
      setProject(()=>project)
    }
  
    const setEditing = () => {
      console.log('Cancel editing')
      props._setEditing(()=>!props.editing)
    }
  
    const handleChange = (type) => {
      setType(()=>type)  
      setStartDate(()=>new Date())    
    }

    const handleSubmit = () => {
      project.timestamp = startDate
      console.log(project)
      props._addProject(project)
    }

    return (
    <div className='entry-form'>
      {props.editType === 'add' && (    
      <>
      <input className="flex flex-row" type="text" name="name" placeholder="Add a descriptive name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
      <input className="flex flex-row" type="text" name="description" placeholder="Add description" value={description} onChange={(e) => handleDescChange(e.target.value)} />
      <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeInput     
            dateFormat="MM/dd/yyyy h:mm aa"   
            withPortal  
            disabled={type==='new'}
        />
      <div className="entry-radio-group">
        <label htmlFor="new-project">
          <input type="radio" onClick={()=>handleChange('new')} name="new-project" value='new' checked={type==='new'}/>New Project
        </label>
        <label htmlFor="old-project">
          <input type="radio" onClick={()=>handleChange('old')} name="old-project" value='old' checked={type==='old'} />Existing Project
        </label>
      </div>
      {type === 'old' && (<input className="entry" type="number" name="wordcount" placeholder="Add a wordcount (if not starting a new project)" value={wordcount} onChange={(e) => handleWCChange(e.target.value)} />)}
      <button className="items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 hover:text-spring-wood-800 hover:bg-white" onClick={handleSubmit}>Add{name ? ` '${name}' ` : ' '}as new project</button>
      <button className="inline-flex items-center shadow bg-white text-spring-wood-800 text-xs rounded px-4 py-2 hover:white hover:text-spring-wood-800" onClick={setEditing}>Cancel</button>
      </>)}
      {props.editType === 'edit' && (<>
      {interpretFields(input,model,flag)}
      <div className="flex flex-row">
        <button className="inline-flex items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 hover:text-spring-wood-800 hover:bg-white">Edit</button>
        <button className="inline-flex items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 hover:text-spring-wood-800 hover:bg-white" onClick={setEditing}>Cancel</button>
      </div>
      </>)    
      }
    </div>)
  }

  /*
props: 
  type [edit,add,delete]
  title
  display [icon,text]
  icon [pencil,x]
  
  isOpen ?
  <Close Button>
  <Modal>
    {children}
  </Modal>
  :
  <Open Button>


  */