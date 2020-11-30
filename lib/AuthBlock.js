import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { baseUrl } from './utils'

export default function AuthBlock(props) {
  const router = useRouter();

  if ((typeof window !== 'undefined') && (localStorage.getItem('token')))
    return <>{props.children}</>;
  else {
    if (typeof window !== 'undefined') router.push('/authenticate');
    return (
      <div>
        <Head>
          <title>Redirecting... - rashil2000</title>
          <link rel="icon" href="favicon.ico" />
          <meta name="description" content="This route is auth-protected." />
          <meta property="og:image" content={`${baseUrl}/images/meta/manage.png`} />
        </Head>
        <main>
          <div className="abstract"><h2>Redirecting to authenticate...</h2></div>
          <br /><br />
        </main>
        <footer>
          <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
        </footer>
      </div>
    );
  }
}