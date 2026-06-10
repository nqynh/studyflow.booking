import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, spaceId, date, startTime, endTime, totalPrice } = body;

    // Kiểm tra trùng lịch đặt chỗ (Double Booking Check)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        spaceId,
        date: new Date(date),
        status: 'CONFIRMED',
        OR: [
          { AND: [{ startTime: { lte: startTime } }, { endTime: { gte: startTime } }] },
          { AND: [{ startTime: { lte: endTime } }, { endTime: { gte: endTime } }] }
        ]
      }
    });

    if (existingBooking) {
      return NextResponse.json({ error: 'Khung giờ này đã có người đặt!' }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        spaceId,
        date: new Date(date),
        startTime,
        endTime,
        totalPrice,
        status: 'PENDING'
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi tạo lịch đặt chỗ' }, { status: 500 });
  }
}