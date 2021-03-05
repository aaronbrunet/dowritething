import { React } from'react'

export const Modal = (props) => {
    var classes = ''
    !props.width && (classes += 'w-auto')
    props.width === 'sm' && (classes += `w-1/3`)
    props.width === 'md' && (classes += `w-1/2`)
    props.width === 'lg' && (classes += `w-3/4`)

    const actions = props.actions

    return (<>
        <div className='fixed left-0 top-0 z-10 inset-0 w-full h-100 min-w-screen min-h-screen overflow-hidden bg-gray-900 bg-opacity-50 flex items-center justify-center'>
            <div className={`container rounded-lg bg-white p-8 z-20 absolute shadow-lg ${classes}`}>
                <div className='rounded-t-lg p-6'>
                    <div id='modal-title-bar' className='flex-row py-4 align-middle'>
                    {props.title && 
                    (<div className='flex flex-row align-middle'>
                        <div className='inline-flex text-xl font-semibold align-middle py-2 mr-8'>
                            {props.title}
                        </div>
                        {props.delete && <button className='inline-flex h-3/4 justify-center align-middle items-center shadow bg-spring-wood-800 text-white text-xs rounded px-4 py-2 m-2 hover:text-spring-wood-800 hover:bg-white'>Delete</button>
                       }
                    </div>
                    )}   
                    </div>
                    <div id='modal-body' className='flex-row'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    </>)
}