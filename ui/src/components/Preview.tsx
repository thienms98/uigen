'use client'

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store';
import { clearPreview, deleteItem, moveItem } from '@/store/preview';
import axios from 'axios';

export default function Preview(){
  const dispatch = useDispatch()
  const preview = useSelector((state: RootState) => state.preview);

  const [dragItem, setDragItem] = useState<number>(-1)
  const [dragOver, setDragOver] = useState<number>(-1)

  const saveLayout = () => {
    if(preview.length < 1) return;
    const data:string = JSON.stringify({
      layouts: preview.map(({section, component}) => `${section}${component}`)
    })
    console.log(data);
    
    axios({
      method: 'post',
      url: 'http://localhost:3232/generate',
      data,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
      .then(() => console.log('ok'))
      .catch(err => console.log('err'))
  }
  let holdToClear:any;
  
  return <>
    <div className='flex flex-row-reverse flex-end gap-2 relative shadow-md pb-2 z-20 '>
      <button className='px-4 py-2 rounded-md bg-green-400 hover:bg-green-500 text-white'
        onClick={saveLayout}
      >Save</button>
      <button className='px-4 py-2 rounded-md active:bg-red-400 bg-white text-black border-[1px] border-black' style={{transition: 'all 1s ease-in'}}
        onMouseDown={() => holdToClear = setTimeout(()=>dispatch(clearPreview()), 1000)}
        onMouseUp={() => clearTimeout(holdToClear)}
        title='Hold to clear'
      >Clear</button>
      {dragItem >= 0 && <>
        <button 
          className='px-4 py-2 rounded-md bg-red-500 text-white justify-self-end  '
          onDragOver={() => setDragOver(-1)}
        >
          Cancel
        </button>
        <button 
          className='px-4 py-2 rounded-md bg-red-500 text-white justify-self-end  '
          onDragOver={() => setDragOver(-2)}
        >
          Remove
        </button>
      </>}
    </div>
    <div className='h-full overflow-y-auto flex flex-col gap-2 bg-zinc-400/50 px-[10%] py-5 relative' style={{scrollbarWidth: 'thin'}}>
      {
      preview.map(({section, component}, index) => (
        <div
          key={`${section}${component}${index}`}
          className={`flex ${dragOver < dragItem ? 'flex-col' : 'flex-col-reverse'} gap-3 }`}
        >
          {dragOver === index && dragItem > -1 && <div className="flex flex-row">
            <div className="basis-[20px]"></div>
            <div className="flex-1 min-h-[40px] border-dotted border-4 border-black"></div>
          </div>}
          <div
            className='flex flex-row flex-wrap group'
            draggable
            onDragStart={() => {
              setDragItem(index)
            }}
            onDragOver={() => {
              setDragOver(index)
            }}
            onDragEnd={() => {
              if(dragOver === -2) dispatch(deleteItem({position: dragItem}))
              if(dragOver > -1)
                dispatch(moveItem({lastPosition: dragItem, nextPosition: dragOver}))
              setDragItem(-1)
              setDragOver(-1)
            }}
          >
            <div className='basis-[20px] invisible group-hover:visible flex flex-col justify-center select-none'>
              <div
                className='cursor-pointer text-center hover:bg-slate-100'
                onClick={()=>dispatch(moveItem({lastPosition: index, nextPosition: index-1}))}
              >
                <span className='block rotate-90 origin-center'>&lt;</span>
              </div>
              <div
                className='cursor-pointer text-center hover:bg-slate-100'
                onClick={()=>dispatch(moveItem({lastPosition: index, nextPosition: index+1}))}
              >
                <span className='block rotate-90 origin-center'>&gt;</span>
              </div>
            </div>
            <div
              className='flex-1 pb-[45%] text-center border-[1px] border-black rounded-md hover:bg-slate-200 cursor-pointer relative group/item select-none bg-white'
            >
              <div>
                {section}{component}
              </div>
              <div
                className="absolute w-4 h-4 rounded-full border-[1px] border-black right-[-4px] top-[-4px]  hidden group-hover/item:flex items-center justify-center bg-white hover:bg-red-600 hover:text-white"
                onClick={()=>dispatch(deleteItem({position: index}))}
              >
                &times;
              </div>
            </div>
          </div>
        </div>
      ))
    }
    </div>
  </>
}