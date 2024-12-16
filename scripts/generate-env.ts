const fs = require('fs');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const configContent = `export const ENV = ${JSON.stringify(env, null, 2)};`;

fs.writeFileSync('./src/app/config.ts', configContent);
console.log('Environment variables generated!');
