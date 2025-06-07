import { getServerSession } from "next-auth/next";

import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  try {
    switch (req.method) {
      case "GET": {
        const blogs = await Blog.find(req.query);
        res.status(200).json(blogs);
        break;
      }
      case "POST": {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          res.status(401).json({ message: "You must be logged in." });
          return;
        }
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
        break;
      }
      case "DELETE": {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          res.status(401).json({ message: "You must be logged in." });
          return;
        }
        const resp = await Blog.deleteMany({});
        res.status(200).json(resp);
        break;
      }
      default: {
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
