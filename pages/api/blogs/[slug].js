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
        // Fire off revalidations without waiting for them to complete
        Promise.all([
          res.revalidate('/blogs'),
          res.revalidate(`/blogs/${slug}`),
          res.revalidate(`/manage/blogs/${slug}`),
        ]).catch((err) => {
          console.error("Error during background revalidation:", err);
        });
        return res.status(200).json(blog);
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
        res.revalidate('/blogs').catch((err) => {
          console.error("Error during background revalidation:", err);
        });
        return res.status(200).json(blog);
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
