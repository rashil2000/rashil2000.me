import EntityDisplay from '../../components/EntityDisplay'
import { EntityTypes, getBlog, getBlogs } from '../../lib/commonUtils'

export default function Blog({ blog }) {
  return <EntityDisplay entity={blog} entityType={EntityTypes.Blog} />;
}

export const getStaticPaths = async () => (
  {
    paths: await getBlogs(true),
    fallback: true
  }
);

export const getStaticProps = async context => {
  const blog = await getBlog(context.params.slug);

  if (!blog) {
    return {
      notFound: true
    };
  }

  return {
    props: { blog }
  };
};
