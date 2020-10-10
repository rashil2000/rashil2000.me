import Head from 'next/head'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import { dateString, getSlugPaths, getBlog } from '../../lib/utils'
import CodeBlock from '../../lib/CodeBlock'

export default function Blog({ blog }) {
  return (
    <div>
      <Head>
        <title>{blog.title} - rashil2000</title>
        <meta name="description" content={blog.description} />
      </Head>

      <header>
        <p className="author">
          <i>Posted: {dateString(blog.date)}</i>
        </p>
      </header>

      <main>
        <ReactMarkdown source={blog.content} renderers={{ code: CodeBlock }} />
        <br /><br />
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
  const paths = await getSlugPaths('blogs');

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context) {
  const blog = await getBlog(context.params.slug);

  return {
    props: { blog },
    revalidate: 1
  }
}
