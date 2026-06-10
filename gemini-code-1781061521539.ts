import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Tạo Host & User mẫu
  const host = await prisma.user.create({
    data: { name: 'Minh Trí', email: 'host@studyspace.vn', password: hashedPassword, role: 'HOST', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  });

  const user = await prisma.user.create({
    data: { name: 'Hoàng Long', email: 'user@studyspace.vn', password: hashedPassword, role: 'USER', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  });

  // Mảng dữ liệu 10 phòng học mẫu cao cấp
  const spacesData = [
    {
      title: 'The Silent Box - Phòng Học Cá Nhân Cực Yên Tĩnh',
      description: 'Phòng học thiết kế tối giản, cách âm 100%, trang bị đèn bảo vệ mắt và ghế Ergonomic thế hệ mới giúp bạn tập trung cao độ.',
      address: '12 Cầu Giấy, Láng Thượng', city: 'Hà Nội', pricePerHour: 35000, capacity: 1,
      amenities: ['Wifi', 'AC', 'Quiet', 'Outlet'],
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174']
    },
    {
      title: 'Creative Lab Co-working Space',
      description: 'Không gian mở tràn ngập ánh sáng tự nhiên và cây xanh. Phù hợp cho các bạn làm Freelancer hoặc đồ án nhóm.',
      address: '251 Điện Biên Phủ, Quận 3', city: 'Hồ Chí Minh', pricePerHour: 50000, capacity: 6,
      amenities: ['Wifi', 'AC', 'Coffee', 'Projector', 'Outlet'],
      images: ['https://images.unsplash.com/photo-1539635278303-d4002c07eae3', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2']
    },
    // Thêm các phòng học khác tương tự để đủ 10 phòng...
  ];

  for (const space of spacesData) {
    const createdSpace = await prisma.space.create({
      data: { ...space, hostId: host.id, rating: 4.8 }
    });

    // Tạo review mẫu cho từng không gian
    await prisma.review.create({
      data: { userId: user.id, spaceId: createdSpace.id, rating: 5, comment: 'Không gian tuyệt vời, rất yên tĩnh và nước uống ngon!' }
    });
  }

  console.log('🌱 Seed dữ liệu thành công!');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });