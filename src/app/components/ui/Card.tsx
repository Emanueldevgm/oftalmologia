'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

interface CardBaseProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
  onClick?: () => void
}

interface CardStaticProps extends CardBaseProps {
  hover?: false
}

interface CardHoverProps extends CardBaseProps {
  hover: true
}

type CardProps = CardStaticProps | CardHoverProps

function Card(props: CardProps) {
  const { children, className = '', glass = false, hover = false, onClick } = props

  const baseClasses = `
    rounded-2xl p-6 md:p-8
    ${glass
      ? 'glass'
      : 'bg-white border border-border shadow-sm'
    }
    ${hover ? 'cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:border-primary/10' : ''}
    ${className}
  `

  if (hover) {
    const motionProps: HTMLMotionProps<'div'> = {
      className: baseClasses,
      onClick,
      whileHover: { y: -4, scale: 1.01 },
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    }

    return <motion.div {...motionProps}>{children}</motion.div>
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  )
}

export { Card }
export type { CardProps }