import EntityDisplay from '../../components/EntityDisplay'
import { EntityTypes, getProject, getProjects } from '../../lib/commonUtils'

export default function Project({ project }) {
  return <EntityDisplay entity={project} entityType={EntityTypes.Project} />;
}

export const getStaticPaths = async () => (
  {
    paths: await getProjects(true),
    fallback: true
  }
);

export const getStaticProps = async context => {
  const project = await getProject(context.params.slug);

  if (!project) {
    return {
      notFound: true
    };
  }

  return {
    props: { project }
  };
};
