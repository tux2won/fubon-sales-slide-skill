#!/usr/bin/env node
import {cpSync,mkdirSync,readdirSync,readFileSync,statSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),source=resolve(root,'web');
function files(dir){return readdirSync(dir).flatMap(name=>{const p=resolve(dir,name);return statSync(p).isDirectory()?files(p):[p];});}
const args=process.argv.slice(2),i=args.indexOf('--out');if(i<0||!args[i+1]){console.error('Usage: node scripts/export-web.mjs --out <static-directory> [--check-only]');process.exit(2);}
const out=resolve(args[i+1]);if(out===root||source.startsWith(out+'/')||source.startsWith(out+'\\'))throw new Error('Choose a separate static output directory.');
if(!args.includes('--check-only')){mkdirSync(out,{recursive:true});for(const f of files(source)){const dest=resolve(out,relative(source,f));mkdirSync(dirname(dest),{recursive:true});cpSync(f,dest);}}
let checked=0;for(const f of files(source)){const dest=resolve(out,relative(source,f)),a=createHash('sha256').update(readFileSync(f)).digest('hex'),b=createHash('sha256').update(readFileSync(dest)).digest('hex');if(a!==b)throw new Error(`Website/source mismatch: ${relative(source,f)}`);checked++;}
console.log(`Verified identical website source and export: ${checked} files.`);
