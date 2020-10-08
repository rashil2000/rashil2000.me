import Head from 'next/head'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../../lib/CodeBlock'

function getDateString(value) {
  const stringdate = new Date(value);
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export default function Blog({ blog }) {
  return (
    <div>
      <Head>
        <title>{blog.title} - rashil2000</title>
        <meta name="description" content={blog.description} />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
        <p className="author">
          <i>
            Posted: {getDateString(blog.date)}
          </i>
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
  const res = await fetch(`${process.env.DB_HOST}/blogs`);
  const blogs = await res.json();

  const paths = blogs.map(item => { return { params: { slug: item.slug } } });
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context) {
  const res = await fetch(`${process.env.DB_HOST}/blogs/${context.params.slug}`);
  const blog = await res.json();

  return {
    props: { blog },
    revalidate: 1
  }
}
