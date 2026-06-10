import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const space = await prisma.space.findUnique({
      where: { id: params.id },
      include: {
        host: { select: { name: true, image: true, email: true } },
        reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    return NextResponse.json(space, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch space details' }, { status: 500 });
  }
}