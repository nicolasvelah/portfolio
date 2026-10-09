// Única puerta de entrada al contenido de content/v2. Si el contenido cambia de forma,
// el typecheck falla aquí en vez de romper la UI en silencio.
import siteJson from '../content/v2/site.json'
import workJson from '../content/v2/work.json'
import labJson from '../content/v2/lab.json'
import archiveJson from '../content/v2/archive.json'
import aseguradora from '../content/v2/case-studies/aseguradora-del-sur.md'
import maresa from '../content/v2/case-studies/maresa-guc.md'
import documentFolders from '../content/v2/case-studies/document-folders.md'
import now from '../content/v2/now.md'
export { projects } from '../content/v2/projects'
export type { TrackProject, PhoneShot, StackShot, TrackMedia } from '../content/v2/projects'

export interface Cta { label: string; href: string; variant: 'primary' | 'secondary'; download?: boolean }
export interface SkillGroup { capability: string; detail: string; tools: string[] }
export interface Job { role: string; company: string; years: string; highlights: string[] }

export interface Site {
  name: string
  role: string
  hero: {
    kicker: string
    h1: string
    h1Lines: string[]
    lede: string
    ctas: Cta[]
    colophon: { credit: string; scene: string }
  }
  manifesto: { text: string; highlight: string }
  skills: {
    intro: string
    design: SkillGroup[]
    engineering: SkillGroup[]
    bridge: string[]
    bridgeCards: { design: string[]; engineering: string[]; aiTools: string[] }
    aiNative: { title: string; line: string }
  }
  experience: Job[]
  experienceBefore: { years: string; line: string }
  education: { degree: string; school: string; years: string; note: string }
  certifications: { name: string; year: string; status: string }[]
  contact: { line: string; email: string; linkedin: string; github: string; cv: string; location: string; locationLine: string }
}

export interface CaseStudy {
  slug: string
  title: string
  tagline: string
  client: string
  year: string
  role: string
  team: string
  status: string
  stack: string[]
  outcome: string
}

export interface NowBlock extends Omit<CaseStudy, 'client' | 'outcome'> {
  company: string
  section: string
}

export interface WorkCard {
  slug: string
  title: string
  oneLiner: string
  detail: string
  role: string
  stack: string[]
  year: string
  status: string
}

export interface LabItem {
  slug: string
  title: string
  year: string
  status: string
  stack: string[]
  oneLiner: string
  detail?: string
}

export interface ArchiveEntry { year: string; title: string; type: string; status: string; oneLiner: string }

export const site = siteJson as unknown as Site
export const work = workJson as { title: string; cards: WorkCard[] }
export const lab = labJson as { title: string; intro: string; items: LabItem[] }
export const archive = archiveJson as unknown as { title: string; intro: string; entries: ArchiveEntry[] }

export const caseStudies = [aseguradora, maresa, documentFolders].map((m) => m.frontmatter as unknown as CaseStudy)
export const nowBlock = now.frontmatter as unknown as NowBlock

/** Bullets de impacto del bloque Now: la lista que precede a "About the screens". */
export const nowImpact: string[] = now.body
  .split('**About the screens.**')[0]
  .split('\n')
  .filter((l) => l.startsWith('- '))
  .map((l) => l.slice(2).trim())
