'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { PAGE_SECTIONS } from './config'
import { addItem, deleteItem, addComponentToPosition } from '@/store/preview';
import {  setDragOver, setDraggingComponent} from '@/store/drag'
import Container from '@/components/Container';
import Preview from '@/components/Preview';


export default function Home() {
  const {dragItem, dragOver, draggingComponent} = useSelector((state: RootState) => state.drag);
  const preview = useSelector((state: RootState) => state.preview);
  const dispatch = useDispatch();

  const [chosenSection, setChosenSection] = useState<number>(0)
  const sectionComponents = useMemo(() => {
    return Array.apply(null, Array(PAGE_SECTIONS[chosenSection].amount)).map((item, index) => index)
  }, [chosenSection])

  return (
    <main className="flex min-h-screen flex-row p-2">
      <Container className='flex-1 transition-all'>
        <div className="h-10 text-center shadow-md mb-3 py-3">Sections</div>
        <div className="h-full overflow-y-auto flex flex-col gap-2" style={{scrollbarWidth: 'thin'}}>
          {PAGE_SECTIONS.map((section, index) => (
            <div 
              key={section.title} 
              className={ chosenSection === index
                ? 
                // 'border-4 border-blue-600 cursor-pointer'
                  'bg-blue-200 text-white select-none'
                : 'border-[1px] border-black cursor-pointer select-none'
              }
              onClick={()=>setChosenSection(index)}
            >
              <div className="text-center">
                {section.title}
              </div>
              <div className='relative w-[80%] pb-[calc(56.25%_*_.8)] m-auto' draggable={false}>
                <Image 
                  src={section.imageUrl} 
                  alt={section.title} 
                  fill={true} 
                  sizes='width: 100px'
                  className='object-contain'
                  draggable='false'
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
      <Container className='basis-[10%] md:basis-[20%] transition-all'>
        <div className="h-10 text-center shadow-md mb-3 py-3">Comp<span className='hidden md:inline'>onents</span></div>
        <div className="h-full overflow-y-auto px-3 flex flex-col gap-2" style={{scrollbarWidth: 'thin'}}>
          {sectionComponents.map(component => {
            const index = preview.findIndex(({section, component: id}) => section === PAGE_SECTIONS[chosenSection].key && component === id)
            const selected = index !== -1
            return <div 
              key={component} 
              className={`py-1 md:py-3 text-center border-[1px] rounded-md hover:bg-slate-300 cursor-pointer select-none ${selected ? 'bg-blue-200 text-black' : 'border-black bg-white'}`}
              onClick={()=>{
                if(selected) dispatch(deleteItem({position: index}))
                else dispatch(addItem({
                  section: PAGE_SECTIONS[chosenSection].key,
                  component: component
                })
              )}}
              draggable={!(selected)}
              onDragStart={() => dispatch(setDraggingComponent({section: PAGE_SECTIONS[chosenSection].key, component}))}
              onDragEnd={() => {
                if(draggingComponent && (dragOver === -100)){
                  dispatch(addComponentToPosition({component: draggingComponent, position: 0}))
                }
                if(draggingComponent && dragOver > -1){
                  dispatch(addComponentToPosition({component: draggingComponent, position: dragOver}))
                }
                dispatch(setDraggingComponent(null))
                dispatch(setDragOver(-1))
                // dispatch(set)
                // set dragging component = null
              }}
            >
              <span className='hidden md:inline'>{PAGE_SECTIONS[chosenSection].key}</span>{component}
            </div>
          })}
        </div>
      </Container>
      <Container className="flex-[2] pl-5">
        <Preview />
      </Container>
    </main>
  )
}
