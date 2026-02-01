# ✅ CORRECCIÓN: Precios de Afiliado en Servicios Adicionales

## 🐛 Problema Identificado

Cuando se aplicaban descuentos de afiliado, los servicios adicionales NO estaban usando el precio de afiliado ($13.000) en el desglose y cálculos. En lugar de eso, se seguía mostrando el precio particular ($29.900).

### **Ejemplo del Error:**
```
Servicios Adicionales:
🛁 Jacuzzi
  $29.900  ❌ (Debería mostrar $13.000)

💨 Baño Turco
  $29.900  ❌ (Debería mostrar $13.000)

Desglose:
Servicios Adicionales: $59.800  ❌ (Debería ser $26.000)
```

---

## 🔍 Causa del Error

### **1. Función `calcularPrecioFinal()`**
Estaba usando `precioAplicado || precioParticular || precio` sin considerar correctamente si era afiliado o no.

**❌ ANTES:**
```typescript
subtotalServiciosAdicionalesOriginal = reserva.serviciosAdicionales.reduce((sum, s) => {
  return sum + (s.precioAplicado || s.precioParticular || s.precio || 0);
}, 0);
```

### **2. Cálculo del Desglose**
Similar al anterior, no verificaba si era afiliado para usar el precio correcto.

**❌ ANTES:**
```typescript
subtotalServiciosAdicionales = reservaSeleccionada.serviciosAdicionales.reduce((sum, s) => {
  return sum + (s.precioAplicado || s.precio || s.precioParticular || 0);
}, 0);
```

### **3. Visualización de Precios**
Los precios en las tarjetas individuales tampoco reflejaban correctamente el precio de afiliado.

---

## ✅ Solución Implementada

### **1. Mejorada Función `calcularPrecioFinal()`**

**✅ AHORA:**
```typescript
let subtotalServiciosAdicionalesOriginal = 0;
let subtotalServiciosAdicionalesConAfiliado = 0;

if (reserva.serviciosAdicionales && reserva.serviciosAdicionales.length > 0) {
  reserva.serviciosAdicionales.forEach((s: any) => {
    const precioParticular = s.precioParticular || s.precio || 29900;
    const precioAfiliado = s.precioAfiliado || 13000;
    
    // Precio original siempre es el particular
    subtotalServiciosAdicionalesOriginal += precioParticular;
    
    // Si es afiliado, usar precio afiliado; sino, particular
    subtotalServiciosAdicionalesConAfiliado += reserva.esAfiliado ? precioAfiliado : precioParticular;
  });
}
```

**Beneficios:**
- ✅ Separa claramente el precio original del precio con descuento
- ✅ Usa el precio correcto según si es afiliado o no
- ✅ Maneja servicios como objetos o strings

---

### **2. Corregido Cálculo del Desglose**

**✅ AHORA:**
```typescript
subtotalServiciosAdicionales = reservaSeleccionada.serviciosAdicionales.reduce((sum, s) => {
  if (typeof s === 'object' && s !== null) {
    // Si es afiliado, usar precioAfiliado; sino, usar precioParticular
    if (reservaSeleccionada.esAfiliado) {
      return sum + (s.precioAfiliado || 13000);
    } else {
      return sum + (s.precioParticular || s.precio || 29900);
    }
  } else {
    // Si es afiliado, usar precio afiliado; sino, precio normal
    return sum + (reservaSeleccionada.esAfiliado ? 13000 : 29900);
  }
}, 0);
```

**Beneficios:**
- ✅ Verifica explícitamente si es afiliado
- ✅ Usa el precio correcto en cada caso
- ✅ El desglose muestra los valores reales

---

### **3. Mejorada Visualización de Servicios Adicionales**

**✅ AHORA:**
```typescript
const precioParticular = servicio?.precioParticular || servicio?.precio || 29900;
const precioAfiliado = servicio?.precioAfiliado || 13000;

// Determinar el precio a mostrar según si es afiliado o no
const precioFinal = reservaSeleccionada.esAfiliado ? precioAfiliado : precioParticular;
const ahorro = precioParticular - precioAfiliado;

// Mostrar precio tachado si es afiliado
{reservaSeleccionada.esAfiliado && (
  <p className="text-xs text-stone-500 line-through">
    {formatearPrecio(precioParticular)}
  </p>
)}

// Precio final en verde si es afiliado
<p className={`font-bold ${reservaSeleccionada.esAfiliado ? 'text-green-600' : 'text-blue-600'}`}>
  {formatearPrecio(precioFinal)}
</p>
```

