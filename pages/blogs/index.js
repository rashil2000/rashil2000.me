import Head from 'next/head'
import Link from 'next/link'

import { baseUrl, dateString, getAllBlogs } from '../../lib/utils'

export default function Blogs({ blogs }) {
  return (
    <div>
      <Head>
        <title>Blogs - rashil2000</title>
        <meta name="description" content="Random musings." />
        <meta name="keywords" content="Rashil Gandhi Blog, blog rashil gandhi, Rashil2000 Blog, blog rashil2000, RashilGandhi2000 Blog, blog rashilgandhi2000" />
        <meta property="og:image" content={`${baseUrl}/images/meta/blog.png`} />
      </Head>

      <main>
        <div className="abstract"><h2>Random musings</h2></div>
        <br />
        {blogs.map(blog => (
          <React.Fragment key={blog._id}>
            <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
              <a><h5 style={{ margin: "0" }}>{blog.title}</h5></a>
            </Link>
            <p id="date-style">{dateString(blog.date)}</p>
          </React.Fragment>
        ))}
        <br /><br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}

export const getStaticProps = async () => (
  {
    props: { blogs: await getAllBlogs() },
    revalidate: 1
  }
)
