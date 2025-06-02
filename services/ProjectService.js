import dbConnect from "../lib/dbConnect";
import Project from "../models/Project";
import { getLastCommitDate, sortByDate } from "../lib/utils";

export const getProject = async slug => {
    await dbConnect();
    let project = await Project.findOne({slug});
    project.date = await getLastCommitDate(project.github);
    return JSON.parse(JSON.stringify(project));
}

export const getAllProjects = async () => {
    await dbConnect();
    let projects = await Project.find({});
    for (let item of projects)
        item.date = await getLastCommitDate(item.github);
    return sortByDate(JSON.parse(JSON.stringify(projects)));
}

export const getProjectSlugPaths = async () => {
    const projects = await getAllProjects();
    return projects.map(item => {
        return {params: {slug: item.slug}}
    });
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

    // TODO: authorize

    await dbConnect();
    try {
        const result = await Project.create(
            { title, description, content, slug, github, preview }
        );
        if (result._id) {
            document.getElementById('projectCreateSpan').innerHTML = `Created project "${result.title}".`;
            document.getElementById('projectForm').reset();
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

    // TODO: authorize

    await dbConnect();
    try {
        const result = await Project.findOneAndUpdate({ slug },
            { $set: { title, description, content, github, preview } },
            { new: true }
        );
        if (result._id)
            location = '/manage/projects';
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const deleteProject = async (slug, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from projects?`))
        return null;

    // TODO: authorize

    await dbConnect();
    try {
        const result = await Project.findOneAndDelete({ slug });
        if (result._id)
            document.getElementById(`projectsDeleteSpan`).innerHTML = `Removed "${result.title}" from projects.`;
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}