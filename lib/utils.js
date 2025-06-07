import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";

import dbConnect from "./dbConnect";
import User from "../models/User";
import Blog from "../models/Blog";
import Project from "../models/Project";

// Common constants

export const baseUrl = process.env.NEXT_PUBLIC_DB_HOST;

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