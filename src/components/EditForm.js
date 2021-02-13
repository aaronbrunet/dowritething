import { React, useState } from 'react'
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
      <input className="entry" type="text" name="name" placeholder="Add a descriptive name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
      <input className="entry" type="textbox" name="description" placeholder="Add description" value={description} onChange={(e) => handleDescChange(e.target.value)} />
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
      <button className="entry" onClick={handleSubmit}>Add{name ? ` '${name}' ` : ' '}as new project</button>
      </>)}
      {props.editType === 'edit' && (<>
      {interpretFields(input,model,flag)}
      <button className="">Edit</button>
      <button className="" onClick={setEditing}>Cancel</button>
      </>)    
      }
    </div>)
  }