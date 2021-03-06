import React, { useState } from 'react'
import DatePicker from 'react-datepicker'


export const _formatTime = (timestamp) => {
    var nowDate = timestamp.toDate().toLocaleDateString()
    var nowTime = timestamp.toDate().toLocaleTimeString()
    return `${nowDate} ${nowTime}`
}

export const _formatDate = (timestamp,type) => {
    var nowDate
    switch (type) {
    case 'slash':
        nowDate = timestamp.toDate().toLocaleDateString()
        return nowDate
    case 'verbose':
        nowDate = timestamp.toDate().toDateString()
        return nowDate
    default:
        var d = timestamp    
        !(d instanceof Date) && (d = d.toDate())
        
        var month = ''+(d.getMonth()+1),
        day = ''+d.getDate(),
        year = d.getFullYear()

        if (month.length < 2) 
            month = '0' + month
        if (day.length < 2) 
            day = '0' + day

        return [year, month, day].join('-')        
    }
}

export const _interpretFields = (input,model,flag) => {  
    const [now,setNow] = useState(input['timestamp'].toDate())
    console.log(input['timestamp'].toDate())  

    const handleChange = input => {
        setNow(()=>input.target.value)
    }
    var arr = []
    for (var i in model) {
      let field = model[i]
      let value
      let label = field.name.replace(/^\w/, (c) => c.toUpperCase())
      if (field.type === 'date') {   
          arr.push(<>
            <label key={i} className='entry' htmlFor={field.name}>{label}
                {<DatePicker
                    selected={now}
                    onChange={()=> handleChange}
                    showTimeInput     
                    dateFormat="MM/dd/yyyy h:mm aa" 
                    disabled={flag==='edit'}
                />}
            </label></>)
      } else if (field.type === 'textarea'){
        value = input[field['name']]          
            arr.push(<>
                <label key={i} className='flex flex-row' htmlFor={field.name}>{label}
                <textarea name={field.name} value={value}/></label></>)
      } 
      else {
          value = input[field['name']]   
          var content =  (<>
          <label key={i} htmlFor={field.name}>{label}
          <input type={field.type} name={field.name} value={value}/>
          {field.name.indexOf('count')>0 && <span className='flex inline-flex relative -ml-24 text-spring-wood-800'>words</span>}
          </label>
          </>)
          console.log(content)
          arr.push(content)
                
        }
      
    }
    //console.log(arr)
    return arr
  }

export const _getSum = (array,property) => {
    if(array.length > 0){
        return array.reduce((a,b)=> a + (b[property] || 0), 0)
    } else {
        return 0
    }
}

export const ToggleDefault = (projectsRef,currentProject) => {
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