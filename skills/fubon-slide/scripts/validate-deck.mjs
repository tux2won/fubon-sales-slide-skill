#!/usr/bin/env node
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {registry} from './validate-plan.mjs';
export function validateDeck(html,directory){
 const errors=[],warnings=[],clean=html.replace(/<!--[\s\S]*?-->/g,''),pages=[...clean.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)].filter(m=>/class=["'][^"']*\bslide\b/.test(m[1]));
 if(!pages.length)errors.push('No slide sections found.');
 if(!/<html\b[^>]*data-style=["'](?:brand|info|story)["']/.test(clean))errors.push('Missing registered team style.');
 if(!/<html\b[^>]*data-language=["'](?:ko|en)["']/.test(clean))errors.push('Missing slide language.');
 if(/\{\{[A-Z]+\}\}/.test(clean))errors.push('Unresolved template token.');
 if(/<script[^>]+src=["']https?:/i.test(clean)||/<link[^>]+href=["']https?:/i.test(clean))errors.push('Deck depends on remote scripts or styles.');
 let active=0;
 pages.forEach((m,i)=>{const tag=m[1],body=m[2],layout=tag.match(/data-layout=["']([^"']+)/)?.[1];if(!registry.some(x=>x.id===layout))errors.push(`Slide ${i+1}: unregistered layout.`);if(/class=["'][^"']*\bactive\b/.test(tag))active++;if(!/<footer\b/.test(body))errors.push(`Slide ${i+1}: source/disclosure footer missing.`);if(!/<h[12]\b/.test(body))errors.push(`Slide ${i+1}: heading missing.`);if(/<svg\b[\s\S]*?<text\b/.test(body))errors.push(`Slide ${i+1}: visible SVG text is not editable HTML.`);if(layout==='S22'&&!/data-image-slot="s22-hero-21x9"/.test(body))errors.push(`Slide ${i+1}: image slot missing.`);
 for(const image of body.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)){if(!image[1].startsWith('images/')||image[1].split('/').includes('..'))errors.push(`Slide ${i+1}: image outside local images directory.`);else if(directory&&!existsSync(resolve(directory,image[1])))errors.push(`Slide ${i+1}: missing image file.`);if(!/\balt="[^"]+"/.test(image[0]))errors.push(`Slide ${i+1}: image alt text missing.`);}
 });
 if(active!==1)errors.push('Exactly one slide must be active initially.');
 for(const id of ['deck','navigation','index','previous','next'])if(!new RegExp(`id=["']${id}["']`).test(clean))errors.push(`Missing ${id} UI element.`);
 return {errors,warnings,pages:pages.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const file=process.argv[2];if(!file)throw new Error('Usage: node validate-deck.mjs <index.html>');const r=validateDeck(readFileSync(file,'utf8'),dirname(resolve(file)));for(const x of r.errors)console.error('ERROR',x);if(r.errors.length)process.exitCode=1;else console.log(`Deck valid: ${r.pages} slides. Visual and factual review still required.`);}catch(e){console.error(e.message);process.exitCode=1;}}
