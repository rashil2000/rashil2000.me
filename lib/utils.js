/* Utility functions, including API calls */

// Common constants

export const baseUrl = process.env.NEXT_PUBLIC_DB_HOST;

const sortByDate = array => array.sort((a, b) => {
  if (a.date < b.date) return 1;
  else return -1;
});

export const dateString = value => {
  const stringdate = value ? new Date(value) : new Date();
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export const getSlugPaths = async arrayName => {
  const res = await fetch(`${baseUrl}/${arrayName}`);
  const array = await res.json();
  return array.map(item => { return { params: { slug: item.slug } } });
}

const getLastCommitDate = async identifier => {
  try {
    const res = await fetch(`https://api.github.com/repos/${identifier}/commits`);
    const data = await res.json();
    if (data.message && data.message.includes('Not Found')) {
      console.log(`'${identifier}' is not a (public) GitHub respository.`);
      return 'null';
    } else if (data.message && data.message.includes('rate limit exceeded')) {
      console.log(`GitHub API rate limit exceeded for '${identifier}'. Please wait for a while.`);
      return 'null';
    }
    return data[0].commit.committer.date;
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

const refresher = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/users/auth-refresh`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: "rashil2000", encryptedPassword: localStorage.getItem('enc_cred') }),
      redirect: 'follow'
    });
    const result = await response.json();
    if (result.success) {
      if (result.refreshStatus) localStorage.setItem('token', result.token);
    } else {
      if (result.err)
        alert(result.status + '\n' + result.err);
      else
        alert(result.status + '\n' + result.info.message);
    }
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

export const validate = async password => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: "rashil2000", password }),
      redirect: 'follow'
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('enc_cred', result.localData.encryptedPassword);
      history.back();
    } else {
      if (result.err)
        alert(result.status + '\n' + result.err);
      else if (result.info && result.info.message == 'Password or username is incorrect')
        alert('Incorrect passphrase.');
      else
        alert(result.status + '\n' + result.info.message);
    }
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

export const itemDeleter = async (group, slug, title) => {
  if (!confirm(`Are you sure you want to remove "${title}" from ${group}?`))
    return null;

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

  try {
    const response = await fetch(`${baseUrl}/${group}/${slug}`, {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    });
    const result = await response.json();
    if (result._id)
      document.getElementById(`${group}DeleteSpan`).innerHTML = `Removed "${result.title}" from ${group}.`;
    else
      alert(JSON.stringify(result));
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

export const imageLister = async group => {
  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

  const response = await fetch(`${baseUrl}/assets?location=images%2F${group}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });
  return await response.json();
}

export const imageUploader = async (directory, folder) => {
  if (!folder) {
    alert("Enter a slug.");
    return null;
  }
  const fileInput = document.getElementById('imageInput');
  if (!fileInput.files.length) {
    alert("Upload an image.");
    return null;
  }

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

  var formdata = new FormData();
  formdata.append("uploadedFile", fileInput.files[0]);

  try {
    const response = await fetch(`${baseUrl}/assets?location=images%2F${directory}%2F${folder}`, {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    });
    const result = await response.json();
    document.getElementById('imageSpan').innerHTML = `'${result.filename}' uploaded in '${folder}'.`;
    document.getElementById('imageForm').reset();
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

export const imageDeleter = async identifier => {
  if (!confirm(`Are you sure you want to remove "${identifier.split('/').slice(3).join('/')}"?`))
    return null;

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

  try {
    const response = await fetch(`${baseUrl}/assets?location=${identifier.substr(7)}`, {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    });
    const result = await response.json();
    if (result.success)
      document.getElementById(`imageSpan`).innerHTML = `Removed '${result.location.split('/').slice(3).join('/')}'.`;
    else
      alert(JSON.stringify(result));
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}


// Blog constants

export const getBlog = async slug => {
  const res = await fetch(`${baseUrl}/blogs/${slug}`);
  const blog = await res.json();
  return blog;
}

export const getAllBlogs = async () => {
  const res = await fetch(`${baseUrl}/blogs`);
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

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/blogs`, {
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

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/blogs/${slug}`, {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({ title, description, content, date, preview }),
      redirect: 'follow'
    });
    const result = await response.json();
    if (result._id)
      location = '/manage/blogs';
    else
      alert(JSON.stringify(result));
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}


// Project constants

export const getProject = async slug => {
  const res = await fetch(`${baseUrl}/projects/${slug}`);
  const project = await res.json();
  const date = await getLastCommitDate(project.github);
  return { date, ...project };
}

export const getAllProjects = async () => {
  const res = await fetch(`${baseUrl}/projects`);
  var projects = await res.json();
  for (var item of projects)
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

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ title, description, content, slug, github, preview }),
      redirect: 'follow'
    });
    const result = await response.json();
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

  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/projects/${slug}`, {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({ title, description, content, github, preview }),
      redirect: 'follow'
    });
    const result = await response.json();
    if (result._id)
      location = '/manage/projects';
    else
      alert(JSON.stringify(result));
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}
