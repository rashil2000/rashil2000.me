import React from "react"
import Head from 'next/head'
import Link from 'next/link'

import { baseUrl } from '../lib/utils'
import { validate } from "../services/AuthService";

export default function Authenticate() {
  const [value, setValue] = React.useState('');

  return (
    <div>
      <Head>
        <title>Authenticate - rashil2000</title>
        <meta name="description" content="Enter Passphrase" />
        <meta property="og:image" content={`${baseUrl}/images/meta/authenticate.png`} />
      </Head>
      <main>
        <div className="abstract">
          <h2>Enter Passphrase</h2>
          <br /><br />
          <form onSubmit={e => { e.preventDefault(); validate(value) }}>
            <input
              type="password"
              style={{ backgroundColor: "transparent", borderTop: "0", borderRight: "0", borderLeft: "0", outline: "0", textAlign: "center" }}
              onChange={e => setValue(e.target.value)}
              required
              autoFocus
            />
            <br /><br /><br />
            <button>Validate</button>
          </form>
        </div>
        <br /><br /><br />
      </main>
      <footer>
        <Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link>
      </footer>
    </div>
  );
}
