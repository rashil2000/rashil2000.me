import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { DiscussionEmbed } from 'disqus-react'

import { dateString, getSlugPaths, getBlog } from '../../lib/utils'
import CodeBlock from '../../lib/CodeBlock'

export default function Blog({ blog }) {
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
                <td id="no-border" style={{ width: "50%" }}><Link href="/blogs"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Blogs</p></a></Link></td>
                <td id="no-border" style={{ width: "50%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
              </tr>
            </tbody>
          </table>
        </footer>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>{blog.title} - rashil2000</title>
        <meta name="description" content={blog.description} />
        <meta property="og:image" content={blog.preview} />
      </Head>

      <header>
        <p className="author">
          <i>Posted: {dateString(blog.date)}</i>
        </p>
      </header>

      <main>
        <ReactMarkdown className="markdown-box" source={blog.content} renderers={{ code: CodeBlock }} />
        <br />
      </main>

      <DiscussionEmbed
        shortname='rashil2000'
        config={
          {
            url: `https://rashil2000.me/blog/${blog.slug}`,
            identifier: `/blog/${blog.slug}`,
            title: blog.title,
          }
        }
      />
      <br/ >

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

export const getStaticPaths = async () => (
  {
    paths: await getSlugPaths('blogs'),
    fallback: true
  }
);

export const getStaticProps = async context => (
  {
    props: { blog: await getBlog(context.params.slug) },
    revalidate: 1
  }
);
