import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(readFileSync(resolve(root,'skills/fubon-slide/references/styles.json'),'utf8'));
writeFileSync(resolve(root,'web/styles-data.js'),'/* Generated from the skill style library. Production instructions are English. */\nwindow.TEAM_STYLES = '+JSON.stringify(data.styles,null,2)+';\nwindow.TEAM_COMMON_RULES = '+JSON.stringify(data.commonRules)+';\n','utf8');
console.log('Synchronized English style rules for the web prompter.');
