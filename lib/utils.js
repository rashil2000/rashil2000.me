/* Utility functions, including API calls */

// Internal constants

const baseUrl = process.env.NEXT_PUBLIC_DB_HOST;

const sortByDate = array => array.sort((a, b) => {
  if (a.date < b.date) return 1;
  else return -1;
});

const getLastCommitDate = async identifier => {
  try {
    const res = await fetch(`https://api.github.com/repos/${identifier}/commits`);
    const data = await res.json();
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

// Exported constants

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

export const createBlog = async (title, description, content, slug, date) => {
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
      body: JSON.stringify({ title, description, content, slug, date }),
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

export const createProject = async (title, description, content, slug, github) => {
  if (!confirm('Are all input fields correct?'))
    return null;

  if (!(title && description && content && slug && github)) {
    alert("No field should remain empty!");
    return null;
  }
  var yes = github.match(/^([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\/([a-z\d](?:[a-z\d]|[-_.](?=[a-z\d])){0,99})$/i);
  console.log(yes);
  if (!yes) {
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
      body: JSON.stringify({ title, description, content, slug, github }),
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

export const dateString = value => {
  const stringdate = value ? new Date(value) : new Date();
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export const getSlugPaths = async arrayName => {
  const res = await fetch(`${baseUrl}/${arrayName}`);
  const array = await res.json();
  return array.map(item => { return { params: { slug: item.slug } } });
}

export const getAllBlogs = async signal => {
  const res = await fetch(`${baseUrl}/blogs`, { signal });
  const blogs = await res.json();
  return sortByDate(blogs);
}

export const getAllProjects = async signal => {
  const res = await fetch(`${baseUrl}/projects`, { signal });
  var projects = await res.json();
  for (var item of projects)
    item.date = await getLastCommitDate(item.github);
  return sortByDate(projects);
}

export const getBlog = async slug => {
  const res = await fetch(`${baseUrl}/blogs/${slug}`);
  const blog = await res.json();
  return blog;
}

export const getProject = async slug => {
  const res = await fetch(`${baseUrl}/projects/${slug}`);
  const project = await res.json();
  const date = await getLastCommitDate(project.github);
  return { date, ...project };
}

export const imageUploader = async (directory, folder, inputId, formId, spanId) => {
  if (!folder) {
    alert("Enter a slug.");
    return null;
  }
  const fileInput = document.getElementById(inputId);
  if (!fileInput.files.length) {
    alert("Upload an image.");
    return null;
  }
  await refresher();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

  var formdata = new FormData();
  formdata.append("imageFile", fileInput.files[0]);

  try {
    const response = await fetch(`${baseUrl}/image-upload?location=${directory}%2F${folder}`, {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    });
    const result = await response.json();
    const absolutePath = `${baseUrl}/${result.path.substr(7)}`;
    document.getElementById(spanId).innerHTML = `The image is available at <a target='_blank' href='${absolutePath}'>${absolutePath}</a>.`;
    document.getElementById(formId).reset();
    return console.log(result);
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}