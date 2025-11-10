# 📊 API Reference - Sistema de Reportes

Documentación técnica de endpoints del sistema de reportes para boutique de ropa.

---

## 🌐 Base URL

```
http://localhost:8000/api/v1/reports
```

**Producción:** Reemplazar con la URL de tu servidor backend.

---

## 📧 1. Generar Reporte con Lenguaje Natural (N8N)

### Endpoint

```
POST /api/v1/reports/generate/
```

### 📋 Descripción

Este endpoint **no genera el reporte directamente**, sino que actúa como un **proxy** que reenvía la solicitud a N8N (plataforma de automatización de workflows). N8N es el encargado de:

- Procesar la solicitud
- Generar el reporte usando lenguaje natural
- Enviarlo por correo electrónico al destinatario

### 🔗 Flujo del Proceso

```
Cliente Frontend → Backend Django → N8N Webhook → Procesamiento → Email enviado
                   (proxy)          (genera reporte)
```

**URL del Webhook N8N:**

```
https://albatab.app.n8n.cloud/webhook-test/report/nlp
```

### 📥 Request

**Método HTTP:** `POST`

**Content-Type:** `application/json`

**Body (JSON):**

```json
{
  "user_email": "email@ejemplo.com"
}
```

| Campo        | Tipo   | Requerido | Por Defecto                   | Descripción                        |
| ------------ | ------ | --------- | ----------------------------- | ---------------------------------- |
| `user_email` | string | No        | `garcia.brayan3001@gmail.com` | Email del destinatario del reporte |

**Ejemplo de Request:**

```http
POST /api/v1/reports/generate/
Content-Type: application/json

{
  "user_email": "maria@boutique.com"
}
```

**Si se omite el email:**

```http
POST /api/v1/reports/generate/
Content-Type: application/json

{}
```

Se usará automáticamente: `garcia.brayan3001@gmail.com`

### 📤 Response

#### ✅ Success (HTTP 200 OK)

**Significado:** El reporte fue enviado exitosamente a N8N y procesado correctamente.

```json
{
  "message": "Reporte enviado exitosamente a maria@boutique.com",
  "status": "success"
}
```

| Campo     | Tipo   | Descripción                                           |
| --------- | ------ | ----------------------------------------------------- |
| `message` | string | Mensaje de confirmación con el email del destinatario |
| `status`  | string | Siempre retorna `"success"` en caso exitoso           |

#### ❌ Error (HTTP 500 Internal Server Error)

**Casos de error:**

- N8N no está disponible
- Timeout de conexión con N8N
- Error en el webhook de N8N
- Problema al enviar el correo

```json
{
  "error": "Error al generar el reporte",
  "details": "Connection timeout to N8N webhook"
}
```

| Campo     | Tipo   | Descripción                                       |
| --------- | ------ | ------------------------------------------------- |
| `error`   | string | Descripción general del error                     |
| `details` | string | Detalles técnicos del error (puede estar ausente) |

### 🔍 Notas Importantes

1. **Este endpoint NO retorna el contenido del reporte**, solo confirma si fue enviado correctamente
2. **El reporte se genera en N8N**, no en el backend de Django
3. **El tiempo de procesamiento depende de N8N**, puede tardar varios segundos
4. **No hay validación de formato de email** en el backend, N8N debe manejarlo
5. **El backend hace timeout después de 30 segundos** esperando respuesta de N8N

### 💡 Ejemplo de Uso

**Request con curl:**

```bash
curl -X POST http://localhost:8000/api/v1/reports/generate/ \
  -H "Content-Type: application/json" \
  -d '{"user_email": "maria@boutique.com"}'
```

**Request con PowerShell:**

