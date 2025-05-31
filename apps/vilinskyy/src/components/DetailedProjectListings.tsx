import ExpandableProjectSection from './ExpandableProjectSection'

const projects = [
  {
    id: '1',
    summary: { title: 'Decipad', shortDescription: 'Data storytelling app.' },
    detail: {
      longDescription: 'Detailed description of Decipad project.',
      // Reuse gallery image data URIs for project visuals
      images: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiLz48L3N2Zz4K',
      ],
    },
  },
  {
    id: '2',
    summary: { title: 'Grammarly', shortDescription: 'Writing assistant.' },
    detail: {
      longDescription: 'Long details about Grammarly work.',
      images: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJncmVlbiIvPjwvc3ZnPgo=',
      ],
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
