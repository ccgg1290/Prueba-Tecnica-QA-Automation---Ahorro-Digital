
# 🧪 Prueba Técnica QA Automation - Ahorro Digital

## 📋 Descripción del Proyecto
**Ahorro Digital** es una aplicación web ficticia donde los usuarios pueden explorar productos de ahorro y simular cuánto podrían ganar con sus depósitos. Este proyecto contiene las pruebas automatizadas de API para validar su funcionamiento.


## 1. Verificar requisitos previos

```bash
node --version   # Node.js 18 o superior
npm --version    # npm 6+
newman --version
```

### 1.1 Instalación de dependencias
si las dependias no estan instaladas:
Descargar node en: https://nodejs.org
```bash
npm install -g newman
npm install -g newman newman-reporter-html
```
## 2. Descargar y descomprimir el repositorio
Descargar el ZIP del repositorio desde GitHub  
Descomprimir en una carpeta local  
Tambien puedes clonar el repo
## 3. Navegar a la carpeta del proyecto
```bash
cd [ruta_donde_descomprimiste O ruta donde clonaste el repo]
```
## 4. iniciar servidor
```bash
node MockServer/server.js
```
Deberías ver:  

✅ Mock server running on http://localhost:3001  
📊 Endpoints disponibles:  
  GET  http://localhost:3001/api/v1/health  
  GET  http://localhost:3001/api/v1/products  
  GET  http://localhost:3001/api/v1/products/:id  
  POST http://localhost:3001/api/v1/simulator/calculate  

  🚀 Pruebas P0 listas para ejecutar:  
   1. Cálculo exitoso  
   2. Campo faltante  
   3. Producto no existe  


## 6. Ejecutar pruebas automatizadas (en otra terminal)
```bash
node runTest.js
```

🧪 Pruebas Implementadas

P0 - Pruebas Críticas (3 pruebas automáticas)

✅ P0-1: Cálculo financiero preciso (POST /simulator/calculate)  

✅ P0-2: Validación de campo obligatorio faltante (productId)  

✅ P0-3: Manejo de producto no existente (error 404)  

## 7. 📊 Reportes Generados
Al ejecutar las pruebas se crea automáticamente:  
Reports/  
└── p0-report.html  # Reporte HTML visual con resultados  
Para ver el reporte: Abre Reports/p0-report.html en tu navegador.  

## 8 🏗️ Estructura del Proyecto

├── MockServer/                    # Servidor API de prueba  
│   ├── server.js                 # API mock con Express.js  
│   └── package.json              # Dependencias (express, cors)  
├── Testing_api/                  # Pruebas automatizadas  
│   ├── collections/              # Colección Postman P0-Críticos  
│   └── environments/             # Variables de entorno  
├── Reports/                      # Reportes generados  
├── runTest.js                    # Script principal de ejecución  
├── package.json                  # Configuración del proyecto  
└── README.md                     # Este archivo  

