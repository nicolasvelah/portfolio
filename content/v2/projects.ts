// Tarjetas del track "Selected work" (handoff Paper City §3; copy final del handoff).
// Las imágenes son las versiones redactadas de public/media (npm run media).

export interface PhoneShot {
  /** nombre base en public/media: w-<name>@1x.webp / @2x.webp */
  name: string
  alt: string
  /** transformación del marco (rotación + desplazamiento) */
  tf: string
  /** profundidad del parallax interno */
  par: number
}

/** Pantalla dentro de una composición superpuesta (stack). */
export interface StackShot {
  name: string
  alt: string
  /** posición y ancho dentro del panel (porcentajes) */
  pos: { left?: string; right?: string; top?: string; bottom?: string; width: string }
  tf: string
  par: number
}

export type TrackMedia =
  | { kind: 'phones'; shots: PhoneShot[] }
  | { kind: 'wide'; name: string; alt: string }
  | { kind: 'stack'; shots: StackShot[]; note: string }

export interface TrackProject {
  slug: string
  num: string
  title: string
  angle: string
  role: string
  status: string
  stack: string[]
  media: TrackMedia
}

export const projects: TrackProject[] = [
  {
    slug: 'aseguradora-del-sur',
    num: '01',
    title: 'Aseguradora del Sur',
    angle: 'From three panic buttons to a connected-car platform.',
    role: 'UX + front-end lead · real-time back end · infrastructure',
    status: 'Shipped',
    stack: ['React', 'TypeScript', 'Node / Express', 'WebSockets', 'Flutter', 'Linux server'],
    media: {
      kind: 'phones',
      shots: [
        { name: 'asdr-rating', alt: 'Driver score: 3.45 stars, with expandable rows for speeding, hard braking and acceleration, and a weekly braking chart.', tf: 'rotate(-6deg) translateY(14px)', par: 0.4 },
        { name: 'asdr-score', alt: 'Driving statistics: yearly and weekly distance charts and time split by weekday.', tf: 'rotate(2deg) translateY(-18px)', par: 0.8 },
        { name: 'asdr-services', alt: 'Report menu: breakdown, crash, theft, and a safe-escort service.', tf: 'rotate(7deg) translateY(10px)', par: 1.1 },
      ],
    },
  },
  {
    slug: 'maresa-guc',
    num: '02',
    title: 'Maresa GUC',
    angle: "A dealership's sales process, modeled as a state machine.",
    role: 'Process mapping, UX, React lead, infrastructure · team of 3',
    status: 'Shipped',
    stack: ['React', 'TypeScript', 'Ant Design', 'Node', 'SignalR', 'Windows Server'],
    media: {
      kind: 'wide',
      name: 'guc-delivery',
      alt: 'GUC delivery stage: a seven-step pipeline stepper from inquiry to delivery, deal details and the vehicle being delivered.',
    },
  },
  {
    slug: 'ai-timetracker',
    num: '03',
    title: 'AI-TimeTracker',
    angle: 'Director, PM, designer and developer. Then Tech Lead. Kickoff to pilot in under a month.',
    role: 'Now · Capmation · lead, CI/CD & infrastructure',
    status: 'In production',
    stack: ['Nuxt', 'Azure', 'Azure DevOps', 'GitHub Actions', 'Entra ID', 'Linux server'],
    media: {
      kind: 'stack',
      note: 'Production screens · company details removed',
      shots: [
        {
          name: 'tt-dashboard',
          alt: 'Dashboard: date-range filters, a manager view switch, KPI tiles for total hours, overtime and missing-log flags, and charts of hours by weekday and by project.',
          pos: { left: '3%', top: '7%', width: '86%' },
          tf: 'rotate(-2deg)',
          par: 0.4,
        },
        {
          name: 'tt-timelog',
          alt: 'Time Log: a daily table of entries edited inline with project, area and AM/PM time pickers, the hours remaining of an 8-hour day, and a week strip with daily totals.',
          pos: { right: '3%', bottom: '7%', width: '70%' },
          tf: 'rotate(2deg)',
          par: 1,
        },
      ],
    },
  },
  {
    slug: 'aerialoop',
    num: '04',
    title: 'Aerialoop',
    angle: 'Real-time drone-delivery tracking across mobile, web and B2B.',
    role: 'Product design, front-end & infrastructure',
    status: 'Shipped',
    stack: ['Vue 3', 'TypeScript', 'Maps', 'Real-time', 'Linux server'],
    media: {
      kind: 'phones',
      shots: [
        { name: 'aerialoop-login-3', alt: 'Landing: a drone carrying a burger, and an address field to start an order.', tf: 'rotate(-5deg) translateY(-10px)', par: 0.5 },
        { name: 'aerialoop-home', alt: 'Customer home: the Quito hub address and a map of the drone route to the delivery point.', tf: 'rotate(1deg) translateY(16px)', par: 0.9 },
        { name: 'aerialoop-login-4', alt: 'Sign-up step after entering an address.', tf: 'rotate(6deg) translateY(-14px)', par: 1.2 },
      ],
    },
  },
  {
    slug: 'document-folders',
    num: '05',
    title: 'Document Folders',
    angle: 'Designing for the irreversible: document control for a licensed cultivation-to-distribution business, where every file is audit evidence.',
    role: 'UX, Figma prototype + Angular front end · Capmation',
    status: 'Shipped',
    stack: ['Angular', '.NET', 'Azure', 'Figma'],
    media: {
      kind: 'stack',
      note: 'Original Figma design · client details removed',
      shots: [
        {
          name: 'df-tree',
          alt: 'Reference Document Folders: a nested tree of folders, files, content and links with last update, state and owner columns, archive view and search.',
          pos: { left: '4%', top: '7%', width: '86%' },
          tf: 'rotate(-1.5deg)',
          par: 0.4,
        },
        {
          name: 'df-delete',
          alt: 'Delete confirmation: a warning icon, the exact folders and files that will be removed, and a checkbox that must be ticked before the Delete button unlocks.',
          pos: { right: '4%', bottom: '8%', width: '54%' },
          tf: 'rotate(3deg)',
          par: 1.1,
        },
      ],
    },
  },
]
