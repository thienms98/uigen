export default function Container({children, className}: {children: React.ReactNode, className: string}) {
  return <div className={className}>
    <div className="w-full h-[calc(100vh_-_16px)] border-r-2 flex flex-col overflow-y-auto" style={{scrollbarWidth: 'thin'}}>
      {children}  
    </div>
  </div>
}