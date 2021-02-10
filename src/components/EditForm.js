import { React, useState } from 'react'
import { _interpretFields as interpretFields } from '../utils/Utils'

export const EditForm = (props) => {
    const [project,setProject] = useState(props.project)
    const [name,setName] = useState()
    const [description,setDescription] = useState()
    const [type,setType] = useState('new')
    const [wordcount,setWordcount] = useState(0)
    //const fields = [{type:'text',name:'Title',value:'Test Project'},{type:'number',name:'Count',value:150}]
    
    // const puppetFields = (fields) => {
    //   return fields.map(field => {
    //       return(<label htmlFor={field.name}>{field.name}
    //       <input type={field.type} name={field.name} value={field.value}/></label>
    //   )})
    // }
  
    const input = props.input, model = props.model
    
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
  
    return (
    <div className='entry-form'>
      {props.editType === 'add' && (    
      <>
      <input className="entry" type="text" name="name" placeholder="Add a descriptive name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
      <input className="entry" type="textbox" name="description" placeholder="Add description" value={description} onChange={(e) => handleDescChange(e.target.value)} />
      
      <div className="entry-radio-group">
        <label htmlFor="new-project">
          <input type="radio" onClick={()=>setType('new')} name="new-project" value='new' checked={type==='new'}/>New Project
        </label>
        <label htmlFor="old-project">
          <input type="radio" onClick={()=>setType('old')} name="old-project" value='old' checked={type==='old'} />Existing Project
        </label>
      </div>
      {type === 'old' && (<input className="entry" type="number" name="wordcount" placeholder="Add a wordcount (if not starting a new project)" value={wordcount} onChange={(e) => handleWCChange(e.target.value)} />)}
      <button className="entry" onClick={()=>props._addProject(project)}>Add{name ? ` '${name}' ` : ' '}as new project</button>
      </>)}
      {props.editType === 'edit' && (<>
      {interpretFields(input,model)}
      <button className="">Edit</button>
      <button className="" onClick={setEditing}>Cancel</button>
      </>)    
      }
    </div>)
  }