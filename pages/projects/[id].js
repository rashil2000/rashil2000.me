import Head from 'next/head'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../../lib/CodeBlock'

export default function Project({ markdown }) {
  return (
    <div>
      <Head>
        <title>The Project Title - rashil2000</title>
        <link rel="icon" href="../favicon.ico" />
        <meta name="description" content="kuch to hoga idhar pata nahi" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
        <p className="author"><i>Last commit: 22 September 2020</i></p>
      </header>

      <main>
        <ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />
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
  const paths = ['/projects/1', '/projects/2', '/projects/3', '/projects/4'];
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps() {
  let markdown = require('fs').readFileSync(require('path').join(process.cwd(), 'temp/project.md'), 'utf-8')

  return {
    props: {
      markdown
    },
    revalidate: 1
  }
}
