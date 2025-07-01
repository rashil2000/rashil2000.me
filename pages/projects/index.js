import EntityLister from '../../components/EntityLister'
import { EntityTypes, getProjects } from '../../lib/commonUtils'

export default function Projects({ projects }) {
  return (
    <EntityLister 
      entityType={EntityTypes.Project}
      entities={projects}
      title="Stuff that's (seemingly) cool"
    >
        <div className="abstract">
          <h6 style={{ fontStyle: 'normal' }}>
            Some other projects that didn't make it here can be found on <a target="_blank" rel="noopener" href="https://rashil2000.github.io">rashil2000.github.io</a>.
          </h6>
        </div>
    </EntityLister>
  );
}

export const getStaticProps = async () => (
  {
    props: { projects: await getProjects(false) },
  }
)
