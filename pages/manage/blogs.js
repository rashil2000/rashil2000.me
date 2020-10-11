import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'

import { getAllBlogs, itemDeleter, createBlog } from '../../lib/utils'
import CodeBlock from '../../lib/CodeBlock'
import AuthBlock from '../../lib/AuthBlock'

export default function ManageBlogs() {
  const [content, setContent] = useState("_Start typing..._");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentBlogs, setCurrentBlogs] = useState([]);
  useEffect(() => { (async () => setCurrentBlogs(await getAllBlogs()))() }, []);

  return (
    <AuthBlock>
      <Head>
        <title>Manage Blogs - rashil2000</title>
        <meta name="description" content="Add, edit or remove blogs on the site." />
      </Head>

      <main>
        <div className="abstract"><h2>Manage Blogs</h2></div>
        <br />
        {currentBlogs.map(blog => (
          <React.Fragment key={blog._id}>
            <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
              <a><h5 style={{ margin: "0" }}>{blog.title}</h5></a>
            </Link>
            <p id="date-style"><span style={{ cursor: 'pointer' }} onClick={() => itemDeleter('blogs', blog.slug)}>Remove</span></p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract"><h2>Create Blog</h2></div>
        <br />
        <form onSubmit={e => { e.preventDefault(); createBlog(title.trim(), description.trim(), content.trim(), slug.trim()); }} autoComplete='off'>
          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} required onChange={e => setTitle(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>
          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} required onChange={e => setDescription(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>
          <label htmlFor="slug" style={{ float: "left" }}>Slug:</label>
          <input type="text" id="slug" name="slug" style={{ float: "right" }} required onChange={e => setSlug(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <small>Once set, the slug is immutable.</small>
          <br /><br />
          <ReactMde
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />)}
            minEditorHeight={300}
          />
          <div className="abstract">
            <br /><button>Post</button><br /><br />
          </div>
        </form>
        <div className="abstract">
          <h2>Images</h2>
          <small>(this requires the <code>slug</code> field to be set above)</small><br /><br />
          <input type="file" id="imageFile" name="imageFile" style={{ float: "left" }} />
          <button style={{ float: "right" }}>Upload</button>
          <div style={{ clear: "both" }}></div>
          <br /><br /><br />
        </div>
      </main>

      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href="/manage"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></a></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </AuthBlock>
  )
}
