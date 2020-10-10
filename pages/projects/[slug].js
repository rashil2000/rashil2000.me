import Head from 'next/head'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import { dateString, getSlugPaths, getProject } from '../../lib/utils'
import CodeBlock from '../../lib/CodeBlock'

export default function Project({ project }) {
  return (
    <div>
      <Head>
        <title>{project.title} - rashil2000</title>
        <meta name="description" content={project.description} />
      </Head>

      <header>
        <p className="author">
          <a target="_blank" rel="noopener" href={`https://github.com/${project.github}`} style={{ textDecoration: 'none', fontStyle: 'italic' }}>
            Last commit: {dateString(project.date)}
          </a>
        </p>
      </header>

      <main>
        <ReactMarkdown source={project.content} renderers={{ code: CodeBlock }} />
        <br /><br />
      </main>

      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href="/projects"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Projects</p></a></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = await getSlugPaths('projects');

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context) {
  const project = await getProject(context.params.slug);

  return {
    props: { project },
    revalidate: 1
  }
}
