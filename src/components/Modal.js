import { React } from'react'

export const Modal = (props) => {
    var classes = ''
    !props.width && (classes += 'w-auto')
    props.width === 'sm' && (classes += `w-1/3`)
    props.width === 'md' && (classes += `w-1/2`)
    props.width === 'lg' && (classes += `w-3/4`)

    return (<>
        <div className='fixed left-0 top-0 z-10 inset-0 w-full h-100 min-w-screen min-h-screen overflow-hidden bg-gray-900 bg-opacity-50 flex items-center justify-center'>
            <div className={`container rounded-lg bg-white p-8 z-20 absolute shadow-lg ${classes}`}>
                <div className='rounded-t-lg p-6'>
                    {props.title && <div className='text-xl font-semibold pb-6'>{props.title}</div>}   
                    {props.children}
                </div>
            </div>
        </div>
    </>)
}