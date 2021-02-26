import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

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
        } 
      else {
          value = input[field['name']]          
            arr.push(<>
                <label key={i} className='flex flex-row' htmlFor={field.name}>{label}
                <input type={field.type} name={field.name} value={value}/></label></>)
        }
      
    }
    //console.log(arr)
    return arr
  }

  export const _getSum = (array,property) => {
    if(array.length>1){
        return array.reduce((a,b)=> a + (b[property] || 0), 0)
    } else {
        var a = array[0]
        return a[property]
    }
}
