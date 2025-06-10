import { getServerSession } from "next-auth/next";

import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    await dbConnect();

    try {
        switch (req.method) {
            case "GET": {
                const projects = await Project.find(req.query);
                res.status(200).json(projects);
                break;
            }
            case "POST": {
                const session = await getServerSession(req, res, authOptions);
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }
                const project = await Project.create(req.body);
                // Fire off revalidations without waiting for them to complete
                Promise.all([
                    res.revalidate('/projects'),
                    res.revalidate(`/projects/${project.slug}`),
                    res.revalidate(`/manage/projects/${project.slug}`),
                ]).catch((err) => {
                    console.error("Error during background revalidation:", err);
                });
                return res.status(201).json(project);
            }
            case "DELETE": {
                const session = await getServerSession(req, res, authOptions);
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }
                const resp = await Project.deleteMany({});
                res.revalidate('/projects').catch((err) => {
                    console.error("Error during background revalidation:", err);
                });
                return res.status(200).json(resp);
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
