import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";
import { DiscussionEmbed } from 'disqus-react'

import { baseUrl, dateString, getProject, getProjects } from '../../lib/utils'

export default function Project({ project }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed initially until static props are fetched
  if (router.isFallback) {
    return (
      <div>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content="Loading project data..." />
        </Head>
        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>Loading project data, please wait...</p>
            <br />
          </div>
          <br /><br />
        </main>
        <footer>
          <table id="no-border" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td id="no-border" style={{ width: "50%" }}><Link href="/projects"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Projects</p></Link></td>
                <td id="no-border" style={{ width: "50%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
              </tr>
            </tbody>
          </table>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{`${project.title} - rashil2000`}</title>
        <meta name="description" content={project.description} />
        <meta property="og:image" content={project.preview} />
      </Head>
      <header>
        <p className="author">
          <a target="_blank" rel="noopener" href={`https://github.com/${project.github}`} style={{ fontStyle: 'italic' }}>
            {`Last commit: ${dateString(project.date)}`}
          </a>
        </p>
      </header>
      <main id="markdown-box">
        <MarkdownHooks children={project.content} rehypePlugins={[rehypeStarryNight]}/>
        <br />
      </main>
      <DiscussionEmbed
        shortname='rashil2000'
        config={
          {
            url: `${baseUrl}/projects/${project.slug}`,
            identifier: `/project/${project.slug}`,
            title: project.title,
          }
        }
      />
      <br />
      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href="/projects"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Projects</p></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  );
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
