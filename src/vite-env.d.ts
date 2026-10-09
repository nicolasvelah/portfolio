/// <reference types="vite/client" />

declare module '*.md' {
  const content: { frontmatter: Record<string, unknown>; body: string }
  export default content
}
