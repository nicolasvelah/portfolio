import site from '../../../content/site.json';

export default function Footer() {
  return (
    <footer style={{padding: '24px', textAlign: 'center', opacity: .7}}>
      <nav className="links">
        <a href={site.links.github} target="_blank">GitHub</a>
        <a className='mx-5' href={site.links.linkedin} target="_blank">LinkedIn</a>
        <a href={site.links.email}>Email</a>
      </nav>
      © {new Date().getFullYear()} · {site.name}
    </footer>
  );
}