```powershell
$body = @{
    user_email = "maria@boutique.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/reports/generate/" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

---

## 📊 2. Dashboard Principal

### Endpoint

```
GET /api/v1/reports/dashboard/
```

### 📋 Descripción

Retorna **todos los datos consolidados** necesarios para renderizar el dashboard administrativo de la boutique. Este endpoint realiza múltiples consultas a la base de datos y las agrupa en un único response.

**Datos incluidos:**

- Resumen de ventas del mes
- Indicadores de morosidad
- Evolución de ventas (última semana)
- Ingresos diarios (última semana)
- Top 5 productos más vendidos
- Top 5 clientes frecuentes
- Productos con stock crítico
- Distribución de ingresos por método de pago
- Distribución de ventas por tipo (contado/crédito)

### 📥 Request

**Método HTTP:** `GET`

**Parámetros:** Ninguno

**Headers:** No requiere headers especiales

**Ejemplo:**

```http
GET /api/v1/reports/dashboard/
```

### 📤 Response

#### ✅ Success (HTTP 200 OK)

La respuesta es un objeto JSON con 8 secciones principales:

---

#### 📊 **1. RESUMEN GENERAL** (`resumen`)

Indicadores clave del negocio para mostrar en cards/widgets.

```json
{
  "resumen": {
    "ventas_mes": {
      "total": 15420.5, // float - Total en Bolivianos de ventas del mes
      "cantidad": 45, // int - Número de ventas realizadas
      "promedio": 342.68 // float - Ticket promedio (total/cantidad)
    },
    "morosidad": {
      "cuotas_vencidas": 8, // int - Cuotas que pasaron su fecha de vencimiento
      "monto_vencido": 2400.0, // float - Dinero que debió haberse cobrado
      "cuotas_pendientes": 15, // int - Cuotas aún no pagadas pero no vencidas
      "monto_pendiente": 5600.0 // float - Dinero por cobrar (no vencido)
    },
    "productos_sin_movimiento": 12, // int - Productos sin ventas en últimos 30 días
    "productos_stock_critico": 5 // int - Productos agotados o con stock bajo
  }
}
```

**Período de cálculo:**

- `ventas_mes`: Últimos 30 días desde hoy
- `productos_sin_movimiento`: Sin ventas en últimos 30 días

---

#### 📈 **2. VENTAS DE LA ÚLTIMA SEMANA** (`ventas_semana`)

Datos para gráfico de línea/área que muestra evolución diaria de ventas.

```json
{
  "ventas_semana": [
    { "fecha": "2025-11-03", "total": 1234.5 },
    { "fecha": "2025-11-04", "total": 2456.8 },
    { "fecha": "2025-11-05", "total": 1890.3 },
    { "fecha": "2025-11-06", "total": 3120.0 },
    { "fecha": "2025-11-07", "total": 2678.9 },
    { "fecha": "2025-11-08", "total": 1950.0 },
    { "fecha": "2025-11-09", "total": 2090.0 }
  ]
}
```

| Campo   | Tipo   | Formato    | Descripción                                |
| ------- | ------ | ---------- | ------------------------------------------ |
| `fecha` | string | YYYY-MM-DD | Fecha de la venta                          |
| `total` | float  | -          | Suma de todas las ventas de ese día en Bs. |

**Características:**

- Siempre retorna 7 elementos (una semana completa)
- Ordenado cronológicamente (más antiguo primero)
- Si no hay ventas en un día, ese día podría no aparecer (verificar con datos reales)

---

#### 💰 **3. INGRESOS DIARIOS** (`ingresos_diarios`)

Datos para gráfico de barras que muestra pagos recibidos por día.

```json
{
  "ingresos_diarios": [
    { "fecha": "2025-11-03", "total": 1000.0 },
    { "fecha": "2025-11-04", "total": 2000.0 },
    { "fecha": "2025-11-05", "total": 1500.0 },
    { "fecha": "2025-11-06", "total": 2800.0 },
    { "fecha": "2025-11-07", "total": 2200.0 },
    { "fecha": "2025-11-08", "total": 1800.0 },
    { "fecha": "2025-11-09", "total": 1900.0 }
  ]
}
```

| Campo   | Tipo   | Formato    | Descripción                            |
| ------- | ------ | ---------- | -------------------------------------- |
| `fecha` | string | YYYY-MM-DD | Fecha del pago                         |
| `total` | float  | -          | Suma de pagos recibidos ese día en Bs. |

**Diferencia con `ventas_semana`:**

- `ventas_semana`: Monto total de las **ventas** (puede ser a crédito)
- `ingresos_diarios`: Dinero **realmente recibido** (pagos efectuados)

---

#### 🏆 **4. TOP 5 PRODUCTOS MÁS VENDIDOS** (`top_productos`)

Ranking de productos por cantidad vendida en los últimos 30 días.

```json
{
  "top_productos": [
    {
      "nombre": "Vestido Floral Primavera",
      "cantidad_vendida": 25,
      "ingresos": 3750.0,
      "imagen": "productos/vestido_floral.jpg"
    },
    {
      "nombre": "Chaqueta Cuero Negro",
      "cantidad_vendida": 12,
      "ingresos": 4800.0,
      "imagen": null
    }
  ]
}
```

| Campo              | Tipo           | Descripción                                        |
| ------------------ | -------------- | -------------------------------------------------- |
| `nombre`           | string         | Nombre del producto                                |
| `cantidad_vendida` | int            | Total de unidades vendidas                         |
| `ingresos`         | float          | Ingresos totales generados por este producto (Bs.) |
| `imagen`           | string \| null | Ruta de la imagen del producto, puede ser `null`   |

**Características:**

- Máximo 5 productos
- Ordenado por `cantidad_vendida` (descendente)
- Período: últimos 30 días
- `ingresos` = `cantidad_vendida` × `precio_promedio`

---

#### 👥 **5. TOP 5 CLIENTES** (`top_clientes`)

Clientes que más dinero han gastado en los últimos 30 días.

```json
{
  "top_clientes": [
    {
      "nombre": "María García López",
      "correo": "maria.garcia@gmail.com",
      "telefono": "70123456",
      "total_compras": 5680.0,
      "cantidad_compras": 8
    }
  ]
}
```

| Campo              | Tipo   | Descripción                  |
| ------------------ | ------ | ---------------------------- |
| `nombre`           | string | Nombre completo del cliente  |
| `correo`           | string | Email del cliente            |
| `telefono`         | string | Teléfono del cliente         |
| `total_compras`    | float  | Dinero total gastado en Bs.  |
| `cantidad_compras` | int    | Número de compras realizadas |

**Características:**

- Máximo 5 clientes
- Ordenado por `total_compras` (descendente)
- Solo incluye clientes registrados (no ventas anónimas)
- Período: últimos 30 días

---

#### ⚠️ **6. STOCK CRÍTICO** (`stock_critico`)

Productos que necesitan atención urgente por stock bajo o agotado.

```json
{
  "stock_critico": [
    {
      "producto": "Vestido Noche Negro",
      "talla": "M",
      "stock_actual": 0,
      "stock_minimo": 3,
      "estado": "AGOTADO"
    },
    {
      "producto": "Blusa Seda Blanca",
      "talla": "S",
      "stock_actual": 1,
      "stock_minimo": 5,
      "estado": "BAJO"
    }
  ]
}
```

| Campo          | Tipo   | Valores                 | Descripción                       |
| -------------- | ------ | ----------------------- | --------------------------------- |
| `producto`     | string | -                       | Nombre del producto               |
| `talla`        | string | -                       | Talla específica del producto     |
| `stock_actual` | int    | ≥ 0                     | Cantidad disponible en inventario |
| `stock_minimo` | int    | > 0                     | Cantidad mínima requerida         |
| `estado`       | string | `"AGOTADO"` \| `"BAJO"` | Estado del stock                  |

**Lógica de estados:**

- `AGOTADO`: `stock_actual` = 0
- `BAJO`: `stock_actual` > 0 pero ≤ `stock_minimo`

**Características:**

- Máximo 10 productos
- Ordenado por `stock_actual` (ascendente) - más críticos primero
- Solo incluye productos con `stock_actual` ≤ `stock_minimo` o = 0

---

#### 💳 **7. INGRESOS POR MÉTODO DE PAGO** (`ingresos_metodo`)

Distribución de ingresos según el método de pago utilizado.

```json
{
  "ingresos_metodo": [
    {
      "metodo": "efectivo",
      "total": 8500.0,
      "cantidad_transacciones": 25
    },
    {
      "metodo": "tarjeta",
      "total": 5200.0,
      "cantidad_transacciones": 15
    },
    {
      "metodo": "qr",
      "total": 1720.5,
      "cantidad_transacciones": 8
    }
  ]
}
```

| Campo                    | Tipo   | Valores Posibles                  | Descripción                           |
| ------------------------ | ------ | --------------------------------- | ------------------------------------- |
| `metodo`                 | string | `"efectivo"`, `"tarjeta"`, `"qr"` | Método de pago                        |
| `total`                  | float  | -                                 | Total recaudado por este método (Bs.) |
| `cantidad_transacciones` | int    | -                                 | Número de pagos con este método       |

**Características:**

- Siempre retorna 3 elementos (uno por cada método)
- Si no hay transacciones de un método, `total` = 0 y `cantidad_transacciones` = 0
- Período: últimos 30 días
- Útil para gráficos circulares/donut

---

#### 🛒 **8. VENTAS POR TIPO** (`ventas_tipo`)

Distribución entre ventas al contado y a crédito.

```json
{
  "ventas_tipo": [
    {
      "tipo": "contado",
      "total": 12500.0,
      "cantidad": 35
    },
    {
      "tipo": "credito",
      "total": 2920.5,
      "cantidad": 10
    }
  ]
}
```

| Campo      | Tipo   | Valores Posibles         | Descripción                              |
| ---------- | ------ | ------------------------ | ---------------------------------------- |
| `tipo`     | string | `"contado"`, `"credito"` | Tipo de venta                            |
| `total`    | float  | -                        | Monto total de ventas de este tipo (Bs.) |
| `cantidad` | int    | -                        | Número de ventas de este tipo            |

**Características:**

- Siempre retorna 2 elementos
- Si no hay ventas de un tipo, `total` = 0 y `cantidad` = 0
- Período: últimos 30 días
- `contado`: Venta pagada al momento
- `credito`: Venta con cuotas

### Ejemplo Real de Response

```json
{
  "resumen": {
    "ventas_mes": {
      "total": 15420.5,
      "cantidad": 45,
      "promedio": 342.68
    },
    "morosidad": {
      "cuotas_vencidas": 8,
      "monto_vencido": 2400.0,
      "cuotas_pendientes": 15,
      "monto_pendiente": 5600.0
    },
    "productos_sin_movimiento": 12,
    "productos_stock_critico": 5
  },
  "ventas_semana": [
    { "fecha": "2025-11-03", "total": 1234.5 },
    { "fecha": "2025-11-04", "total": 2456.8 },
    { "fecha": "2025-11-05", "total": 1890.3 },
    { "fecha": "2025-11-06", "total": 3120.0 },
    { "fecha": "2025-11-07", "total": 2678.9 },
    { "fecha": "2025-11-08", "total": 1950.0 },
    { "fecha": "2025-11-09", "total": 2090.0 }
  ],
  "ingresos_diarios": [
    { "fecha": "2025-11-03", "total": 1000.0 },
    { "fecha": "2025-11-04", "total": 2000.0 },
    { "fecha": "2025-11-05", "total": 1500.0 },
    { "fecha": "2025-11-06", "total": 2800.0 },
    { "fecha": "2025-11-07", "total": 2200.0 },
    { "fecha": "2025-11-08", "total": 1800.0 },
    { "fecha": "2025-11-09", "total": 1900.0 }
  ],
  "top_productos": [
    {
      "nombre": "Vestido Floral Primavera",
      "cantidad_vendida": 25,
      "ingresos": 3750.0,
      "imagen": "productos/vestido_floral.jpg"
    },
    {
      "nombre": "Blusa Manga Larga Beige",
      "cantidad_vendida": 20,
      "ingresos": 2800.0,
      "imagen": "productos/blusa_beige.jpg"
    },
    {
      "nombre": "Pantalón Jean Skinny",
      "cantidad_vendida": 18,
      "ingresos": 2520.0,
      "imagen": "productos/jean_skinny.jpg"
    },
    {
      "nombre": "Chaqueta Cuero Negro",
      "cantidad_vendida": 12,
      "ingresos": 4800.0,
      "imagen": null
    },
    {
      "nombre": "Falda Plisada Rosa",
      "cantidad_vendida": 15,
      "ingresos": 1950.0,
      "imagen": "productos/falda_rosa.jpg"
    }
  ],
  "top_clientes": [
    {
      "nombre": "María García López",
      "correo": "maria.garcia@gmail.com",
      "telefono": "70123456",
      "total_compras": 5680.0,
      "cantidad_compras": 8
    },
    {
      "nombre": "Ana Rodríguez",
      "correo": "ana.rodriguez@hotmail.com",
      "telefono": "71234567",
      "total_compras": 4230.5,
      "cantidad_compras": 6
    },
    {
      "nombre": "Carmen Flores",
      "correo": "carmen.flores@yahoo.com",
      "telefono": "72345678",
      "total_compras": 3890.0,
      "cantidad_compras": 5
    },
    {
      "nombre": "Lucía Martínez",
      "correo": "lucia.martinez@gmail.com",
      "telefono": "73456789",
      "total_compras": 3450.0,
      "cantidad_compras": 7
    },
    {
      "nombre": "Sofia Sánchez",
      "correo": "sofia.sanchez@outlook.com",
      "telefono": "74567890",
      "total_compras": 2980.0,
      "cantidad_compras": 4
    }
  ],
  "stock_critico": [
    {
      "producto": "Vestido Noche Negro",
      "talla": "M",
      "stock_actual": 0,
      "stock_minimo": 3,
      "estado": "AGOTADO"
    },
    {
      "producto": "Blusa Seda Blanca",
      "talla": "S",
      "stock_actual": 1,
      "stock_minimo": 5,
      "estado": "BAJO"
    },
    {
      "producto": "Pantalón Formal Gris",
      "talla": "L",
      "stock_actual": 2,
      "stock_minimo": 4,
      "estado": "BAJO"
    }
  ],
  "ingresos_metodo": [
    {
      "metodo": "efectivo",
      "total": 8500.0,
      "cantidad_transacciones": 25
    },
    {
      "metodo": "tarjeta",
      "total": 5200.0,
      "cantidad_transacciones": 15
    },
    {
      "metodo": "qr",
      "total": 1720.5,
      "cantidad_transacciones": 8
    }
  ],
  "ventas_tipo": [
    {
      "tipo": "contado",
      "total": 12500.0,
      "cantidad": 35
    },
    {
      "tipo": "credito",
      "total": 2920.5,
      "cantidad": 10
    }
  ]
}
```

#### ❌ Error (HTTP 500 Internal Server Error)

```json
{
  "error": "Error al obtener datos",
  "traceback": "Traceback (most recent call last):\n  File..."
}
```

**Posibles causas:**

- Error en consulta a la base de datos
- Datos corruptos en algún modelo
- Problema de conexión con la base de datos

### 💡 Ejemplo de Uso

**Request con curl:**

```bash
curl http://localhost:8000/api/v1/reports/dashboard/
```

**Request con PowerShell:**

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/reports/dashboard/" -Method Get | ConvertTo-Json -Depth 10
```

