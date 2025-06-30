import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ReactMde from 'react-mde'
import { MarkdownHooks } from 'react-markdown'
import rehypeStarryNight from "rehype-starry-night";

import { baseUrl, dateString } from '../../../lib/utils'
import AuthBlock from '../../../lib/AuthBlock'
import { imageDeleter, imageLister, imageUploader } from "../../../lib/assetUtils";

export default function CreateBlog() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [slug, setSlug] = useState("");
    const [date, setDate] = useState("");
    const [preview, setPreview] = useState("");
    const [draft, setDraft] = useState(false);
    const [selectedTab, setSelectedTab] = useState("write");
    const [currentImages, setCurrentImages] = useState({ children: [] });

    const handleBlogCreate = async (e) => {
        e.preventDefault();
        if (!confirm('Are all input fields correct?'))
            return;

        if (!(title && description && content && slug && date)) {
            alert('No field should remain empty!');
            return;
        }
        if (dateString(date) === 'NaN Invalid Date NaN') {
            alert("Enter a valid date.")
            return;
        }

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            const response = await fetch(`/api/blogs`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ title, description, content, slug, date, preview, draft }),
                redirect: 'follow'
            });
            const result = await response.json();
            if (result._id) {
                alert(`Created blog "${result.title}" successfully.`)
                history.back();
            } else
                alert(JSON.stringify(result));
        } catch (err) {
            alert('Error:\n' + JSON.stringify(err));
        }
    };

    const handleImageDelete = async (path) => {
        await imageDeleter(path);
        if (slug)
            imageLister(`blogs%2F${slug}`).then(setCurrentImages);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (slug) {
            await imageUploader('blogs', slug);
            imageLister(`blogs%2F${slug}`).then(setCurrentImages);
        }
    };

    return (
        <AuthBlock>
            <Head>
                <title>Create Blog - rashil2000</title>
                <meta name="description" content="Add a blog on the site." />
                <meta property="og:image" content={`${baseUrl}/images/meta/blog.png`} />
            </Head>
            <main>
                <div className="abstract"><h2>Create Blog</h2></div>
                <br />
                <form onSubmit={handleBlogCreate} autoComplete='off'>

                    <label htmlFor="title" style={{ float: "left" }}>Title:</label>
                    <input type="text" id="title" name="title" style={{ float: "right" }} required value={title} onChange={e => setTitle(e.target.value?.trim())} /><br /><br />
                    <div style={{ clear: "both" }}></div>

                    <label htmlFor="description" style={{ float: "left" }}>Description:</label>
                    <input type="text" id="description" name="description" style={{ float: "right" }} required value={description} onChange={e => setDescription(e.target.value?.trim())} /><br /><br />
                    <div style={{ clear: "both" }}></div>

                    <label htmlFor="datetime" style={{ float: "left" }}>Date and Time:&nbsp;</label><label htmlFor="sn-datetime" className="sidenote-toggle">⋆</label>
                    <input type="datetime-local" id="datetime" name="datetime" style={{ float: "right" }} required value={date} onChange={e => setDate(e.target.value?.trim())} /><br />
                    <div style={{ clear: "both" }}></div>
                    <input type="checkbox" id="sn-datetime" className="sidenote-toggle" />
                    <span className="sidenote">Format: yyyy-mm-ddTHH:mm</span><br />

                    <label htmlFor="slug" style={{ float: "left" }}>Slug:&nbsp;</label><label htmlFor="sn-slug" className="sidenote-toggle">⋆</label>
                    <input type="text" id="slug" name="slug" style={{ float: "right" }} required value={slug} onChange={e => setSlug(e.target.value?.trim())} /><br />
                    <div style={{ clear: "both" }}></div>
                    <input type="checkbox" id="sn-slug" className="sidenote-toggle" />
                    <span className="sidenote">Once set, this is immutable</span><br />

                    <label htmlFor="preview" style={{ float: "left" }}>Preview Image:&nbsp;</label><label htmlFor="sn-preview" className="sidenote-toggle">⋆</label>
                    <input type="text" id="preview" name="preview" style={{ float: "right" }} value={preview} onChange={e => setPreview(e.target.value?.trim())} /><br />
                    <div style={{ clear: "both" }}></div>
                    <input type="checkbox" id="sn-preview" className="sidenote-toggle" />
                    <span className="sidenote">URL for link preview. Optional</span>

                    <label htmlFor="draft" style={{ float: "left" }}>Mark as draft:&nbsp;</label><label htmlFor="sn-draft" className="sidenote-toggle">⋆</label>
                    <input type="checkbox" id="draft" name="draft" style={{ float: "right" }} checked={draft} onChange={e => setDraft(e.target.checked)} />
                    <div style={{ clear: "both" }}></div>
                    <input type="checkbox" id="sn-draft" className="sidenote-toggle" />
                    <span className="sidenote">If checked, this blog won't be publicly visible</span>

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
                        <br /><button>Post</button><br /><br />
                    </div>

                </form>

                <div className="abstract"><h2>Images</h2></div>
                {currentImages && currentImages.children && currentImages.children.length !== 0
                    ?
                    <React.Fragment>
                        <span style={{ float: "left" }}>{slug}</span>
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
