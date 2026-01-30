-- Script para poblar la tabla de configuración con datos iniciales
-- Ejecutar este script en la base de datos de Neon

-- Eliminar configuraciones existentes si hay conflictos
-- DELETE FROM configuracion WHERE clave IN (...);

-- Información General
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('nombre_negocio', 'Therapy Aqua Spa', 'text', 'Nombre del negocio', 'general', true),
('eslogan', 'Terapia que alivia tu cuerpo', 'text', 'Eslogan principal', 'general', true),
('descripcion_corta', 'Fisioterapia profesional y masajes terapéuticos en el corazón de Bogotá', 'textarea', 'Descripción breve del negocio', 'general', true);

-- Información de Contacto
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('telefono_contacto', '+57 301 4185239', 'text', 'Número de teléfono principal', 'contacto', true),
('whatsapp', '+573014185239', 'text', 'Número de WhatsApp (sin espacios ni símbolos)', 'contacto', true),
('email', 'contacto@therapyaquaspa.com', 'email', 'Correo electrónico de contacto', 'contacto', true),
('direccion', 'Bogotá, Colombia', 'text', 'Dirección física del spa', 'contacto', true),
('direccion_completa', 'Calle XX # XX-XX, Bogotá, Colombia', 'textarea', 'Dirección completa', 'contacto', true);

-- Redes Sociales
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('facebook', 'https://facebook.com/therapyaquaspa', 'text', 'URL de Facebook', 'redes_sociales', true),
('instagram', 'https://instagram.com/therapyaquaspa', 'text', 'URL de Instagram', 'redes_sociales', true),
('tiktok', '', 'text', 'URL de TikTok', 'redes_sociales', true);

-- Horarios de Atención
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('horario_lunes_viernes', '8:00 AM - 8:00 PM', 'text', 'Horario de lunes a viernes', 'horarios', true),
('horario_sabados', '8:00 AM - 8:00 PM', 'text', 'Horario los sábados', 'horarios', true),
('horario_domingos', 'Cerrado', 'text', 'Horario los domingos', 'horarios', true);

-- Sobre Nosotros
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('sobre_nosotros_titulo', 'Sobre Nosotros', 'text', 'Título de la sección Sobre Nosotros', 'sobre_nosotros', true),
('sobre_nosotros_descripcion', 'En Therapy Aqua Spa, nos especializamos en fisioterapia y masajes terapéuticos. Con años de experiencia, nuestro equipo de profesionales certificados se dedica a mejorar tu salud y bienestar. Utilizamos técnicas modernas y personalizadas para cada paciente, garantizando resultados efectivos.', 'textarea', 'Descripción de la empresa', 'sobre_nosotros', true),
('mision', 'Proporcionar servicios de fisioterapia de alta calidad que mejoren la salud física y emocional de nuestros clientes, utilizando técnicas innovadoras y un enfoque personalizado.', 'textarea', 'Misión de la empresa', 'sobre_nosotros', true),
('vision', 'Ser el centro de fisioterapia y bienestar más reconocido de Bogotá, destacándonos por la excelencia en nuestros servicios y la satisfacción de nuestros clientes.', 'textarea', 'Visión de la empresa', 'sobre_nosotros', true);

-- Términos y Condiciones
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('terminos_reservas', 'Las reservas deben confirmarse con al menos 1 hora de anticipación. Las cancelaciones deben realizarse con 2 horas de antelación.', 'textarea', 'Términos para reservas', 'terminos', true),
('politica_cancelacion', 'Cancelaciones con menos de 2 horas de anticipación no serán reembolsadas.', 'textarea', 'Política de cancelación', 'terminos', true);

-- Información adicional
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria, editable_por_gerente)
VALUES 
('clientes_atendidos', '500', 'number', 'Número de clientes atendidos', 'general', true),
('terapias_disponibles', '14', 'number', 'Número de terapias disponibles', 'general', true),
('calificacion_promedio', '5', 'number', 'Calificación promedio (sobre 5)', 'general', true);

-- Nota: Este script debe ejecutarse solo una vez o usar INSERT ... ON CONFLICT DO NOTHING
-- Para Postgres, se puede usar:
-- INSERT INTO configuracion (...) VALUES (...) ON CONFLICT (clave) DO NOTHING;

