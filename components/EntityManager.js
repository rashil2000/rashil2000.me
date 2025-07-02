import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { baseUrl, sortByDate } from '../lib/commonUtils'
import { imageDeleter, imageLister } from "../lib/assetUtils";

export default function EntityManager({ entityType }) {
  const [currentEntities, setCurrentEntities] = useState();
  const [currentImages, setCurrentImages] = useState();
  const entityLowerPlural = entityType.typeLower + 's';

  useEffect(() => {
    async function getAllEntities() {
      const res = await fetch(`/api/${entityLowerPlural}`);
      const entities = await res.json();
      return sortByDate(entities);
    }
    getAllEntities().then(setCurrentEntities);
    imageLister(entityLowerPlural).then(setCurrentImages);
  }, []);

  const handleEntityDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from ${entityLowerPlural}?`))
      return;

    try {
      const response = await fetch(`/api/${entityLowerPlural}/${slug}`, {
        method: 'DELETE',
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        document.getElementById(`${entityLowerPlural}DeleteSpan`).innerHTML = `Removed "${result.title}" from ${entityLowerPlural}.`;
        setCurrentEntities(currentEntities.filter(e => e.slug !== slug));
      } else
        alert(JSON.stringify(result));
    } catch (err) {
      alert('Error:\n' + JSON.stringify(err));
    }
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister(entityLowerPlural).then(setCurrentImages);
  };

  return (
    <>
      <Head>
        <title>Manage {entityType.typePlural} - rashil2000</title>
        <meta name="description" content={`Edit or remove ${entityLowerPlural} on the site.`} />
        <meta property="og:image" content={`${baseUrl}/images/meta/${entityType.typeLower}.png`} />
      </Head>
      <main>
        <br />
        <div className="abstract">
          <Link href={`/manage/${entityLowerPlural}/create`}>
            <button>Create {entityType.name}</button>
          </Link>
        </div>
        <br />
        <div className="abstract"><h2>Manage {entityType.typePlural}</h2></div>
        <br />
        {currentEntities ? currentEntities.map(entity => (
          <React.Fragment key={entity._id}>
            <Link href={`/${entityLowerPlural}/[slug]`} as={`/${entityLowerPlural}/${entity.slug}`}>
              <h5 style={{ margin: "0" }}>{entity.title}</h5>
            </Link>
            <p style={{ float: "left" }}>{entity.draft ? '(Unpublished)' : '(Published)'}</p>
            <p id="date-style" style={{ float: "right" }}>
              <Link
                href={`/manage/${entityLowerPlural}/[slug]`}
                as={`/manage/${entityLowerPlural}/${entity.slug}`}
                style={{ textDecoration: 'none' }}>Edit</Link>
              &nbsp;|&nbsp;
              <span style={{ cursor: 'pointer' }} onClick={() => handleEntityDelete(entity.slug, entity.title)}>Remove</span>
            </p>
            <div style={{ clear: "both" }}></div>
            <br />
          </React.Fragment>
        )) : <div className="abstract">Fetching...</div>}
        <div className="abstract">
          <span id={`${entityLowerPlural}DeleteSpan`}></span>
        </div>

        <div className="abstract"><h2>Images</h2></div>
        <br />
        {currentImages && currentImages.children ? currentImages.children.length !== 0 ? currentImages.children.map(folder => (
          <React.Fragment key={folder.path}>
            <span style={{ float: "left" }}>{folder.name}</span>
            <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(folder.path)}>Remove all</span>
            <div style={{ clear: "both" }}></div>
            {folder.children.map(item => (
              <React.Fragment key={item.path}>
                <a target="_blank" href={baseUrl + "/assets/" + item.pathname} rel="noopener noreferrer" style={{ float: "left" }}>└ {item.name}</a>
                <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(item.url)}>Remove</span>
                <div style={{ clear: "both" }}></div>
              </React.Fragment>
            ))}
            <br />
          </React.Fragment>
        )) : <div className="abstract">No images found for {entityLowerPlural}.</div>
          : <div className="abstract">Fetching...</div>}
        <div id='imageSpan' className="abstract"></div>
        <br />
      </main>
      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href="/manage"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </>
  );
}
