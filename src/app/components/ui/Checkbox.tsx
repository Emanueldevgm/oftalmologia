"use client"

import type { InputHTMLAttributes, DetailedHTMLProps } from 'react'

interface CheckboxProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

export default function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-stroke text-primary focus:ring-primary ${className}`}
      {...props}
    />
  )
}
