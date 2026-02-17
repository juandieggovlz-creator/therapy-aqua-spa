import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const services = [
        'cefalea-migrana', 'piso-pelvico', 'respiratorio', 'paralisis-facial',
        'reductor', 'pantorrillas-pies', 'drenaje', 'deportivo'
    ];
    for (const id of services) {
        const s = await prisma.servicio.findUnique({ where: { servicio_id: id } });
        console.log(`${id} Imagen:`, s?.imagen);
    }
}
main().catch(console.error).finally(async () => await prisma.$disconnect());
