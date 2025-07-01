import EntityLister from '../../components/EntityLister'
import { EntityTypes, getBlogs } from '../../lib/commonUtils'

export default function Blogs({ blogs }) {
  return (
    <EntityLister 
      entityType={EntityTypes.Blog}
      entities={blogs}
      title="Random musings"
    />
  );
}

export const getStaticProps = async () => (
  {
    props: { blogs: await getBlogs(false) },
  }
)
