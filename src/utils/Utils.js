export const _formatTime = (timestamp) => {
    var nowDate = timestamp.toDate().toLocaleDateString()
    var nowTime = timestamp.toDate().toLocaleTimeString()
    return `${nowDate} ${nowTime}`
}

//export const _puppetFields = (fields,input) => {
export const _puppetFields = () => {
    //const combined = (a,b) => a.map(field => Object.assign(field, b =>[b]===field.name))    
    const combined = (a,b) => a.map(field => {
            let value =b[(key=>b[key]===field.name)]
            console.log(value)
            return {...field,...value}
        }
        //Object.assign(field, b =>[b]===field.name)
    )    
    const fields = [{name:'name',type:'text'},{name:'wordcount',type:'number'},{name:'description',type:'text'}]
    const input = {"name":"Test","wordcount":"500","revised":{"seconds":1612235542,"nanoseconds":927000000},"description":"Testing","created":{"seconds":1612235542,"nanoseconds":927000000},"owner":"users/xsf8mT0jZ1OX01g7cj9zV6SKzty2","id":"YGZ2aviACZFh7uZItxQc"}

    return console.log(combined(fields,input))
    /*
    return fields.map(field => {
        return(<label htmlFor={field.name}>{field.name}
        <input type={field.type} name={input.name} value={input.value}/></label>
    )})
    */
}
