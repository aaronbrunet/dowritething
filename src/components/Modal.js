import { React, useState } from'react'

export const Modal = (props) => {

    return (
        <div id='modal-wrapper'>
            <p>I'm a modal wrapper!</p>
            {props.children}
        </div>
    )
}