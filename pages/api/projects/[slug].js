import { getServerSession } from "next-auth/next";

import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { slug } = req.query;
    await dbConnect();

    try {
        switch (req.method) {
            case "GET": {
                const project = await Project.findOne({ slug });
                if (!project) {
                    return res.status(404).json({ message: "Project not found" });
                }
                res.status(200).json(project);
                break;
            }
            case "PUT": {
                const session = await getServerSession(req, res, authOptions);
                if (!session) {
                    return res.status(401).json({ message: "You must be logged in." });
                }
                const project = await Project.findOneAndUpdate(
                    { slug },
                    { $set: req.body },
                    { new: true }
                );
                if (!project) {
                    return res.status(404).json({ message: "Project not found" });
                }
                try {
                    await res.revalidate('/projects')
                    await res.revalidate(`/projects/${slug}`)
                    await res.revalidate(`/manage/projects/${slug}`)
                    return res.status(200).json(project);
                } catch (err) {
                    return res.status(500).send('Error revalidating')
                }
            }
            case "DELETE": {
                const session = await getServerSession(req, res, authOptions);
                if (!session) {
                    return res.status(401).json({ message: "You must be logged in." });
                }
                const project = await Project.findOneAndDelete({ slug });
                if (!project) {
                    return res.status(404).json({ message: "Project not found" });
                }
                try {
                    await res.revalidate('/projects')
                    return res.status(200).json(project);
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