---

## � Especificaciones Técnicas Adicionales

### Formatos de Datos

#### Fechas

- **Formato**: ISO 8601 (`YYYY-MM-DD`)
- **Timezone**: Fecha local del servidor (sin información de zona horaria)
- **Ejemplo**: `"2025-11-09"`

#### Moneda

- **Divisa**: Bolivianos (Bs.)
- **Formato**: Float con 2 decimales
- **Ejemplo**: `1234.50`

#### Imágenes

- **Tipo**: String con ruta relativa o `null`
- **Base Path**: Debes agregar el dominio del servidor
- **Ejemplo completo**: `https://tu-servidor.com/media/productos/vestido_floral.jpg`
- **Si es `null`**: Usar imagen placeholder

### Periodos de Cálculo

| Dato                       | Período         | Base de Cálculo               |
| -------------------------- | --------------- | ----------------------------- |
| `ventas_mes`               | Últimos 30 días | Desde hoy - 30 días hasta hoy |
| `ventas_semana`            | Últimos 7 días  | Desde hoy - 7 días hasta hoy  |
| `ingresos_diarios`         | Últimos 7 días  | Desde hoy - 7 días hasta hoy  |
| `top_productos`            | Últimos 30 días | Desde hoy - 30 días hasta hoy |
| `top_clientes`             | Últimos 30 días | Desde hoy - 30 días hasta hoy |
| `productos_sin_movimiento` | Últimos 30 días | Productos sin ventas          |
| `ingresos_metodo`          | Últimos 30 días | Pagos recibidos               |
| `ventas_tipo`              | Últimos 30 días | Ventas realizadas             |

