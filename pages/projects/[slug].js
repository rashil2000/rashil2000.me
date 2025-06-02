import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";
import { DiscussionEmbed } from 'disqus-react'

import { dateString, getSlugPaths, getProject } from '../../lib/utils'

export default function Project({ project }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed initially until static props are fetched
  if (router.isFallback) {
    return (
      <div>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content="Building page..." />
        </Head>
        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>This page is getting built, please wait for a while. It'll reload itself.</p>
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
        <title>{project.title} - rashil2000</title>
        <meta name="description" content={project.description} />
        <meta property="og:image" content={project.preview} />
      </Head>
      <header>
        <p className="author">
          <a target="_blank" rel="noopener" href={`https://github.com/${project.github}`} style={{ fontStyle: 'italic' }}>
            Last commit: {dateString(project.date)}
          </a>
        </p>
      </header>
      <main>
        <MarkdownHooks id="markdown-box" children={project.content} rehypePlugins={[rehypeStarryNight]}/>
        <br />
      </main>
      <DiscussionEmbed
        shortname='rashil2000'
        config={
          {
            url: `https://rashil2000.me/project/${project.slug}`,
            identifier: `/blog/${project.slug}`,
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
    paths: await getSlugPaths('projects'),
    fallback: true
  }
);

export const getStaticProps = async context => (
  {
    props: { project: await getProject(context.params.slug) },
    revalidate: 1
  }
);
