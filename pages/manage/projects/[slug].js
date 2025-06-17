import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMde from 'react-mde'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";

import AuthBlock from '../../../lib/AuthBlock'
import { baseUrl, getProject, getProjects } from "../../../lib/utils";
import { imageDeleter, imageLister, imageUploader } from "../../../services/AssetService";

export default function EditProject({ project }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed initially until static props are fetched
  if (router.isFallback) {
    return (
      <AuthBlock>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content="Building page..." />
        </Head>
        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>This page is getting built, please wait for a while. It'll reload itself.</p>
            <br />
          </div>
          <br /><br />
        </main>
        <footer>
          <table id="no-border" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td id="no-border" style={{ width: "34%" }}><Link href="/manage/projects"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage Projects</p></Link></td>
                <td id="no-border" style={{ width: "33%" }}><Link href="/manage"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></Link></td>
                <td id="no-border" style={{ width: "33%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
              </tr>
            </tbody>
          </table>
        </footer>
      </AuthBlock>
    );
  }

  const [content, setContent] = useState(project.content);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [github, setGithub] = useState(project.github);
  const [preview, setPreview] = useState(project.preview);
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    imageLister(`projects%2F${project.slug}`).then(setCurrentImages);
  }, []);

  const handleProjectUpdate = async (e) => {
    e.preventDefault();
    if (!confirm('Are all input fields correct?'))
      return;

    if (!(title && description && content && github)) {
      alert("No field should remain empty!");
      return;
    }
    if (!github.match(/^([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\/([a-z\d](?:[a-z\d]|[-_.](?=[a-z\d])){0,99})$/i)) {
      alert("Enter a valid GitHub identifier.");
      return;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify({ title, description, content, github, preview }),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id){
        alert(`Updated project "${result.title}" successfully.`)
        history.back();
      } else
        alert(JSON.stringify(result));
    } catch (err) {
      alert('Error:\n' + JSON.stringify(err));
    }
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister(`projects%2F${project.slug}`).then(setCurrentImages);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    await imageUploader('projects', project.slug);
    imageLister(`projects%2F${project.slug}`).then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>{`Edit project '${project.title}' - rashil2000`}</title>
        <meta name="description" content={`Edit project '${project.title}'`} />
        <meta property="og:image" content={project.preview} />
      </Head>
      <main>
        <div className="abstract"><h2>Edit Project</h2></div>
        <br />
        <form onSubmit={handleProjectUpdate} autoComplete='off'>

          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} value={title} required onChange={e => setTitle(e.target.value?.trim())} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} value={description} required onChange={e => setDescription(e.target.value?.trim())} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="github" style={{ float: "left" }}>GitHub:&nbsp;</label><label htmlFor="sn-github" className="sidenote-toggle">⋆</label>
          <input type="text" id="github" name="github" style={{ float: "right" }} required value={github} onChange={e => setGithub(e.target.value?.trim())} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-github" className="sidenote-toggle" />
          <span className="sidenote">Format: username/repository</span><br />

          <label htmlFor="preview" style={{ float: "left" }}>Preview Image:&nbsp;</label><label htmlFor="sn-preview" className="sidenote-toggle">⋆</label>
          <input type="text" id="preview" name="preview" style={{ float: "right" }} value={preview} onChange={e => setPreview(e.target.value?.trim())} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-preview" className="sidenote-toggle" />
          <span className="sidenote">URL for link preview. Optional</span><br />

          <br />
          <ReactMde
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => Promise.resolve(<MarkdownHooks children={markdown} rehypePlugins={[rehypeStarryNight]}/>)}
            minEditorHeight={300}
          />

          <div className="abstract">
            <br /><button>Update</button><br /><br /><br />
          </div>

        </form>

        <div className="abstract"><h2>Images</h2></div>
        {currentImages && currentImages.children && currentImages.children.length !== 0
            ?
            <React.Fragment>
              <span style={{ float: "left" }}>{project.slug}</span>
              <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(`images/projects/${project.slug}`)}>Remove all</span>
              <div style={{ clear: "both" }}></div>
              {currentImages.children.map(item => (
                  <React.Fragment key={item.path}>
                    <a target="_blank" href={baseUrl + "/assets/" + item.pathname} rel="noopener noreferrer" style={{ float: "left" }}>└ {item.name}</a>
                    <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(item.url)}>Remove</span>
                    <div style={{ clear: "both" }}></div>
                  </React.Fragment>
              ))}
              <br />
            </React.Fragment>
            :
            <div className="abstract">
              No images found for this project. Use the form below to upload one.
            </div>
        }
        <br />
        <form className="abstract" onSubmit={handleImageUpload} id='imageForm'>
          <input type="file" id="imageInput" name="imageFile" style={{ float: "left" }} />
          <button style={{ float: "right" }}>Upload</button>
          <div style={{ clear: "both" }}></div>
          <br /><br /><span id='imageSpan'></span><br /><br />
        </form>
      </main>
      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "34%" }}><Link href="/manage/projects"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage Projects</p></Link></td>
              <td id="no-border" style={{ width: "33%" }}><Link href="/manage"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></Link></td>
              <td id="no-border" style={{ width: "33%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </AuthBlock>
  );
}

export const getStaticPaths = async () => (
  {
    paths: await getProjects(true),
    fallback: true
  }
);

export const getStaticProps = async context => (
  {
    props: { project: await getProject(context.params.slug) },
  }
);
