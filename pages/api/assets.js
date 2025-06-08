import { getServerSession } from 'next-auth/next';
import { handleUpload } from '@vercel/blob/client';
import { del, list } from '@vercel/blob';

import { authOptions } from './auth/[...nextauth]';
import { buildFileTree } from '../../lib/utils';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  const { location } = req.query;

  try {
    switch (req.method) {
      case 'POST': {
        const body = req.body;
        try {
          const jsonResponse = await handleUpload({
            body,
            request: req,
            onBeforeGenerateToken: async (pathname) => {
              if (location && !pathname.startsWith(location)) {
                throw new Error('Invalid path name.');
              }
              return {
                allowedContentTypes: [
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'text/plain',
                  'text/svg',
                  'application/pdf',
                  'video/mp4',
                ],
                tokenPayload: JSON.stringify({
                  pathname,
                  location,
                }),
              };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
              console.log('Blob upload completed', blob, tokenPayload);
            },
          });
          return res.status(200).json(jsonResponse);
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
      }
      case 'GET': {
        const { blobs } = await list({
          prefix: location,
        });
        const fileTree = buildFileTree(blobs.filter(blob => blob.size !== 0));
        return res.status(200).json(fileTree);
      }
      case 'DELETE': {
        if (location) {
          const { blobs } = await list({ prefix: location });
          if (blobs.length > 0) {
            const urls = blobs.map((blob) => blob.url);
            await del(urls);
          }
          return res.status(200).json({ success: true, location });
        }
        const { url } = req.query;
        if (url) {
          await del(url);
          return res.status(200).json({ success: true, deleted: [url] });
        }
        return res
          .status(400)
          .json({ message: 'A `location` or `url` query parameter is required.' });
      }
      default: {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    console.error('Error in /api/assets:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}