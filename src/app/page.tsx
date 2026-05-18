import React from 'react'
import Hero from '@/app/components/Home/Hero'
import Services from '@/app/components/Home/Services'
import Stats from '@/app/components/Home/Stats'
import Doctors from '@/app/components/Home/Doctors'
import CTA from '@/app/components/Home/CTA'

export default function Home() {
  return (
    <main className="space-y-20 md:space-y-24 xl:space-y-28">
      <Hero />
      <Services />
      <Stats />
      <Doctors />
      <CTA />
    </main>
  )
}