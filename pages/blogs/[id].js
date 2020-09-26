import Head from 'next/head'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../../lib/CodeBlock'

export default function Blog({ markdown }) {
  return (
    <div>
      <Head>
        <title>The Blog Title - rashil2000</title>
        <link rel="icon" href="../favicon.ico" />
        <meta name="description" content="kuch to hoga idhar pata nahi" />
      </Head>

      <style jsx global>{`
        #no-border {
          border: 0;
          text-align: center;
        }
    `}</style>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>
        <div className="abstract">
          <h2>The Blog Title</h2>
          <br />
        </div>

        <ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />

        <br />
      </main>

      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href="/blogs"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Blogs</p></a></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = ['/blogs/1', '/blogs/2', '/blogs/3', '/blogs/4'];
  return {
    paths,
    fallback: false
  }
}


export async function getStaticProps() {
  let markdown = require('fs').readFileSync(require('path').join(process.cwd(), 'temp/content.md'), 'utf-8')

  return {
    props: {
      markdown
    }
  }
}