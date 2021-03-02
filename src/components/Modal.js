import { React } from'react'

export const Modal = (props) => {

    return (<>
        <div className='fixed left-0 top-0 z-10 inset-0 w-full h-100 min-w-screen min-h-screen overflow-hidden bg-gray-900 bg-opacity-50 flex items-center justify-center'>
            
        
        <div className='container rounded-lg bg-white p-8 z-20 absolute shadow-lg max-w-sm w-auto'>
                <div className='rounded-t-lg p-6'>
                    {props.title &&
                    <div className='text-xl font-semibold pb-6'>{props.title}</div>
                    }   
                    {props.children}
                </div>
            </div>
            </div>
        </>
    )
}