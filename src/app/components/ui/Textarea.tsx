"use client"

import type { TextareaHTMLAttributes, DetailedHTMLProps } from 'react'

interface TextareaProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {}

export default function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-[120px] w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/10 ${className}`}
      {...props}
    />
  )
}
