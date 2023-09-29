'use client'

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store';
import { clearPreview, deleteItem, moveItem } from '@/store/preview';
import { setDragItem, setDragOver, setDraggingComponent} from '@/store/drag'
import axios from 'axios';
import Modal from './Modal';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

export default function Preview(){
  const dispatch = useDispatch()
  const preview = useSelector((state: RootState) => state.preview);
  const {dragItem, dragOver, draggingComponent} = useSelector((state: RootState) => state.drag);
  
  const [removeModal, setRemoveModal] = useState<boolean>(false)
  const [clearModal, setClearModal] = useState<boolean>(false)
  const [savingProcess, setSavingProcess] = useState<-1|0|1>(0) // -1: saving, 0:idle, 1:saved

  const saveLayout = () => {
    if(preview.length < 1) return;
    const data:string = JSON.stringify({
      layouts: preview.map(({section, component}) => `${section}${component}`)
    })
    console.log(data);
    setSavingProcess(-1)
    
    axios({
      method: 'post',
      url: 'http://localhost:3232/generate',
      data,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
      .then(() => {
        setSavingProcess(1)
        setTimeout(() => {
          setSavingProcess(0)
        }, 1500);
      })
      .catch(err => setSavingProcess(0))
  }
  const saveButton = () => {
    if(savingProcess === 1) return <>Saved</>
    if(savingProcess === -1) return <>Saving <div className='inline-block animate-spin'>X</div></>
    return <>Save</>
  }
  const onDragEnd = (result:any) => console.log(result)
  const grid = 8
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
  
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });
  
  const getListStyle = (isDraggingOver:boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
  });
  return <>
    <div 
      className='flex flex-row-reverse flex-end gap-2 relative shadow-md pb-2 z-20'
    >
      <button className='px-4 py-2 rounded-md bg-green-400 hover:bg-green-500 text-white'
        onClick={saveLayout}
      >
        {saveButton()}
      </button>
      <Modal open={clearModal} onAccept={() => {
        dispatch(clearPreview())
        setClearModal(false)
      }} onCancel={() => setClearModal(false)}>
        <button className='px-4 py-2 rounded-md active:bg-red-400 bg-white text-black border-[1px] border-black' style={{transition: 'all 1s ease-in'}}
          onClick={()=>setClearModal(true)}
          title='Hold to clear'
        >
          Clear
        </button>
      </Modal>
      {(dragItem >= 0 || draggingComponent) && <>
        <button 
          className='px-4 py-2 rounded-md bg-red-500 text-white justify-self-end  '
          onDragOver={() => dispatch(setDragOver(-1))}
        >
          Cancel
        </button>
        <button 
          className='px-4 py-2 rounded-md bg-red-500 text-white justify-self-end  '
          onDragOver={() => dispatch(setDragOver(-2))}
        >
          Remove
        </button>
      </>}
    </div>
    <div 
      className={`h-full overflow-y-auto flex flex-col gap-2 bg-zinc-400/50 px-[10%] xl:px-[17.5%] 3xl:px-[25%] py-5 relative`} 
      style={{scrollbarWidth: 'thin'}}
    >
      {
      preview.map(({section, component}, index) => (
        <div
          key={`${section}${component}${index}`}
          className={`flex ${dragItem > -1 ? (dragOver < dragItem ? 'flex-col' : 'flex-col-reverse') : 'flex-col'} gap-3`}
        >
          {dragOver === index && (dragItem > -1 || draggingComponent) && <div className="flex flex-row">
            <div className="basis-[20px]"></div>
            <div className="flex-1 w-full pt-[45%] border-dotted border-4 border-black"></div>
          </div>}
          <div
            className='flex flex-row flex-wrap group'
            draggable
            onDragStart={() => {
              dispatch(setDragItem(index))
            }}
            onDragOver={() => {
              dispatch(setDragOver(index))
            }}
            onDragEnd={() => {
              if(dragOver === -2) dispatch(deleteItem({position: dragItem}))
              if(dragOver > -1)
                dispatch(moveItem({lastPosition: dragItem, nextPosition: dragOver}))
              dispatch(setDragItem(-1))
              dispatch(setDragOver(-1))
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
     {/* <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {preview.map((item, index) => (
                <Draggable key={item.section+item.component} draggableId={item.section+item.component} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.section+item.component}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext> */}
    {draggingComponent &&
      <div className="flex flex-row"
        onDragOver={() => dispatch(setDragOver(preview.length === 0 ? -100 : 100))}
      >
        <div className="basis-[20px]"></div>
        <div className={`flex-1 w-full pt-[45%] ${(dragOver === 100 || dragOver === -100) && 'border-dotted border-4 border-black'}`}></div>
      </div>
    }
    </div>
  </>
}