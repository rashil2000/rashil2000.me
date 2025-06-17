import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { baseUrl, sortByDate } from '../../../lib/utils'
import AuthBlock from '../../../lib/AuthBlock'
import { imageDeleter, imageLister } from "../../../lib/assetUtils";

export default function ManageBlogs() {
  const [currentBlogs, setCurrentBlogs] = useState([]);
  const [currentImages, setCurrentImages] = useState({ children: [] });

  useEffect(() => {
    async function getAllBlogs() {
      const res = await fetch(`/api/blogs`);
      const blogs = await res.json();
      return sortByDate(blogs);
    }
    getAllBlogs().then(setCurrentBlogs);
    imageLister('blogs').then(setCurrentImages);
  }, []);

  const handleBlogDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from blogs?`))
      return;

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE',
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        document.getElementById(`blogsDeleteSpan`).innerHTML = `Removed "${result.title}" from blogs.`;
        setCurrentBlogs(currentBlogs.filter(b => b.slug !== slug));
      } else
        alert(JSON.stringify(result));
    } catch (err) {
      alert('Error:\n' + JSON.stringify(err));
    }
  };

  const handleImageDelete = async (path) => {
    await imageDeleter(path);
    imageLister('blogs').then(setCurrentImages);
  };

  return (
    <AuthBlock>
      <Head>
        <title>Manage Blogs - rashil2000</title>
        <meta name="description" content="Edit or remove blogs on the site." />
        <meta property="og:image" content={`${baseUrl}/images/meta/blog.png`} />
      </Head>
      <main>
        <br />
        <div className="abstract">
          <Link href="/manage/blogs/create">
            <button>Create Blog</button>
          </Link>
        </div>
        <br />
        <div className="abstract"><h2>Manage Blogs</h2></div>
        <br />
        {currentBlogs.map(blog => (
          <React.Fragment key={blog._id}>
            <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
              <h5 style={{ margin: "0" }}>{blog.title}</h5>
            </Link>
            <p style={{ float: "left" }}>{blog.draft ? '(Unpublished)' : '(Published)'}</p>
            <p id="date-style" style={{ float: "right" }}>
              <Link
                href="/manage/blogs/[slug]"
                as={`/manage/blogs/${blog.slug}`}
                style={{ textDecoration: 'none' }}>Edit</Link>
              &nbsp;|&nbsp;
              <span style={{ cursor: 'pointer' }} onClick={() => handleBlogDelete(blog.slug, blog.title)}>Remove</span>
            </p>
            <div style={{ clear: "both" }}></div>
            <br />
          </React.Fragment>
        ))}
        <div className="abstract">
          <span id='blogsDeleteSpan'></span>
        </div>

        <div className="abstract"><h2>Images</h2></div>
        <br />
        {currentImages && currentImages.children && currentImages.children.map(blog => (
          <React.Fragment key={blog.path}>
            <span style={{ float: "left" }}>{blog.name}</span>
            <span style={{ cursor: 'pointer', float: "right", fontStyle: "italic" }} onClick={() => handleImageDelete(blog.path)}>Remove all</span>
            <div style={{ clear: "both" }}></div>
            {blog.children.map(item => (
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