**Beneficios:**
- ✅ Muestra precio tachado si es afiliado
- ✅ Precio final en verde para afiliados
- ✅ Muestra ahorro claramente

---

### **4. Bonus: Mejorada Visualización de Productos**

También mejoré la visualización de productos para que sea consistente:

```typescript
{/* Productos */}
{reservaSeleccionada.productos && reservaSeleccionada.productos.length > 0 && (
  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
    <p className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">
      Productos ({reservaSeleccionada.productos.length}):
    </p>
    <div className="space-y-2">
      {reservaSeleccionada.productos.map((producto: any, idx: number) => (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{icon || '📦'}</span>
            <div className="flex-1">
              <p className="font-semibold text-[#3d2817]">{nombre}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">
              {formatearPrecio(precio)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## 📊 Resultado Esperado

### **❌ Antes (Incorrecto):**
```
Servicios Adicionales:

🛁 Jacuzzi
$29.900  ← Precio particular (incorrecto)

💨 Baño Turco
$29.900  ← Precio particular (incorrecto)

Desglose:
Terapias: $360.000
Servicios Adicionales: $59.800  ← Incorrecto ($29.900 × 2)
Productos: $8.000
```

### **✅ Ahora (Correcto):**
```
Servicios Adicionales:

🛁 Jacuzzi
$29.900  ← Precio tachado
$13.000  ← Precio afiliado (verde)
Ahorro: $16.900

💨 Baño Turco
$29.900  ← Precio tachado
$13.000  ← Precio afiliado (verde)
Ahorro: $16.900

Productos:

👕 Kit ropa interior desechable
$8.000

Desglose:
Terapias: $360.000
Servicios Adicionales: $26.000  ← Correcto ($13.000 × 2)
Productos: $8.000
```

---

## 🎯 Lógica de Precios

### **Para Servicios Adicionales:**

| Tipo | Precio Particular | Precio Afiliado | Ahorro |
|------|------------------|----------------|--------|
| Sauna | $29.900 | $13.000 | $16.900 |
| Jacuzzi | $29.900 | $13.000 | $16.900 |
| Baño Turco | $29.900 | $13.000 | $16.900 |

### **Cálculo Completo para Afiliado:**

**Ejemplo: 2 Terapias ($180.000 c/u) + 2 Servicios Adicionales + 1 Producto**

1. **Subtotal Terapias:** $180.000 × 2 = $360.000
2. **Subtotal Servicios Adicionales (afiliado):** $13.000 × 2 = $26.000
3. **Subtotal Productos:** $8.000
4. **Total antes de descuento:** $360.000 + $26.000 + $8.000 = $394.000
5. **Descuento 20% afiliado:** $394.000 × 0.20 = $78.800
6. **Total Final:** $394.000 - $78.800 = **$315.200**

---

## 🧪 Prueba la Corrección

### **Paso 1: Crear una Reserva con Servicios Adicionales**
1. Ir a: `http://localhost:3000/reservas`
2. Seleccionar terapias
3. Agregar servicios adicionales (Jacuzzi, Sauna, etc.)
4. Aplicar código de afiliado
5. Completar la reserva

### **Paso 2: Ver en el Panel Admin**
1. Ir a: `http://localhost:3000/login/afiliados/admin`
2. Pestaña "Reservas"
3. Buscar la reserva creada
4. Click para ver detalles

### **Paso 3: Verificar**
✅ Los servicios adicionales muestran:
  - Precio tachado ($29.900)
  - Precio afiliado en verde ($13.000)
  - Ahorro calculado ($16.900)

✅ El desglose muestra:
  - Servicios Adicionales con el total correcto
  - Ejemplo: 2 servicios = $26.000 (no $59.800)

---

## ✅ Archivos Modificados

**`app/components/admin/ReservasTab.tsx`**
- Función `calcularPrecioFinal()` - Lógica de cálculo corregida
- Sección de visualización de servicios adicionales - Precios correctos
- Desglose de totales - Cálculo correcto según afiliado
- Visualización de productos - Mejorada para consistencia

---

## 🌐 Prueba Ahora

```
http://localhost:3000/login/afiliados/admin
```

**¡Los precios de afiliado ahora se calculan y muestran correctamente!** ⚡

