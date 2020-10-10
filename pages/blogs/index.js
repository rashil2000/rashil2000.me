import Head from 'next/head'
import Link from 'next/link'

function getDateString(value) {
  const stringdate = new Date(value);
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export default function Blogs({ blogs }) {
  const sortedBlogs = blogs.sort((a, b) => {
    if (a.date < b.date) return 1;
    else return -1;
  })

  return (
    <div>
      <Head>
        <title>Blogs - rashil2000</title>
        <meta name="description" content="Random musings." />
        <meta name="keywords" content="Rashil Gandhi Blog, blog rashil gandhi, Rashil2000 Blog, blog rashil2000, RashilGandhi2000 Blog, blog rashilgandhi2000" />
      </Head>

      <main>

        <div className="abstract"><h2>Random musings</h2></div>
        <br />
        {sortedBlogs.map(blog => (
          <React.Fragment key={blog._id}>
            <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
              <a><h5 style={{ margin: "0" }}>{blog.title}</h5></a>
            </Link>
            <p style={{ textAlign: "right", fontStyle: "italic", textDecoration: "none", marginBottom: "10px" }}>{getDateString(blog.date)}</p>
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

export async function getStaticProps() {
  const res = await fetch(`${process.env.DB_HOST}/blogs`);
  const blogs = await res.json();

  return {
    props: { blogs },
    revalidate: 1
  }
}
