import { getServerSession } from "next-auth/next";

import dbConnect from "../../../lib/dbUtils";
import Blog from "../../../models/Blog";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  try {
    switch (req.method) {
      case "GET": {
        const query = { ...req.query };

        // If the user is not authenticated, only return published blogs
        if (!session) {
          query.draft = { $ne: true };
        }

        const blogs = await Blog.find(query);
        res.status(200).json(blogs);
        break;
      }
      case "POST": {
        if (!session) {
          res.status(401).json({ message: "You must be logged in." });
          return;
        }
        const blog = await Blog.create(req.body);
        // Fire off revalidations without waiting for them to complete
        Promise.all([
          res.revalidate('/blogs'),
          res.revalidate(`/blogs/${blog.slug}`),
        ]).catch((err) => {
          console.error("Error during background revalidation:", err);
        });
        return res.status(201).json(blog);
      }
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
