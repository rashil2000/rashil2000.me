import Head from 'next/head'
import Link from 'next/link'
import { signOut } from 'next-auth/react';

import { baseUrl } from '../../lib/utils';
import AuthBlock from '../../lib/AuthBlock'

export default function Manage() {
  return (
    <AuthBlock>
      <Head>
        <title>Manage - rashil2000</title>
        <meta name="description" content="Manage content on the site" />
        <meta property="og:image" content={`${baseUrl}/images/meta/manage.png`} />
      </Head>
      <main>
        <div className="abstract">
          <h2>Manage content on the site</h2>
          <br /><br /><br />
          <table id="no-border" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td id="no-border" style={{ width: "50%" }}><Link href="manage/blogs">Blogs</Link></td>
                <td id="no-border" style={{ width: "50%" }}><Link href="manage/projects">Projects</Link></td>
              </tr>
            </tbody>
          </table>
          <br /><br /><br />
          <button onClick={() => signOut()}>Invalidate</button>
          <br /><br /><br />
        </div>
      </main>
      <footer>
        <Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link>
      </footer>
    </AuthBlock>
  );
}
