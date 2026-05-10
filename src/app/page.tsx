import React from 'react'
import Hero from '@/app/components/Home/Hero'
import Services from '@/app/components/Home/Services'
import Stats from '@/app/components/Home/Stats'
import Doctors from '@/app/components/Home/Doctors'
import About from '@/app/components/Home/About'
import CTA from '@/app/components/Home/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Stats />
      <Doctors />
      <About />
      <CTA />
    </>
  )
}