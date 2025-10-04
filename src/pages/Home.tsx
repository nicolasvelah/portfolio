import { useRef } from 'react';
import ReactMarkdown from 'react-markdown'

import site from '../../content/site.json';

import HeaderBanner from '../components/animations/chacana/HeaderBanner'
import IslandWork from '../components/animations/island/IslandWork'

export default function Home() {
  return (
    <section className="min-w-screen m-auto">
      <IslandWork scale={1.2} autoRotate controls />
      <div className="max-w-2xl mx-auto px-5">
        <div className='headline mt-3 rounded font-lekton'>{site.hero.headline}</div>
        <div className='bio mt-8'>
          <h2 className='text-2xl font-semibold mb-0 font-lekton'>{site.name}</h2>
          <div className='subheadline font-lekton'>{site.bio.subheadline}</div>
          <div className='pt-4'>
            <ReactMarkdown>{site.bio.detail}</ReactMarkdown>
          </div>
        </div>
        <HeaderBanner height={260} />
      </div>
      
    </section>
  );
}
