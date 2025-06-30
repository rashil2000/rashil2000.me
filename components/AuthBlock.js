import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";

import { baseUrl } from '../lib/utils'

export default function AuthBlock(props) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/authenticate'),
  });

  if (status === "loading") {
    return (
      <div>
        <Head>
          <title>Loading... - rashil2000</title>
          <link rel="icon" href="favicon.ico" />
          <meta name="description" content="This route is auth-protected." />
          <meta property="og:image" content={`${baseUrl}/images/meta/manage.png`} />
        </Head>
        <main>
          <div className="abstract"><h2>Loading authentication status...</h2></div>
          <br /><br />
        </main>
        <footer>
          <Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link>
        </footer>
      </div>
    );
  }

  return <>{props.children}</>;
}