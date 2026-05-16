
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	await prisma.partCar.deleteMany();
	await prisma.parts.deleteMany();
	await prisma.carModel.deleteMany();
	await prisma.carBrand.deleteMany();
	await prisma.seller.deleteMany();
	await prisma.user.deleteMany();
	await prisma.category.deleteMany();

	// إضافة التصنيفات الأساسية
	await prisma.category.createMany({
		data: [
			{ id: 1, name: "Engine & Drivetrain" },
			{ id: 2, name: "Brakes" },
			{ id: 3, name: "Suspension & Steering" },
			{ id: 4, name: "Electrical & Lighting" },
			{ id: 5, name: "Cooling, Heating & AC" },
			{ id: 6, name: "Wheels & Tires" },
			{ id: 7, name: "Body & Exterior" },
			{ id: 8, name: "Interior" },
			{ id: 9, name: "Oils, Fluids & Maintenance" },
			{ id: 10, name: "Tools & Garage" },
			{ id: 11, name: "Accessories & Electronics" },
			{ id: 12, name: "Performance Parts" },
		],
		skipDuplicates: true,
	});
}

main().finally(() => process.exit());
