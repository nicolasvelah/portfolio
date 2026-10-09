import Nav from './components/Nav'
import Grain from './components/Grain'
import CustomCursor from './components/CustomCursor'
import PaperCityHero from './sections/PaperCityHero'
import Manifesto from './sections/Manifesto'
import WorkTrack from './sections/WorkTrack'
import Bridge from './sections/Bridge'
import Drawings from './sections/Drawings'
import Experience from './sections/Experience'
import Lab from './sections/Lab'
import Archive from './sections/Archive'
import ContactFooter from './sections/ContactFooter'
import { useReveal } from './lib/useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <a
        href="#work"
        className="sr-only z-[110] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to work
      </a>
      <CustomCursor />
      <Grain />
      <Nav />
      <main>
        <PaperCityHero />
        <Manifesto />
        <WorkTrack />
        <Bridge />
        <Drawings />
        <Experience />
        <Lab />
        <Archive />
      </main>
      <ContactFooter />
    </>
  )
}
