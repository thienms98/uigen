import {MouseEvent, useEffect, useRef} from 'react'

const Modal = ({children, className='', open, onAccept, onCancel}: {children: React.ReactNode, className?: string, open: boolean, onAccept?: Function, onCancel?: Function}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const exitModal:EventListener = (e: Event) => {
      if(modalRef.current && !modalRef.current.contains(e.target as Node)){
        onCancel && onCancel()
      }
    }
    window.addEventListener('mousedown', exitModal)
    return () => window.removeEventListener('mousedown', exitModal)
  }, [])

  return <div className={`relative ${className}`} ref={modalRef} >
    {children}
    {open && <div className="absolute border-[1px] border-black top-full right-0 bg-white p-3 flex flex-row justify-between gap-2">
      <div 
        className="border-[1px] border-black cursor-pointer px-2 text-sm min-w-10 text-center text-white bg-gray-200 hover:bg-gray-600"
        onClick={()=> onCancel && onCancel()}>&times;</div>
      <div 
        className="border-[1px] border-black cursor-pointer px-2 text-sm min-w-10 text-center text-white bg-red-400 hover:bg-red-500" 
        onClick={()=> onAccept && onAccept()}>√</div>
    </div>}
  </div>;
};

export default Modal;
