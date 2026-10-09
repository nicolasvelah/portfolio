import { useEffect, useRef, useState } from 'react'

// Recreación con datos ficticios del módulo de carpetas documentales.
// La idea de diseño: lo irreversible pide confirmación explícita, y aun así ofrece deshacer.
interface Folder { id: string; name: string; files: string[]; archived?: boolean }

const SEED: Folder[] = [
  { id: 'a', name: 'Policies', files: ['Data retention policy.pdf', 'Access control matrix.xlsx'] },
  { id: 'b', name: 'Audit 2025', files: ['Q1 findings.pdf', 'Evidence index.csv', 'Remediation plan.docx'] },
  { id: 'c', name: 'Templates', files: ['Board resolution.docx'] },
]

export default function FolderTreeDemo() {
  const [folders, setFolders] = useState(SEED)
  const [open, setOpen] = useState<Record<string, boolean>>({ a: true })
  const [pending, setPending] = useState<Folder | null>(null)
  const [ack, setAck] = useState(false)
  const [undo, setUndo] = useState<{ folder: Folder; index: number } | null>(null)
  const checkRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (pending) checkRef.current?.focus()
  }, [pending])

  useEffect(() => {
    if (!undo) return
    const t = window.setTimeout(() => setUndo(null), 6000)
    return () => window.clearTimeout(t)
  }, [undo])

  const toggleArchive = (id: string) => setFolders((fs) => fs.map((f) => (f.id === id ? { ...f, archived: !f.archived } : f)))
  const confirmDelete = () => {
    if (!pending) return
    const index = folders.findIndex((f) => f.id === pending.id)
    setFolders((fs) => fs.filter((f) => f.id !== pending.id))
    setUndo({ folder: pending, index })
    setPending(null)
    setAck(false)
  }
  const restore = () => {
    if (!undo) return
    setFolders((fs) => {
      const next = [...fs]
      next.splice(undo.index, 0, undo.folder)
      return next
    })
    setUndo(null)
  }
  const reset = () => {
    setFolders(SEED)
    setUndo(null)
  }

  return (
    <div className="relative min-h-[300px] p-4 text-sm sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium">Reference documents</p>
        <span className="font-mono text-xs text-neutral-700">{folders.length} folders</span>
      </div>

      <ul role="tree" aria-label="Folders" className="mt-3 border-y border-neutral-300">
        {folders.map((f) => (
          <li key={f.id} role="treeitem" aria-expanded={!!open[f.id]} aria-selected={false} className="border-b border-neutral-300 last:border-b-0">
            <div className={`group flex items-center gap-2 py-2 ${f.archived ? 'text-neutral-500' : ''}`}>
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [f.id]: !o[f.id] }))}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                aria-label={`${open[f.id] ? 'Collapse' : 'Expand'} ${f.name}`}
              >
                <span className={`inline-block w-3 font-mono text-xs transition-transform duration-200 ${open[f.id] ? 'rotate-90' : ''}`}>›</span>
                <span aria-hidden>▤</span>
                <span className="truncate">{f.name}</span>
                <span className="font-mono text-xs text-neutral-500">{f.files.length}</span>
                {f.archived && <span className="chip !bg-neutral-200 !py-0">Archived</span>}
              </button>
              <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                <button type="button" onClick={() => toggleArchive(f.id)} className="min-h-6 rounded px-2 py-1 font-mono text-xs text-neutral-800 hover:bg-neutral-200">
                  {f.archived ? 'Unarchive' : 'Archive'}
                </button>
                <button
                  type="button"
                  onClick={() => setPending(f)}
                  className="min-h-6 rounded px-2 py-1 font-mono text-xs text-accent-700 hover:bg-accent-100"
                >
                  Delete
                </button>
              </div>
            </div>
            {open[f.id] && (
              <ul role="group" className="pb-2 pl-10">
                {f.files.map((file) => (
                  <li key={file} role="treeitem" aria-selected={false} className="truncate py-0.5 text-neutral-800">
                    {file}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {folders.length < SEED.length && !undo && (
        <button type="button" onClick={reset} className="mt-2 font-mono text-xs text-neutral-700 hover:text-ink">
          ↺ Reset demo
        </button>
      )}

      {undo && (
        <div role="status" className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-md bg-ink px-4 py-2.5 text-bg shadow-lg">
          <span>“{undo.folder.name}” deleted</span>
          <button type="button" onClick={restore} className="font-mono text-xs uppercase tracking-wider text-accent-300 hover:text-white">
            Undo
          </button>
        </div>
      )}

      {pending && (
        <div className="absolute inset-0 grid place-items-center bg-ink/30 p-4 backdrop-blur-[2px]">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            aria-describedby="del-desc"
            onKeyDown={(e) => e.key === 'Escape' && (setPending(null), setAck(false))}
            className="w-full max-w-xs rounded-inset bg-white p-5 shadow-lg"
          >
            <p id="del-title" className="font-medium">Delete “{pending.name}”?</p>
            <p id="del-desc" className="mt-1 text-neutral-800">
              This removes {pending.files.length} document{pending.files.length === 1 ? '' : 's'} for every user with access.
            </p>
            <label className="mt-4 flex items-start gap-2 text-neutral-800">
              <input ref={checkRef} type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 accent-accent-600" />
              I understand this can’t be recovered after the undo window.
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => (setPending(null), setAck(false))} className="rounded-full px-3 py-1.5 text-xs hover:bg-neutral-200">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!ack}
                className="rounded-full bg-accent-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-800 disabled:bg-ink/15 disabled:text-neutral-700"
              >
                Delete folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
