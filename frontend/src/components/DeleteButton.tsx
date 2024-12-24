import { ReactNode } from 'react'

interface Props{
    children: ReactNode
    color?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
}

export default function DeleteButton({children, color, onClick}: Props) {
  return (
    <button type="button" className={"btn btn-"+color} onClick={onClick}>{children}</button>
  )
}
