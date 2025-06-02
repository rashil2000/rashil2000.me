import dbConnect from "../lib/dbConnect";
import Blog from "../models/Blog";
import { dateString, sortByDate } from "../lib/utils";

export const getBlog = async slug => {
    await dbConnect();
    const blog = await Blog.findOne({slug});
    return JSON.parse(JSON.stringify(blog));
}

export const getAllBlogs = async () => {
    await dbConnect();
    const blogs = await Blog.find({});
    return sortByDate(JSON.parse(JSON.stringify(blogs)));
}

export const getBlogSlugPaths = async () => {
    const blogs = await getAllBlogs();
    return blogs.map(item => {
        return {params: {slug: item.slug}}
    });
}

export const createBlog = async (title, description, content, slug, date, preview) => {
    if (!confirm('Are all input fields correct?'))
        return null;

    if (!(title && description && content && slug && date)) {
        alert('No field should remain empty!');
        return null;
    }
    if (dateString(date) === 'NaN Invalid Date NaN') {
        alert("Enter a valid date.")
        return null;
    }

    // TODO: authorize

    await dbConnect();
    try {
        const result = await Blog.create(
            { title, description, content, slug, date, preview }
        );
        if (result._id) {
            document.getElementById('blogCreateSpan').innerHTML = `Created blog "${result.title}".`;
            document.getElementById('blogForm').reset();
        } else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const updateBlog = async (title, description, content, slug, date, preview) => {
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

    // TODO: authorize

    await dbConnect();
    try {
        const result = Blog.findOneAndUpdate(
            { slug },
            { $set: { title, description, content, date, preview } },
            { new: true }
        );
        if (result._id)
            location = '/manage/blogs';
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const deleteBlog = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from blogs?`))
        return null;

    // TODO: authorize

    await dbConnect();
    try {
        const result = await Blog.findOneAndDelete({ slug });
        if (result._id)
            document.getElementById(`blogsDeleteSpan`).innerHTML = `Removed "${result.title}" from blogs.`;
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}