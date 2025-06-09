import { getLastCommitDate, sortByDate } from "../lib/utils";

export const getAllProjects = async () => {
    const res = await fetch(`/api/projects`);
    let projects = await res.json();
    for (let item of projects)
        item.date = await getLastCommitDate(item.github);
    return sortByDate(projects);
}

export const createProject = async (title, description, content, slug, github, preview) => {
    if (!confirm('Are all input fields correct?'))
        return null;

    if (!(title && description && content && slug && github)) {
        alert("No field should remain empty!");
        return null;
    }
    if (!github.match(/^([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\/([a-z\d](?:[a-z\d]|[-_.](?=[a-z\d])){0,99})$/i)) {
        alert("Enter a valid GitHub identifier.");
        return null;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`/api/projects`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ title, description, content, slug, github, preview }),
            redirect: 'follow'
        });
        const result = await response.json();
        if (result._id) {
            document.getElementById('projectCreateSpan').innerHTML = `Created project "${result.title}".`;
            document.getElementById('projectForm').reset();
            return result;
        } else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const updateProject = async (title, description, content, slug, github, preview) => {
    if (!confirm('Are all input fields correct?'))
        return null;

    if (!(title && description && content && github)) {
        alert("No field should remain empty!");
        return null;
    }
    if (!github.match(/^([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\/([a-z\d](?:[a-z\d]|[-_.](?=[a-z\d])){0,99})$/i)) {
        alert("Enter a valid GitHub identifier.");
        return null;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`/api/projects/${slug}`, {
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
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const deleteProject = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from projects?`))
        return null;

    try {
        const response = await fetch(`/api/projects/${slug}`, {
            method: 'DELETE',
            redirect: 'follow'
        });
        const result = await response.json();
        if (result._id)
            document.getElementById(`projectsDeleteSpan`).innerHTML = `Removed "${result.title}" from projects.`;
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}