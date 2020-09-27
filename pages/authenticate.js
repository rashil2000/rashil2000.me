import Head from 'next/head'
import Link from 'next/link'

export default function Authenticate() {
  return (
    <div>
      <Head>
        <title>Authenticate - rashil2000</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Enter Passphrase" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>
        <div className="abstract">
          <h2>Enter Passphrase</h2>
          <br /><br />
          <input type="password" style={{ backgroundColor: "transparent", borderTop: "0", borderRight: "0", borderLeft: "0", outline: "0", textAlign: "center" }} />
          <br /><br /><br />
          <button onClick={() => history.back()}>Validate</button>
        </div>
        <br /><br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}
