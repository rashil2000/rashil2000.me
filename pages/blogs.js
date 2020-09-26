import Head from 'next/head'
import Link from 'next/link'

export default function Blogs() {
  return (
    <div>
      <Head>
        <title>Blogs - rashil2000</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Random musings." />
        <meta name="keywords" content="Rashil Gandhi Blog, blog rashil gandhi, Rashil2000 Blog, blog rashil2000, RashilGandhi2000 Blog, blog rashilgandhi2000" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>

        <div className="abstract"><h2>Random musings</h2></div>
        <br />
        {[1, 2, 3, 4].map(key => (
          <React.Fragment key={key}>
            <Link href={`blogs/${key}`}>
              <a><h5 style={{ margin: "0" }}>Hey yo this is a blog</h5></a>
            </Link>
            <p style={{ textAlign: "right", fontStyle: "italic", textDecoration: "none", marginBottom: "10px" }}>22nd January, 2020</p>
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
