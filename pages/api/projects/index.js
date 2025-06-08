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
                try {
                    await res.revalidate('/projects')
                    await res.revalidate(`/projects/${project.slug}`)
                    await res.revalidate(`/manage/projects/${project.slug}`)
                    return res.status(201).json(project);
                } catch (err) {
                    return res.status(500).send('Error revalidating')
                }
            }
            case "DELETE": {
                const session = await getServerSession(req, res, authOptions);
                if (!session) {
                    res.status(401).json({ message: "You must be logged in." });
                    return;
                }
                const resp = await Project.deleteMany({});
                try {
                    await res.revalidate('/projects')
                    return res.status(200).json(resp);
                } catch (err) {
                    return res.status(500).send('Error revalidating')
                }
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
