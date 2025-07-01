import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from 'rehype-starry-night'
import { DiscussionEmbed } from 'disqus-react'

import { baseUrl, dateString } from '../lib/commonUtils'

export default function EntityDisplay({ entity, entityType }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed initially until static props are fetched
  if (router.isFallback) {
    return (
      <div>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content={`Loading ${entityType.typeLower} data...`} />
        </Head>
        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>Loading {entityType.typeLower} data, please wait...</p>
            <br />
          </div>
          <br /><br />
        </main>
        <footer>
          <table id="no-border" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td id="no-border" style={{ width: "50%" }}><Link href={`/${entityType.typeLower}s`}><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>{entityType.typePlural}</p></Link></td>
                <td id="no-border" style={{ width: "50%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
              </tr>
            </tbody>
          </table>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{`${entity.title} - rashil2000`}</title>
        <meta name="description" content={entity.description} />
        <meta property="og:image" content={entity.preview} />
      </Head>
      <header>
        <p className="author">
          {entityType.typeLower === 'project' ? (
            <a target="_blank" rel="noopener" href={`https://github.com/${entity.github}`} style={{ fontStyle: 'italic' }}>
              {`Last commit: ${dateString(entity.date)}`}
            </a>
          ) : (
            <i>{`Posted: ${dateString(entity.date)}`}</i>
          )}
        </p>
      </header>
      <main id="markdown-box">
        <MarkdownHooks children={entity.content} rehypePlugins={[rehypeStarryNight]}/>
        <br />
      </main>
      <DiscussionEmbed
        shortname='rashil2000'
        config={{
          url: `${baseUrl}/${entityType.typeLower}s/${entity.slug}`,
          identifier: `/${entityType.typeLower}/${entity.slug}`,
          title: entity.title,
        }}
      />
      <br />
      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href={`/${entityType.typeLower}s`}><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>{entityType.typePlural}</p></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  );
}
