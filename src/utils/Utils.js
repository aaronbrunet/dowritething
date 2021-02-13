import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export const _formatTime = (timestamp) => {
    var nowDate = timestamp.toDate().toLocaleDateString()
    var nowTime = timestamp.toDate().toLocaleTimeString()
    return `${nowDate} ${nowTime}`
}

export const _formatDate = (timestamp) => {
    var d = timestamp.toDate(),
    month = ''+(d.getMonth()+1),
    day = ''+d.getDate(),
    year = d.getFullYear()

    if (month.length < 2) 
        month = '0' + month
    if (day.length < 2) 
        day = '0' + day

    return [year, month, day].join('-')
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
                    disabled={flag==='project'}
                />}
            </label></>)
        } 
      else {
          value = input[field['name']]          
            arr.push(<>
                <label key={i} className='entry' htmlFor={field.name}>{label}
                <input type={field.type} name={field.name} value={value}/></label></>)
        }
      
    }
    //console.log(arr)
    return arr
  }
