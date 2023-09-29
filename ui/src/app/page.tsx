'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addItem, deleteItem, addComponentToPosition } from '@/store/preview';
import {  setDragOver, setDraggingComponent} from '@/store/drag'
import Container from '@/components/Container';
import Preview from '@/components/Preview';
import axios from 'axios';
import { PAGE_SECTIONS } from './config';


export default function Home() {
  const { dragOver, draggingComponent } = useSelector((state: RootState) => state.drag);
  // const preview = useSelector((state: RootState) => state.preview);
  const dispatch = useDispatch();

  const [chosenSection, setChosenSection] = useState<number>(0)
  const [pageSections, setPageSections] = useState<{section: string, imageUrl: string, components: string[]}[]>([])

  useEffect(() => {
    axios('http://localhost:3232/layouts')
      .then(({data}) => {
        const {tailwindLayouts: layouts}: {tailwindLayouts: string[]} = data
        const sections = new Set(layouts.map((item:string) => 
            item.replace(/\d+/, '')
          )
        )
        const result:{section: string, imageUrl:string, components: string[]}[] = [];
        Array.from(sections).forEach(section => {
          result.push({
            section,
            components: layouts.filter(item => item.startsWith(section)),
            imageUrl: PAGE_SECTIONS.find(item => item.key === section)?.imageUrl || ''
          })
        })
        setPageSections(result)
      })
  })

  return (
    <main className="flex min-h-screen flex-row p-6">
      <Container className='flex-1 transition-all'>
        <div className="h-10 text-center shadow-md mb-3 py-3">Sections</div>
        <div className="h-full overflow-y-auto flex flex-col gap-2" style={{scrollbarWidth: 'thin'}}>
          {pageSections.length > 0 && pageSections.map(({section, components, imageUrl}, index) => (
            <div 
              key={section} 
              className={ chosenSection === index
                ? 
                // 'border-4 border-blue-600 cursor-pointer'
                  'bg-blue-200 text-white select-none'
                : 'border-[1px] border-black cursor-pointer select-none'
              }
              onClick={()=>setChosenSection(index)}
            >
              <div className="text-center">
                {section}
              </div>
              <div className='relative w-[80%] pb-[calc(56.25%_*_.8)] m-auto' draggable={false}>
                <Image 
                  src={imageUrl}
                  alt={section} 
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
          {pageSections[chosenSection]?.components && pageSections[chosenSection].components.length > 0 && pageSections[chosenSection].components.map((component, index) => {
            // const index = preview.findIndex(({section, component: id}) => section === PAGE_SECTIONS[chosenSection].key && component === id)
            // const selected = index !== -1
            return <div 
              key={component} 
              className={`py-1 md:py-3 text-center border-[1px] rounded-md hover:bg-slate-300 cursor-pointer select-none border-black bg-white`}
              onClick={()=>{
                // if(selected) dispatch(deleteItem({position: index}))
                // else 
                dispatch(addItem({
                  section: pageSections[chosenSection].section,
                  component: index+1
                })
              )}}
              draggable
              onDragStart={() => dispatch(setDraggingComponent({section: pageSections[chosenSection].section, component: index+1}))}
              onDragEnd={() => {
                if(draggingComponent && (dragOver === -100)){
                  dispatch(addComponentToPosition({component: draggingComponent, position: 0}))
                }
                if(draggingComponent && dragOver > -1){
                  dispatch(addComponentToPosition({component: draggingComponent, position: dragOver}))
                }
                dispatch(setDraggingComponent(null))
                dispatch(setDragOver(-1))
              }}
            >
              <span className='hidden md:inline'>{pageSections[chosenSection].section}</span>{index+1}
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
