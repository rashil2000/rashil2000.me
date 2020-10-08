import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../../lib/CodeBlock'

function getLastCommit(identifier) {
  const { data, error } = useSWR(`https://api.github.com/repos/${identifier}/commits`)
  if (error) return 'failed to load';
  if (!data) return 'loading...';
  const stringdate = new Date(data[0].commit.committer.date);
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export default function Project({ project }) {
  return (
    <div>
      <Head>
        <title>{project.title} - rashil2000</title>
        <meta name="description" content={project.description} />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
        <p className="author">
          <a target="_blank" rel="noopener" href={`https://github.com/${project.github}`} style={{ textDecoration: 'none', fontStyle: 'italic' }}>
            Last commit: {getLastCommit(project.github)}
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
  const res = await fetch(`${process.env.DB_HOST}/projects`);
  const projects = await res.json();

  const paths = projects.map(item => { return { params: { slug: item.slug } } });
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context) {
  const res = await fetch(`${process.env.DB_HOST}/projects/${context.params.slug}`);
  const project = await res.json();

  return {
    props: { project },
    revalidate: 1
  }
}
