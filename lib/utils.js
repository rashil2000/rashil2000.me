import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";

import dbConnect from "./dbConnect";
import User from "../models/User";
import Blog from "../models/Blog";
import Project from "../models/Project";

// Common constants

export const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

export const sortByDate = array => array.sort((a, b) => {
  if (a.date < b.date) return 1;
  else return -1;
});

export const dateString = value => {
  const stringdate = value ? new Date(value) : new Date();
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export const getLastCommitDate = async identifier => {
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

export const validate = async password => {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      username: "rashil2000",
      password
    });

    if (result.ok) {
      history.back();
    } else {
      alert('Incorrect passphrase.');
    }
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

export const register = async (values) => {
  const {username, password, firstname, lastname} = values;
  await dbConnect();
  try {
    const userFound = await User.findOne({username});
    if (userFound) {
      alert('Error:\nUsername already exists!');
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstname,
      lastname,
      username,
      password: hashedPassword,
    });
    const newUser = await user.save();
    console.log('New user: ' + newUser);
  } catch (e) {
    alert('Error:\n' + JSON.stringify(e));
  }
}

export const buildFileTree = files => {
  if (!files || files.length === 0) {
    return { children: [] };
  }

  const findCommonPrefix = paths => {
    if (!paths || paths.length === 0) return '';
    let prefix = paths[0];
    for (let i = 1; i < paths.length; i++) {
      while (paths[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }
    if (prefix.includes('/')) {
      prefix = prefix.substring(0, prefix.lastIndexOf('/') + 1);
    } else if (paths.length > 1 && !paths.every(p => p === prefix)) {
      return '';
    }
    return prefix;
  };

  const pathnames = files.map(f => f.pathname);
  const prefix = findCommonPrefix(pathnames);

  const root = { children: [] };

  files.forEach(file => {
    const relativePath = file.pathname.substring(prefix.length);
    const parts = relativePath.split('/');
    let currentLevel = root.children;
    let currentPathParts = [];

    parts.forEach((part, index) => {
      currentPathParts.push(part);
      const isFile = index === parts.length - 1;
      let node = currentLevel.find(n => n.name === part);

      if (!node) {
        if (isFile) {
          node = {
            ...file,
            path: file.pathname,
            name: part,
            type: 'file',
          };
          currentLevel.push(node);
        } else {
          const path = prefix + currentPathParts.join('/');
          node = {
            path: path,
            name: part,
            type: 'directory',
            children: [],
            size: 0,
          };
          currentLevel.push(node);
        }
      }
      if (!isFile) {
        currentLevel = node.children;
      }
    });
  });

  const calculateSize = node => {
    if (node.type === 'file') {
      return node.size;
    }
    if (node.children) {
      node.size = node.children.reduce((sum, child) => sum + calculateSize(child), 0);
      return node.size;
    }
    return 0;
  };

  calculateSize(root);

  return root;
};

// Blog constants

export const getBlog = async slug => {
  await dbConnect();
  const blog = await Blog.findOne({ slug });
  return JSON.parse(JSON.stringify(blog));
}

export const getBlogs = async withSlugPaths => {
  await dbConnect();
  const blogs = await Blog.find({});
  if (withSlugPaths)
    return blogs.map(item => {
      return { params: { slug: item.slug } }
    });
  else
    return sortByDate(JSON.parse(JSON.stringify(blogs)));
}

// Project constants

export const getProject = async slug => {
  await dbConnect();
  let project = await Project.findOne({slug});
  project.date = await getLastCommitDate(project.github);
  return JSON.parse(JSON.stringify(project));
}

export const getProjects = async withSlugPaths => {
  await dbConnect();
  const projects = await Project.find({});
  if (withSlugPaths)
    return projects.map(item => {
      return { params: { slug: item.slug } }
    });
  else {
    for (let item of projects)
      item.date = await getLastCommitDate(item.github);
    return sortByDate(JSON.parse(JSON.stringify(projects)));
  }
}
