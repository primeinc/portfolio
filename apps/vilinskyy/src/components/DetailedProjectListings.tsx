import ExpandableProjectSection from './ExpandableProjectSection'
import {
  DECIPAD_PROJECT_VISUAL,
  GRAMMARLY_PROJECT_VISUAL,
} from '../assets/svgData'

const projects = [
  {
    id: '1',
    summary: { title: 'Decipad', shortDescription: 'Data storytelling app.' },
    detail: {
      longDescription: 'Detailed description of Decipad project.',
      images: [DECIPAD_PROJECT_VISUAL],
    },
  },
  {
    id: '2',
    summary: { title: 'Grammarly', shortDescription: 'Writing assistant.' },
    detail: {
      longDescription: 'Long details about Grammarly work.',
      images: [GRAMMARLY_PROJECT_VISUAL],
    },
  },
]

export default function DetailedProjectListings() {
  return (
    <section>
      {projects.map((p) => (
        <ExpandableProjectSection key={p.id} project={p} />
      ))}
    </section>
  )
}
