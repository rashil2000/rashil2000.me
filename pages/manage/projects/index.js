import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { baseUrl, sortByDate } from '../../../lib/utils'
import AuthBlock from '../../../components/AuthBlock'
import { imageDeleter, imageLister } from "../../../lib/assetUtils";

export default function ManageProjects() {
  const [currentProjects, setCurrentProjects] = useState([]);
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    async function getAllProjects() {
      const res = await fetch(`/api/projects`);
      let projects = await res.json();
      return sortByDate(projects);
    }
    getAllProjects().then(setCurrentProjects);
    imageLister('projects').then(setCurrentImages);
  }, []);

  const handleProjectDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from projects?`))
      return;

    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: 'DELETE',
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        document.getElementById(`projectsDeleteSpan`).innerHTML = `Removed "${result.title}" from projects.`;
        setCurrentProjects(currentProjects.filter(p => p.slug !== slug));
      } else
        alert(JSON.stringify(result));
    } catch (err) {
      alert('Error:\n' + JSON.stringify(err));
    }
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister('projects').then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>Manage Projects - rashil2000</title>
        <meta name="description" content="Edit or remove projects on the site." />
        <meta property="og:image" content={`${baseUrl}/images/meta/project.png`} />
      </Head>
      <main>
        <br />
        <div className="abstract">
          <Link href="/manage/projects/create">
            <button>Create Project</button>
          </Link>
        </div>
        <br />
        <div className="abstract"><h2>Manage Projects</h2></div>
        <br />
        {currentProjects.map(project => (
          <React.Fragment key={project._id}>
            <Link href="/projects/[slug]" as={`/projects/${project.slug}`}>
              <h5 style={{ margin: "0" }}>{project.title}</h5>
            </Link>
            <p style={{ float: "left" }}>{project.draft ? '(Unpublished)' : '(Published)'}</p>
            <p id="date-style" style={{ float: "right" }}>
              <Link
                href="/manage/projects/[slug]"
                as={`/manage/projects/${project.slug}`}
                style={{ textDecoration: 'none' }}>Edit</Link>
              &nbsp;|&nbsp;
              <span style={{ cursor: 'pointer' }} onClick={() => handleProjectDelete(project.slug, project.title)}>Remove</span>
            </p>
            <div style={{ clear: "both" }}></div>
            <br />
          </React.Fragment>
        ))}
        <div className="abstract">
          <span id='projectsDeleteSpan'></span>
        </div>

        <div className="abstract"><h2>Images</h2></div>
        <br />
        {currentImages && currentImages.children && currentImages.children.map(project => (
          <React.Fragment key={project.path}>
            <span style={{ float: "left" }}>{project.name}</span>
            <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(project.path)}>Remove all</span>
            <div style={{ clear: "both" }}></div>
            {project.children.map(item => (
              <React.Fragment key={item.path}>
                <a target="_blank" href={baseUrl + "/assets/" + item.pathname} rel="noopener noreferrer" style={{ float: "left" }}>└ {item.name}</a>
                <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(item.url)}>Remove</span>
                <div style={{ clear: "both" }}></div>
              </React.Fragment>
            ))}
            <br />
          </React.Fragment>
        ))}
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
    </AuthBlock>
  );
}