### Valores Enumerados

#### Estados de Stock

```
AGOTADO - Stock actual = 0
BAJO    - Stock actual > 0 pero ≤ stock mínimo
```

#### Métodos de Pago

```
efectivo - Pago en efectivo
tarjeta  - Pago con tarjeta (débito/crédito)
qr       - Pago mediante código QR
```

#### Tipos de Venta

```
contado - Venta pagada completamente al momento
credito - Venta con sistema de cuotas
```

### Consideraciones de Rendimiento

- **Tiempo de respuesta estimado**: 1-3 segundos
- **Tamaño de respuesta**: ~15-50 KB (comprimido)
- **Consultas a BD**: ~10-15 queries
- **Recomendación de caché**: 30-60 segundos
- **Índices requeridos**: En fechas, cliente_id, producto_id

### Limitaciones

1. **Stock Crítico**: Máximo 10 productos
2. **Top Productos**: Máximo 5 productos
3. **Top Clientes**: Máximo 5 clientes
4. **Ventas Semana**: Siempre 7 días (puede tener días sin datos)
5. **Ingresos Diarios**: Siempre 7 días (puede tener días sin datos)

---

## 📝 Notas de Integración

### Manejo de Valores Nulos

```json
{
  "imagen": null, // Usar imagen placeholder
  "telefono": "", // String vacío vs null
  "correo": "sin@correo.com" // Puede tener valores placeholder
}
```

