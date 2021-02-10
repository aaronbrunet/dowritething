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

// //export const _puppetFields = (fields,input) => {
// export const _puppetFields = () => {
//     //const combined = (a,b) => a.map(field => Object.assign(field, b =>[b]===field.name))    
//     const combined = (a,b) => a.map(field => {
//             let value =b[(key=>b[key]===field.name)]
//             console.log(value)
//             return {...field,...value}
//         }
//         //Object.assign(field, b =>[b]===field.name)
//     )    
//     const fields = [{name:'name',type:'text'},{name:'wordcount',type:'number'},{name:'description',type:'text'}]
//     const input = {"name":"Test","wordcount":"500","revised":{"seconds":1612235542,"nanoseconds":927000000},"description":"Testing","created":{"seconds":1612235542,"nanoseconds":927000000},"owner":"users/xsf8mT0jZ1OX01g7cj9zV6SKzty2","id":"YGZ2aviACZFh7uZItxQc"}

//     return console.log(combined(fields,input))
//     /*
//     return fields.map(field => {
//         return(<label htmlFor={field.name}>{field.name}
//         <input type={field.type} name={input.name} value={input.value}/></label>
//     )})
//     */
// }

export const _interpretFields = (input,model) => {
    var arr = []
    for (var i in model) {
      let field = model[i]
      let value
      field.type === 'date' ? value = _formatDate(input[field['name']]) : value = input[field['name']]
      let label = field.name.replace(/^\w/, (c) => c.toUpperCase())
      arr.push(<>
      <label className='entry' htmlFor={field.name}>{label}
        <input type={field.type} name={field.name} value={value}/></label></>)
    }
    console.log(arr)
    return arr
  }
