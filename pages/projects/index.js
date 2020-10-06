import Head from 'next/head'
import Link from 'next/link'

export default function Projects() {
  return (
    <div>
      <Head>
        <title>Projects - rashil2000</title>
        <meta name="description" content="Random musings." />
        <meta name="keywords" content="Rashil Gandhi Project, project rashil gandhi, Rashil2000 Project, project rashil2000, RashilGandhi2000 Project, project rashilgandhi2000" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>

        <div className="abstract"><h2>Stuff that's (seemingly) cool</h2></div>
        <br />
        {[1, 2, 3, 4].map(key => (
          <React.Fragment key={key}>
            <Link href={`projects/${key}`}>
              <a><h5 style={{ margin: "0" }}>Hey yo this is a project</h5></a>
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
