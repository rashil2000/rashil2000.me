import Head from 'next/head'
import Link from 'next/link'

import { validate } from '../lib/utils'

export default function Authenticate() {
  const [value, setValue] = React.useState('');

  return (
    <div>
      <Head>
        <title>Authenticate - rashil2000</title>
        <meta name="description" content="Enter Passphrase" />
      </Head>

      <main>
        <div className="abstract">
          <h2>Enter Passphrase</h2>
          <br /><br />
          <input type="password" style={{ backgroundColor: "transparent", borderTop: "0", borderRight: "0", borderLeft: "0", outline: "0", textAlign: "center" }} onChange={e => setValue(e.target.value)} />
          <br /><br /><br />
          <button onClick={() => validate(value)}>Validate</button>
        </div>
        <br /><br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}
