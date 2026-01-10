// server.js CORREGIDO
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data mejorado
const products = {
  'cdt-180': { 
    name: 'CDT 180 días', 
    interestRate: 0.06, 
    minAmount: 500000,
    maxAmount: 10000000,
    description: 'Certificado de Depósito a Término 180 días'
  },
  'savings-basic': { 
    name: 'Cuenta Ahorro Básica', 
    interestRate: 0.035, 
    minAmount: 50000,
    maxAmount: 5000000,
    description: 'Cuenta de ahorros para uso diario'
  }
};

// P0-1: POST /simulator/calculate - MEJORADO
app.post('/api/v1/simulator/calculate', (req, res) => {
  const { productId, amount, months } = req.body;
  
  // Validación 1: Campos requeridos
  if (!productId || amount === undefined || months === undefined) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'productId, amount y months son requeridos',
        fields: {
          productId: !productId ? 'requerido' : 'ok',
          amount: amount === undefined ? 'requerido' : 'ok',
          months: months === undefined ? 'requerido' : 'ok'
        }
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Validación 2: Tipos de datos
  if (typeof amount !== 'number' || typeof months !== 'number') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'amount y months deben ser números',
        fields: {
          amount: typeof amount,
          months: typeof months
        }
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Validación 3: Valores positivos
  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_AMOUNT',
        message: 'El monto debe ser mayor a 0',
        field: 'amount'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  if (months <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_MONTHS',
        message: 'El plazo debe ser al menos 1 mes',
        field: 'months'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Validación 4: Producto existe
  const product = products[productId];
  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: 'Producto no encontrado',
        suggestedProducts: Object.keys(products)
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Validación 5: Monto mínimo del producto
  if (amount < product.minAmount) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MIN_AMOUNT_REQUIRED',
        message: `El monto mínimo para este producto es ${product.minAmount.toLocaleString()} COP`,
        field: 'amount',
        minAmount: product.minAmount
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Validación 6: Monto máximo (si existe)
  if (product.maxAmount && amount > product.maxAmount) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MAX_AMOUNT_EXCEEDED',
        message: `El monto máximo para este producto es ${product.maxAmount.toLocaleString()} COP`,
        field: 'amount',
        maxAmount: product.maxAmount
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Cálculo con validación de overflow
  try {
    const earnings = amount * product.interestRate * (months / 12);
    const totalAmount = amount + earnings;
    
    // Validar que los cálculos no den NaN o infinito
    if (!isFinite(earnings) || !isFinite(totalAmount)) {
      throw new Error('Cálculo numérico inválido');
    }
    
    res.json({
      success: true,
      data: {
        earnings: parseFloat(earnings.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        currency: 'COP',
        interestRate: product.interestRate,
        annualYield: product.interestRate * 100,
        months: months,
        initialAmount: amount,
        productName: product.name
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CALCULATION_ERROR',
        message: 'Error en el cálculo financiero'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// P0-3: GET /products/:id - MEJORADO
app.get('/api/v1/products/:id', (req, res) => {
  const product = products[req.params.id];
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: `Producto con ID "${req.params.id}" no encontrado`
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: {
      id: req.params.id,
      ...product
    },
    timestamp: new Date().toISOString()
  });
});

// GET /products (para P2-7) - MEJORADO
app.get('/api/v1/products', (req, res) => {
  const productList = Object.entries(products).map(([id, details]) => ({
    id,
    name: details.name,
    interestRate: details.interestRate,
    annualYield: details.interestRate * 100,
    minAmount: details.minAmount,
    maxAmount: details.maxAmount || null,
    description: details.description
  }));
  
  res.json({
    success: true,
    data: productList,
    count: productList.length,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ahorro-digital-mock-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/v1/products',
      simulator: '/api/v1/simulator/calculate',
      health: '/api/v1/health'
    }
  });
});

// ⚠️ ELIMINADO: Manejo de rutas no encontradas (causa error)
// ⚠️ ELIMINADO: Error handling middleware (causa error)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Mock server running on http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`  GET  http://localhost:${PORT}/api/v1/health`);
  console.log(`  GET  http://localhost:${PORT}/api/v1/products`);
  console.log(`  GET  http://localhost:${PORT}/api/v1/products/:id`);
  console.log(`  POST http://localhost:${PORT}/api/v1/simulator/calculate`);
  console.log(`\n🚀 Pruebas P0 listas para ejecutar:`);
  console.log(`   1. Cálculo exitoso`);
  console.log(`   2. Campo faltante`);
  console.log(`   3. Producto no existe`);
});