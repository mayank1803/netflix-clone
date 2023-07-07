import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';

import { getServerSession } from "next-auth";
import { without } from "lodash";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
    

    const session = await getServerSession(req, res,authOptions) 

    if (!session?.user?.email) {
      throw new Error('Not signed in');
    }

    const { movieId } = req.body;

    const existingMovie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      }
    });

    if (!existingMovie) {
      throw new Error('Invalid ID');
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email');
    }

    const updatedFavoriteIds = without(user.favouriteIds, movieId);

    const updatedUser = await prismadb.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favouriteIds: updatedFavoriteIds,
      }
    });

    return res.status(200).json(updatedUser);
}
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}