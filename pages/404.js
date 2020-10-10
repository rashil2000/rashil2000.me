import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <div>
      <Head>
        <title>404 - Not Found - rashil2000</title>
        <meta name="description" content="Error 404 - Not found" />
      </Head>

      <main>
        <div className="abstract">
          <h2>Resource Not Found</h2>
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