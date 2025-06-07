import { baseUrl, dateString, sortByDate } from "../lib/utils";

export const getAllBlogs = async () => {
    const res = await fetch(`${baseUrl}/api/blogs`);
    const blogs = await res.json();
    return sortByDate(blogs);
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

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`${baseUrl}/api/blogs`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ title, description, content, slug, date, preview }),
            redirect: 'follow'
        });
        const result = await response.json();
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

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({ title, description, content, date, preview }),
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
}

export const deleteBlog = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from blogs?`))
        return null;

    try {
        const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
            method: 'DELETE',
            redirect: 'follow'
        });
        const result = await response.json();
        if (result._id)
            document.getElementById(`blogsDeleteSpan`).innerHTML = `Removed "${result.title}" from blogs.`;
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}