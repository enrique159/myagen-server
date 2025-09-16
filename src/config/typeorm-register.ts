// Este archivo registra tsconfig-paths para resolver los alias @/ en las migraciones
import { register } from 'tsconfig-paths';
import * as path from 'path';
import * as fs from 'fs';

// Leer el archivo tsconfig.json manualmente
const tsconfigPath = path.join(__dirname, '..', '..', 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Registrar los paths del tsconfig.json
register({
  baseUrl: tsconfig.compilerOptions.baseUrl,
  paths: tsconfig.compilerOptions.paths,});
