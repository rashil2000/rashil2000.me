import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <div>
      <Head>
        <title>404 - Page Not Found - rashil2000</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Error 404 - Not found" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>
        <div className="abstract">
          <h2>No Page Found</h2>
          <br /><br />
          <p>You seem to have fallen on a broken link.</p>
          <br />
        </div>
        <br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}