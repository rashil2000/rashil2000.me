import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ReactMde from 'react-mde'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";

import { baseUrl } from '../../../lib/utils'
import AuthBlock from '../../../lib/AuthBlock'
import { createProject, deleteProject, getAllProjects } from "../../../services/ProjectService";
import { imageDeleter, imageLister, imageUploader } from "../../../services/AssetService";

export default function ManageProjects() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [github, setGithub] = useState("");
  const [preview, setPreview] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentProjects, setCurrentProjects] = useState([]);
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    getAllProjects().then(setCurrentProjects);
    imageLister('projects').then(setCurrentImages);
  }, []);

  const handleProjectDelete = async (slug, title) => {
    await deleteProject(slug, title);
    setCurrentProjects(currentProjects.filter(p => p.slug !== slug));
  };

  const handleProjectCreate = async (e) => {
    e.preventDefault();
    const newProject = await createProject(title.trim(), description.trim(), content.trim(), slug.trim(), github.trim(), preview?.trim());
    if (newProject === null)
      return;
    setCurrentProjects([newProject, ...currentProjects]);
    setTitle('');
    setDescription('');
    setContent('');
    setSlug('');
    setGithub('');
    setPreview('');
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister('projects').then(setCurrentImages);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    await imageUploader('projects', slug.trim());
    imageLister('projects').then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>Manage Projects - rashil2000</title>
        <meta name="description" content="Add, edit or remove projects on the site." />
        <meta property="og:image" content={`${baseUrl}/images/meta/project.png`} />
      </Head>
      <main>
        <div className="abstract"><h2>Manage Projects</h2></div>
        <br />
        {currentProjects.map(project => (
          <React.Fragment key={project._id}>
            <Link href="/projects/[slug]" as={`/projects/${project.slug}`}>
              <h5 style={{ margin: "0" }}>{project.title}</h5>
            </Link>
            <p id="date-style">
              <Link
                href="/manage/projects/[slug]"
                as={`/manage/projects/${project.slug}`}
                style={{ textDecoration: 'none' }}>Edit</Link>
              &nbsp;|&nbsp;
              <span style={{ cursor: 'pointer' }} onClick={() => handleProjectDelete(project.slug, project.title)}>Remove</span>
            </p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract">
          <span id='projectsDeleteSpan'></span>
          <h2>Create Project</h2>
        </div>
        <br />
        <form onSubmit={handleProjectCreate} autoComplete='off' id='projectForm'>

          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} required value={title} onChange={e => setTitle(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} required value={description} onChange={e => setDescription(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="github" style={{ float: "left" }}>GitHub:&nbsp;</label><label htmlFor="sn-github" className="sidenote-toggle">⋆</label>
          <input type="text" id="github" name="github" style={{ float: "right" }} required value={github} onChange={e => setGithub(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-github" className="sidenote-toggle" />
          <span className="sidenote">Format: username/repository</span><br />

          <label htmlFor="slug" style={{ float: "left" }}>Slug:&nbsp;</label><label htmlFor="sn-slug" className="sidenote-toggle">⋆</label>
          <input type="text" id="slug" name="slug" style={{ float: "right" }} required value={slug} onChange={e => setSlug(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-slug" className="sidenote-toggle" />
          <span className="sidenote">Once set, this is immutable</span><br />

          <label htmlFor="preview" style={{ float: "left" }}>Preview Image:&nbsp;</label><label htmlFor="sn-preview" className="sidenote-toggle">⋆</label>
          <input type="text" id="preview" name="preview" style={{ float: "right" }} value={preview} onChange={e => setPreview(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-preview" className="sidenote-toggle" />
          <span className="sidenote">URL for link preview. Optional</span>

          <br /><br />
          <ReactMde
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => Promise.resolve(<MarkdownHooks children={markdown} rehypePlugins={[rehypeStarryNight]}/>)}
            minEditorHeight={300}
          />

          <div className="abstract">
            <br /><button>Post</button><br /><br />
            <span id='projectCreateSpan'></span><br />
          </div>

        </form>

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
        <br />
        <form className="abstract" onSubmit={handleImageUpload} id='imageForm'>
          <input type="file" id="imageInput" name="imageFile" style={{ float: "left" }} />
          <label htmlFor="sn-image" className="sidenote-toggle">⋆</label>
          <button style={{ float: "right" }}>Upload</button>
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-image" className="sidenote-toggle" />
          <span className="sidenote">This requires the <code>slug</code> field to be set above</span>
          <br /><br /><span id='imageSpan'></span><br /><br />
        </form>
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
