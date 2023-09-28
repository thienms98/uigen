export interface Section {
  key: string,
  title: string, 
  amount: number, 
  imageUrl: string
}

export interface PreviewItem {
  section: string,
  component: number
}