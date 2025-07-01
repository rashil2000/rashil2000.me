import React from "react"
import Head from 'next/head'
import Link from 'next/link'
import { dateString, baseUrl } from '../lib/commonUtils'

export default function EntityLister({ entityType, entities, title, children }) {
  return (
    <div>
      <Head>
        <title>{`${entityType.typePlural} - rashil2000`}</title>
        <meta name="description" content={title} />
        <meta name="keywords" content={`Rashil Gandhi ${entityType.name}, ${entityType.typeLower} rashil gandhi, Rashil2000 ${entityType.name}, ${entityType.typeLower} rashil2000, RashilGandhi2000 ${entityType.name}, ${entityType.typeLower} rashilgandhi2000`} />
        <meta property="og:image" content={`${baseUrl}/images/meta/${entityType.typeLower}.png`} />
      </Head>
      <main>
        <div className="abstract"><h2>{title}</h2></div>
        <br />
        {entities.map(entity => (
          <React.Fragment key={entity._id}>
            <Link href={`/${entityType.typeLower}s/[slug]`} as={`/${entityType.typeLower}s/${entity.slug}`}>
              <h5 style={{ margin: "0" }}>{entity.title}</h5>
            </Link>
            <p id="date-style">{dateString(entity.date)}</p>
          </React.Fragment>
        ))}
        <br />
        {children}
        <br /><br />
      </main>
      <footer>
        <Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link>
      </footer>
    </div>
  );
}
