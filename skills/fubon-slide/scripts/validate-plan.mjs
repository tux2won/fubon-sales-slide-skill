#!/usr/bin/env node
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
export const registry=JSON.parse(readFileSync(resolve(here,'../references/layouts.json'),'utf8')).layouts;
export const styles=JSON.parse(readFileSync(resolve(here,'../references/styles.json'),'utf8'));
export function validatePlan(p,planDirectory){
 const errors=[],warnings=[];
 if(!p||typeof p!=='object'||Array.isArray(p))return {errors:['Plan must be an object.'],warnings};
 if(p.version!==1)errors.push('version must be 1.');
 for(const k of ['title','audience'])if(typeof p[k]!=='string'||!p[k].trim())errors.push(`${k} is required.`);
 if(!['ko','en','auto'].includes(p.language))errors.push('language must be ko, en, or auto.');
 if(!styles.styles.some(x=>x.id===p.style))errors.push('Unknown team style.');
 if(!['16:9','1:1','A4','reference'].includes(p.ratio))errors.push('Unknown ratio.');
 if(!['draft','approved'].includes(p.status))errors.push('status must be draft or approved.');
 if(p.brandColor&&!/^#[0-9a-f]{6}$/i.test(p.brandColor))errors.push('brandColor must be a six-digit hex color.');
 if(!Array.isArray(p.facts))errors.push('facts must be an array.');
 const factIds=new Set();
 for(const f of Array.isArray(p.facts)?p.facts:[]){
  if(typeof f?.id!=='string'||!f.id.trim()||factIds.has(f.id)){errors.push('Each fact must have a unique id.');continue;}
  factIds.add(f.id);
  if(!['verified','needs-review'].includes(f.status))errors.push(`Fact ${f.id}: invalid status.`);
  if(f.status==='verified'&&(!String(f.source||'').trim()||!String(f.page||'').trim()))errors.push(`Fact ${f.id}: verified facts require source and page/section.`);
  if(f.status==='needs-review')warnings.push(`Fact ${f.id}: still requires review.`);
 }
 if(!Array.isArray(p.slides)||p.slides.length<1||p.slides.length>60)errors.push('slides must contain 1–60 pages.');
 const ids=new Set();
 function checkRefs(refs,label){if(refs===undefined)return;if(!Array.isArray(refs))errors.push(`${label}: sourceIds must be an array.`);else for(const id of refs)if(!factIds.has(id))errors.push(`${label}: unknown source id ${id}.`);}
 const pageList=Array.isArray(p.slides)?p.slides:[];
 function checkImage(im,label,expectedSlots){const clean=String(im?.path||'').replaceAll('\\','/');if(!clean.startsWith('images/')||clean.split('/').includes('..')||isAbsolute(clean)||!/[.](png|jpe?g|webp|gif|svg)$/i.test(clean))errors.push(`${label}: image path must be a relative file inside images/.`);if(!String(im?.alt||'').trim()||!expectedSlots.includes(im?.slot))errors.push(`${label}: image alt text and registered slot are required.`);if(planDirectory&&clean.startsWith('images/')&&!clean.split('/').includes('..')&&!existsSync(resolve(planDirectory,clean)))errors.push(`${label}: image file does not exist.`);}
 for(const [i,s]of pageList.entries()){
  const label=`Slide ${i+1}`;
  if(typeof s?.id!=='string'||!s.id.trim()||ids.has(s.id))errors.push(`${label}: unique id required.`);ids.add(s?.id);
  const l=registry.find(x=>x.id===s?.layout);if(!l){errors.push(`${label}: unregistered layout ${s?.layout}.`);continue;}
  if(typeof s.title!=='string'||!s.title.trim())errors.push(`${label}: title required.`);
  if(!['cover','intro','body','outro','none'].includes(s.role))errors.push(`${label}: invalid role.`);
  if(s.items!==undefined&&!Array.isArray(s.items))errors.push(`${label}: items must be an array.`);
  const items=Array.isArray(s.items)?s.items:[];
  if(items.length<l.min||items.length>l.max)errors.push(`${label}: ${l.id} needs ${l.min}–${l.max} items; got ${items.length}.`);
  checkRefs(s.sourceIds,label);
  for(const [j,it]of items.entries()){
   if(typeof it?.title!=='string'||!it.title.trim())errors.push(`${label}, item ${j+1}: title required.`);
   checkRefs(it?.sourceIds,`${label}, item ${j+1}`);
   if(it?.image)checkImage(it.image,`${label}, item ${j+1}`,['scene-4x3','scene-portrait']);
   if(l.numeric){
    if(typeof it.value!=='number'||!Number.isFinite(it.value))errors.push(`${label}, item ${j+1}: finite numeric value required.`);
    if(!String(it.unit||'').trim()||!String(it.basis||'').trim())errors.push(`${label}, item ${j+1}: unit and basis required.`);
    if(!Array.isArray(it.sourceIds)||!it.sourceIds.length)errors.push(`${label}, item ${j+1}: numeric item requires a source.`);
    if(['S06','S07'].includes(l.id)&&it.value<0)errors.push(`${label}: negative values require a table or an explicitly designed diverging chart.`);
   }
   if(l.evidence&&!(it.sourceIds?.length||s.sourceIds?.length))errors.push(`${label}, item ${j+1}: evidence source required.`);
  }
  if(l.numeric&&items.length>1){if(new Set(items.map(x=>String(x.unit).trim())).size>1)errors.push(`${label}: numeric comparison mixes units.`);if(new Set(items.map(x=>String(x.basis).trim())).size>1)errors.push(`${label}: numeric comparison mixes bases.`);}
  if(l.kind==='table'){
   const t=s.table;if(!Array.isArray(t?.headers)||t.headers.length<2||t.headers.length>7)errors.push(`${label}: table needs 2–7 headers.`);
   if(!Array.isArray(t?.rows)||!t.rows.length||t.rows.length>7)errors.push(`${label}: table needs 1–7 rows; split dense tables.`);
   for(const [j,row]of (t?.rows||[]).entries()){if(!Array.isArray(row.cells)||row.cells.length!==t?.headers?.length)errors.push(`${label}: row ${j+1} column count mismatch.`);checkRefs(row.sourceIds,`${label}, row ${j+1}`);}
  }
  if(l.kind==='image'){
   const im=s.image,clean=String(im?.path||'').replaceAll('\\','/');
   if(!clean.startsWith('images/')||clean.split('/').includes('..')||isAbsolute(clean)||!/[.](png|jpe?g|webp|gif|svg)$/i.test(clean))errors.push(`${label}: image path must be a relative file inside images/.`);
   if(!im?.alt?.trim()||im.slot!=='s22-hero-21x9')errors.push(`${label}: S22 requires alt text and s22-hero-21x9 slot.`);
   if(planDirectory&&clean.startsWith('images/')&&!clean.split('/').includes('..')){const target=resolve(planDirectory,clean);if(relative(planDirectory,target).startsWith('..')||!existsSync(target))errors.push(`${label}: image file does not exist.`);}
  }
  if(s.title?.length>65)warnings.push(`${label}: long title needs visual review.`);
  if(items.some(x=>String(x.text||'').length>220))warnings.push(`${label}: dense item text needs visual review.`);
 }
 for(let i=2;i<pageList.length;i++)if(pageList[i]?.layout===pageList[i-1]?.layout&&pageList[i]?.layout===pageList[i-2]?.layout)warnings.push(`Slides ${i-1}–${i+1}: repeated layout; check that repetition is intentional.`);
 return {errors,warnings};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const file=process.argv[2];if(!file)throw new Error('Usage: node validate-plan.mjs <slide_plan.json>');const p=JSON.parse(readFileSync(file,'utf8').replace(/^\uFEFF/,''));const r=validatePlan(p,dirname(resolve(file)));for(const w of r.warnings)console.warn('WARN',w);for(const e of r.errors)console.error('ERROR',e);if(r.errors.length)process.exitCode=1;else console.log(`Plan valid: ${p.slides.length} slides, ${p.style} style.`);}catch(e){console.error(e.message);process.exitCode=1;}
}
