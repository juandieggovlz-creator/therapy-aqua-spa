require('dotenv').config({ path: '.env.local' });
const { createClient } = require('redis');
const fs = require('fs');
const path = require('path');

async function syncContent() {
  try {
    console.log('🔄 Sincronizando contenido local a Redis Labs...');
    
    // Leer contenido local
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    const localContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    
    console.log('📖 Contenido local leído:', {
      servicios: localContent.servicios?.length || 0,
      productos: localContent.productos?.length || 0,
      horarios: localContent.cms?.horarios ? 'SÍ' : 'NO'
    });
    
    // Conectar a Redis
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL no configurada');
    }
    
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err) => console.error('❌ Redis Error:', err));
    await client.connect();
    console.log('✅ Conectado a Redis Labs');
    
    // Guardar en Redis
    await client.set('therapy:content', JSON.stringify(localContent));
    await client.set('therapy:content:version', localContent.version.toString());
    
    console.log('✅ Contenido sincronizado a Redis');
    console.log('📊 Versión:', localContent.version);
    
    // Verificar que se guardó correctamente
    const saved = await client.get('therapy:content');
    const savedData = JSON.parse(saved);
    
    console.log('\n📋 Horarios en Redis:');
    console.log('  Jueves:', savedData.cms?.horarios?.jueves?.abierto ? 'Abierto' : 'Cerrado');
    console.log('  Viernes:', savedData.cms?.horarios?.viernes?.abierto ? 'Abierto' : 'Cerrado');
    console.log('  Sábado:', savedData.cms?.horarios?.sabado?.abierto ? 'Abierto' : 'Cerrado');
    console.log('  Domingo:', savedData.cms?.horarios?.domingo?.abierto ? 'Abierto' : 'Cerrado');
    
    await client.quit();
    console.log('\n🎉 Sincronización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

syncContent();

