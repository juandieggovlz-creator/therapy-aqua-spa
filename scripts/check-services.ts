import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const servicios = await prisma.servicio.findMany({
        select: {
            servicio_id: true,
            nombre: true,
            imagen: true
        }
    });
    console.log(JSON.stringify(servicios, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
