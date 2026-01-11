// run-p0-tests.js
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

console.log(colors.cyan + '='.repeat(50) + colors.reset);
console.log(colors.bold + '  EJECUTANDO PRUEBAS P0 CON NEWMAN' + colors.reset);
console.log(colors.bold + '  Servidor: http://localhost:3001' + colors.reset);
console.log(colors.cyan + '='.repeat(50) + colors.reset);
console.log();

async function checkServer() {
    console.log('1. Verificando servidor...');
    
    return new Promise((resolve) => {
        const req = http.request('http://localhost:3001/api/v1/health', { timeout: 3000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(colors.green + '✅ Servidor funcionando' + colors.reset);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        
        req.on('error', () => {
            console.log(colors.red + '❌ ERROR: Servidor no responde' + colors.reset);
            console.log('   Ejecuta primero: node MockServer/server.js');
            resolve(false);
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log(colors.red + '❌ ERROR: Timeout - Servidor no responde' + colors.reset);
            resolve(false);
        });
        
        req.end();
    });
}

function runNewmanTests() {
    console.log('2. Ejecutando 3 pruebas P0...');
    console.log('   - P0-1: Cálculo exitoso');
    console.log('   - P0-2: Campo faltante');
    console.log('   - P0-3: Producto no existe');
    console.log();
    
    const collectionPath = path.join(__dirname, 'Testing_api', 'colections', 'P0-EndpointsCriticos.postman_collection.json');
    const envPath = path.join(__dirname, 'Testing_api', 'environments', 'P0-EndpointsCriticos.postman_environment.json');
    const reportsDir = path.join(__dirname, 'Reports');
    const reportPath = path.join(reportsDir, 'p0-report.html');
    
    // Crear carpeta Reports si no existe
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    //const command = `newman run "${collectionPath}" -e "${envPath}" -r cli,html --reporter-html-export "${reportPath}"`;
	const command = `newman run "${collectionPath}" -e "${envPath}" -r htmlextra --reporter-htmlextra-export "${reportPath}" --reporter-htmlextra-title "Reporte QA - Ahorro Digital" --reporter-htmlextra-browserTitle "Pruebas API" --reporter-htmlextra-darkTheme`;
	
    
    console.log(colors.yellow + 'Ejecutando: ' + command + colors.reset);
    console.log();
    
    try {
        execSync(command, { stdio: 'inherit' });
        console.log();
        console.log(colors.green + '✅ Todas las pruebas pasaron' + colors.reset);
        return true;
    } catch (error) {
        console.log();
        console.log(colors.red + '❌ Algunas pruebas fallaron' + colors.reset);
        return false;
    }
}

function openReport() {
    const reportPath = path.join(__dirname, 'Reports', 'p0-report.html');
    
    if (fs.existsSync(reportPath)) {
        console.log();
        console.log('3. Reporte generado en: ' + colors.cyan + reportPath + colors.reset);
        
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.question('¿Abrir reporte HTML? (s/N): ', (answer) => {
            if (answer.toLowerCase() === 's') {
                const platform = process.platform;
                let command;
                
                if (platform === 'win32') {
                    command = `start "" "${reportPath}"`;
                } else if (platform === 'darwin') {
                    command = `open "${reportPath}"`;
                } else {
                    command = `xdg-open "${reportPath}"`;
                }
                
                try {
                    execSync(command, { stdio: 'ignore' });
                    console.log(colors.green + 'Reporte abierto en navegador' + colors.reset);
                } catch (error) {
                    console.log(colors.yellow + 'No se pudo abrir automáticamente' + colors.reset);
                }
            }
            
            readline.close();
            finish();
        });
    } else {
        console.log(colors.red + '❌ No se generó el reporte HTML' + colors.reset);
        finish();
    }
}

function finish() {
    console.log();
    console.log(colors.cyan + '='.repeat(50) + colors.reset);
    console.log(colors.bold + '  Proceso completado' + colors.reset);
    console.log(colors.cyan + '='.repeat(50) + colors.reset);
    
    // Pausar (solo Windows)
    if (process.platform === 'win32') {
        console.log('\nPresiona cualquier tecla para continuar...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    }
}

async function main() {
    try {
        const serverOk = await checkServer();
        
        if (!serverOk) {
            if (process.platform === 'win32') {
                console.log('\nPresiona cualquier tecla para salir...');
                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.on('data', process.exit.bind(process, 1));
            } else {
                process.exit(1);
            }
            return;
        }
        
        const testsPassed = runNewmanTests();
        openReport();
        
    } catch (error) {
        console.error(colors.red + 'Error inesperado: ' + error.message + colors.reset);
        process.exit(1);
    }
}

// Ejecutar
main();