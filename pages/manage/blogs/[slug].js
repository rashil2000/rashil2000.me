import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMde from 'react-mde'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";

import AuthBlock from '../../../components/AuthBlock'
import { baseUrl, dateString } from "../../../lib/utils";
import { imageDeleter, imageLister, imageUploader } from "../../../lib/assetUtils";

export default function EditBlog() {
  const router = useRouter();
  const { slug } = router.query;

  // Show loading state while fetching data
  if (!slug) {
    return (
      <AuthBlock>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content="Loading blog data..." />
        </Head>
        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>Loading blog data, please wait...</p>
            <br />
          </div>
          <br /><br />
        </main>
        <footer>
          <table id="no-border" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td id="no-border" style={{ width: "34%" }}><Link href="/manage/blogs"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage Blogs</p></Link></td>
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
  const [date, setDate] = useState('');
  const [preview, setPreview] = useState('');
  const [draft, setDraft] = useState(false);
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    async function getBlog() {
      const res = await fetch(`/api/blogs/${slug}`);
      return await res.json();
    }
    function updateBlogState(blogData) {
      if (!blogData) return;
      setContent(blogData.content);
      setTitle(blogData.title);
      setDescription(blogData.description);
      setDate((new Date((new Date(blogData.date)).toISOString().replace('Z', '-05:30'))).toISOString().slice(0, -1));
      setPreview(blogData.preview || '');
      setDraft(blogData.draft || false);
    }

    getBlog().then(updateBlogState);
    imageLister(`blogs%2F${slug}`).then(setCurrentImages);
  }, [slug]);

  const handleBlogUpdate = async (e) => {
    e.preventDefault();
    setTitle(title?.trim());
    setDescription(description?.trim());

    if (!confirm('Are all input fields correct?'))
      return null;

    if (!(title && description && content && date)) {
      alert('No field should remain empty!');
      return null;
    }
    if (dateString(date) === 'NaN Invalid Date NaN') {
      alert("Enter a valid date.")
      return null;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify({ title, description, content, date, preview, draft }),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        alert(`Updated blog "${result.title}" successfully.`)
        history.back();
      } else
        alert(JSON.stringify(result));
    } catch (err) {
      return alert('Error:\n' + JSON.stringify(err));
    }
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister(`blogs%2F${slug}`).then(setCurrentImages);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    await imageUploader('blogs', slug);
    imageLister(`blogs%2F${slug}`).then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>{`Edit blog '${title}' - rashil2000`}</title>
        <meta name="description" content={`Edit blog '${title}'`} />
        <meta property="og:image" content={preview} />
      </Head>
      <main>
        <div className="abstract"><h2>Edit Blog</h2></div>
        <br />
        <form onSubmit={handleBlogUpdate} autoComplete='off'>

          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} value={title} required onChange={e => setTitle(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} value={description} required onChange={e => setDescription(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="datetime" style={{ float: "left" }}>Date and Time:&nbsp;</label><label htmlFor="sn-datetime" className="sidenote-toggle">⋆</label>
          <input type="datetime-local" id="datetime" name="datetime" style={{ float: "right" }} value={date} required onChange={e => setDate(e.target.value?.trim())} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-datetime" className="sidenote-toggle" />
          <span className="sidenote">Format: yyyy-mm-ddTHH:mm</span><br />

          <label htmlFor="preview" style={{ float: "left" }}>Preview Image:&nbsp;</label><label htmlFor="sn-preview" className="sidenote-toggle">⋆</label>
          <input type="text" id="preview" name="preview" style={{ float: "right" }} value={preview} onChange={e => setPreview(e.target.value?.trim())} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-preview" className="sidenote-toggle" />
          <span className="sidenote">URL for link preview. Optional</span><br />

          <label htmlFor="draft" style={{ float: "left" }}>Mark as draft:&nbsp;</label><label htmlFor="sn-draft" className="sidenote-toggle">⋆</label>
          <input type="checkbox" id="draft" name="draft" style={{ float: "right" }} checked={draft} onChange={e => setDraft(e.target.checked)} />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-draft" className="sidenote-toggle" />
          <span className="sidenote">If checked, this blog won't be publicly visible</span><br />

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
              <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(`images/blogs/${slug}`)}>Remove all</span>
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
              No images found for this blog. Use the form below to upload one.
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
              <td id="no-border" style={{ width: "34%" }}><Link href="/manage/blogs"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage Blogs</p></Link></td>
              <td id="no-border" style={{ width: "33%" }}><Link href="/manage"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></Link></td>
              <td id="no-border" style={{ width: "33%" }}><Link href="/"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </AuthBlock>
  );
}

