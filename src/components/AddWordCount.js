import React, { useState } from 'react'
import firebase, { firestore } from '../firebase.js'

//baseweb
import {useStyletron} from 'baseui';
import { Button } from 'baseui/button'
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import Plus from 'baseui/icon/plus';


export const AddWordCount = props => {
    const [css, theme] = useStyletron();
    const [newCount,setNewCount] = useState(0)

    const AddCount = newCount => {        
        //let result = parseInt(props.count) + parseInt(newCount)
        setNewCount(0)
        props._setCount(newCount)        
        //props._addList(newCount)       
        const wcRef = firestore.collection(`users/${props.currentUser.uid}/projects/${props.currentProject.id}/wordcount`)
        wcRef.add({
            count: parseInt(newCount),
            timestamp: firebase.firestore.Timestamp.now()
        }).then(function(){
            console.log('New count added!')
          }).catch(function(error) {
            console.error('Error adding new count: '+error)
          })
    }

    const handleInputChange = input => {
        setNewCount(parseInt(input))
    }

    const handleClick = () => {
        newCount !== 0 && AddCount(newCount)        
    }

    return (<>
        <FormControl label={()=> 'Add a new wordcount update'}>
        <Input overrides={{
          Root: {
            style: {
              width: '30%',
              marginRight: theme.sizing.scale400,
            },
          },
        }}
        endEnhancer="words" type="number" name="new_count" placeholder="" value={newCount} onChange={(e) => handleInputChange(e.target.value)} clearable />        
        </FormControl>
        <Button 
        onClick={() => handleClick()}
        endEnhancer={()=> <Plus size={18} />}>
            Add Word Count</Button>
    </>)

}