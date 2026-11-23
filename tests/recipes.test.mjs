import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {recipes} from '../dist/content.js';
for(const recipe of recipes.flat()){
 assert.equal(recipe.source,`recipes/${recipe.image}.html`);
 const html=await readFile(new URL('../dist/'+recipe.source,import.meta.url),'utf8');
 assert.ok(html.includes(`<h1>${recipe.title}</h1>`),'destination must match the clicked dish');
 assert.ok(html.includes('准备食材')&&html.includes('制作步骤'));
 assert.ok(!html.includes('meishichina.com')&&!html.includes('hunan.gov.cn'));
 await access(new URL(`../dist/assets/recipes/${recipe.image}.webp`,import.meta.url));
}
assert.equal(recipes.flat().length,20);
console.log('Passed: twenty working local destinations, matching dishes, ingredients/steps and images.');
