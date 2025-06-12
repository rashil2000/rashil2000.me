import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMde from 'react-mde'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";

import { updateBlog } from "../../../services/BlogService";
import AuthBlock from '../../../lib/AuthBlock'
import { baseUrl, getBlog, getBlogs } from "../../../lib/utils";
import { imageDeleter, imageLister, imageUploader } from "../../../services/AssetService";

export default function EditBlog({ blog }) {
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

  const [content, setContent] = useState(blog.content);
  const [title, setTitle] = useState(blog.title);
  const [description, setDescription] = useState(blog.description);
  const [date, setDate] = useState((new Date((new Date(blog.date)).toISOString().replace('Z', '-05:30'))).toISOString().slice(0, -1));
  const [preview, setPreview] = useState(blog.preview);
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    imageLister(`blogs%2F${blog.slug}`).then(setCurrentImages);
  }, []);

  const handleBlogUpdate = async (e) => {
    e.preventDefault();
    await updateBlog(title.trim(), description.trim(), content.trim(), blog.slug, date.trim(), preview?.trim());
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister(`blogs%2F${blog.slug}`).then(setCurrentImages);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    await imageUploader('blogs', blog.slug);
    imageLister(`blogs%2F${blog.slug}`).then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>{`Edit blog '${blog.title}' - rashil2000`}</title>
        <meta name="description" content={`Edit blog '${blog.title}'`} />
        <meta property="og:image" content={blog.preview} />
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
          <input type="datetime-local" id="datetime" name="datetime" style={{ float: "right" }} value={date} required onChange={e => setDate(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-datetime" className="sidenote-toggle" />
          <span className="sidenote">Format: yyyy-mm-ddTHH:mm</span><br />

          <label htmlFor="preview" style={{ float: "left" }}>Preview Image:&nbsp;</label><label htmlFor="sn-preview" className="sidenote-toggle">⋆</label>
          <input type="text" id="preview" name="preview" style={{ float: "right" }} value={preview} onChange={e => setPreview(e.target.value)} /><br />
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
              <span style={{ float: "left" }}>{blog.slug}</span>
              <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(`images/blogs/${blog.slug}`)}>Remove all</span>
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

export const getStaticPaths = async () => (
  {
    paths: await getBlogs(true),
    fallback: true
  }
);

export const getStaticProps = async context => (
  {
    props: { blog: await getBlog(context.params.slug) },
  }
);
