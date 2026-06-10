import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const capacity = searchParams.get('capacity');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const amenity = searchParams.get('amenity');

    let whereClause: any = { isAvailable: true };

    if (city) whereClause.city = { contains: city, mode: 'insensitive' };
    if (capacity) whereClause.capacity = { gte: parseInt(capacity) };
    if (minPrice || maxPrice) {
      whereClause.pricePerHour = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }
    if (amenity) {
      whereClause.amenities = { has: amenity };
    }

    const spaces = await prisma.space.findMany({
      where: whereClause,
      include: { host: { select: { name: true, image: true } } },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(spaces, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, address, city, pricePerHour, capacity, images, amenities, hostId } = body;

    const newSpace = await prisma.space.create({
      data: { title, description, address, city, pricePerHour, capacity, images, amenities, hostId },
    });

    return NextResponse.json(newSpace, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
  }
}