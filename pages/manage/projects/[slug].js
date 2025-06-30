import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMde from 'react-mde'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";

import AuthBlock from '../../../components/AuthBlock'
import { baseUrl } from "../../../lib/utils";
import { imageDeleter, imageLister, imageUploader } from "../../../lib/assetUtils";

export default function EditProject() {
  const router = useRouter();
  const { slug } = router.query;

  // Show loading state while fetching data
  if (!slug) {
    return (
      <AuthBlock>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content="Loading project data..." />
        </Head>
        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>Loading project data, please wait...</p>
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

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [github, setGithub] = useState('');
  const [preview, setPreview] = useState('');
  const [draft, setDraft] = useState(false);
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    async function getProject() {
      const res = await fetch(`/api/projects/${slug}`);
      return await res.json();
    }
    function updateProjectState(projectData) {
      if (!projectData) return;
      setContent(projectData.content);
      setTitle(projectData.title);
      setDescription(projectData.description);
      setGithub(projectData.github);
      setPreview(projectData.preview || '');
      setDraft(projectData.draft || false);
    }

    getProject().then(updateProjectState);
    imageLister(`projects%2F${slug}`).then(setCurrentImages);
  }, [slug]);

  const handleProjectUpdate = async (e) => {
    e.preventDefault();
    setTitle(title?.trim());
    setDescription(description?.trim());

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
      const response = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify({ title, description, content, github, preview, draft }),
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
    imageLister(`projects%2F${slug}`).then(setCurrentImages);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    await imageUploader('projects', slug);
    imageLister(`projects%2F${slug}`).then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>{`Edit project '${title}' - rashil2000`}</title>
        <meta name="description" content={`Edit project '${title}'`} />
        <meta property="og:image" content={preview} />
      </Head>
      <main>
        <div className="abstract"><h2>Edit Project</h2></div>
        <br />
        <form onSubmit={handleProjectUpdate} autoComplete='off'>

          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} value={title} required onChange={e => setTitle(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} value={description} required onChange={e => setDescription(e.target.value)} /><br /><br />
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

          <label htmlFor="draft" style={{ float: "left" }}>Mark as draft:&nbsp;</label><label htmlFor="sn-draft" className="sidenote-toggle">⋆</label>
          <input type="checkbox" id="draft" name="draft" style={{ float: "right" }} checked={draft} onChange={e => setDraft(e.target.checked)} />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-draft" className="sidenote-toggle" />
          <span className="sidenote">If checked, this project won't be publicly visible</span><br />

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
              <span style={{ float: "left" }}>{slug}</span>
              <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(`images/projects/${slug}`)}>Remove all</span>
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