### Casos Especiales

**Sin ventas en un día:**

- El día puede no aparecer en `ventas_semana` o tener `total: 0`
- Verificar ambos casos en el frontend

**Sin clientes registrados:**

- `top_clientes` será un array vacío `[]`

**Sin productos críticos:**

- `stock_critico` será un array vacío `[]`
- `productos_stock_critico` en resumen será `0`

**División por cero:**

- Si `cantidad` = 0, `promedio` será `0.0` (no `null` ni error)

### Formato de Moneda Boliviana

Para mostrar correctamente en el frontend:

```javascript
// JavaScript
const formato = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
});
formato.format(1234.5); // "Bs1.234,50"

// Alternativa simple
const simple = `Bs. ${(1234.5).toFixed(2)}`; // "Bs. 1234.50"
```

### Conversión de Fechas a Días

```javascript
const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const fecha = new Date("2025-11-09"); // Sábado
const diaNombre = dias[fecha.getDay()]; // "Sáb"
```

---

## 🌐 Configuración de Entorno

### Desarrollo

```bash
API_BASE_URL=http://localhost:8000
```

### Producción

```bash
API_BASE_URL=https://api.tu-boutique.com
```

### CORS

El backend debe estar configurado para aceptar requests desde tu dominio frontend:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://tu-boutique.com",
]
```

---

## ⚠️ Errores Comunes

### Error 500: Internal Server Error

**Causa común**: Base de datos sin datos, modelos corruptos, o consultas fallidas.
**Solución**: Verificar logs del servidor Django, revisar que existan datos en las tablas.

### Error 404: Not Found

**Causa**: Endpoint incorrecto o app `reports` no incluida en URLs.
**Solución**: Verificar que `/api/v1/reports/` esté configurado en `urls.py`.

### Respuesta vacía o sin datos

**Causa**: No hay datos en el período consultado (últimos 30 días).
**Solución**: Verificar que existan ventas, productos y clientes en la base de datos.

### CORS Error

**Causa**: Frontend y backend en dominios diferentes sin configuración CORS.
**Solución**: Agregar frontend origin en `CORS_ALLOWED_ORIGINS`.

---

## 📞 Testing y Validación

### Probar con curl

```bash
# Dashboard completo
curl -X GET http://localhost:8000/api/v1/reports/dashboard/ | jq

# Generar reporte
curl -X POST http://localhost:8000/api/v1/reports/generate/ \
  -H "Content-Type: application/json" \
  -d '{"user_email": "test@example.com"}' | jq
```

### Probar con Postman

**Collection Request:**

- Method: `GET`
- URL: `http://localhost:8000/api/v1/reports/dashboard/`
- Headers: Ninguno requerido
- Body: Ninguno

**Expected Response Time:** < 3 segundos

---

## 📊 Resumen de Endpoints

| Endpoint      | Método | Autenticación | Retorna              | Propósito                        |
| ------------- | ------ | ------------- | -------------------- | -------------------------------- |
| `/generate/`  | POST   | No\*          | Confirmación         | Enviar reporte por email vía N8N |
| `/dashboard/` | GET    | No\*          | JSON con 8 secciones | Datos completos para dashboard   |

_Nota: Actualmente sin autenticación. Considerar agregar en producción._

---

**Documentación actualizada:** 9 de noviembre de 2025  
**Versión de API:** 1.0  
**Backend:** Django 5.2.7 + Django REST Framework 3.16.1
