import { getServerSession } from "next-auth/next";

import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { slug } = req.query;
  await dbConnect();

  try {
    switch (req.method) {
      case "GET": {
        const blog = await Blog.findOne({ slug });
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
        break;
      }
      case "PUT": {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ message: "You must be logged in." });
        }
        const blog = await Blog.findOneAndUpdate(
          { slug },
          { $set: req.body },
          { new: true }
        );
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        try {
          await res.revalidate('/blogs')
          await res.revalidate(`/blogs/${slug}`)
          await res.revalidate(`/manage/blogs/${slug}`)
          return res.status(200).json(blog);
        } catch (err) {
          return res.status(500).send('Error revalidating')
        }
      }
      case "DELETE": {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ message: "You must be logged in." });
        }
        const blog = await Blog.findOneAndDelete({ slug });
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        try {
          await res.revalidate('/blogs')
          return res.status(200).json(blog);
        } catch (err) {
          return res.status(500).send('Error revalidating')
        }
      }
      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
