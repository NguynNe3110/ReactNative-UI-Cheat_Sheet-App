// Lấy source thật cho tab Code. Chạy lại sau khi sửa demo: npm run sync-examples.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'src', 'demos');
const sources = {};
for (const filename of fs
  .readdirSync(directory)
  .filter(name => name.endsWith('Demos.tsx'))
  .sort()) {
  const source = fs.readFileSync(path.join(directory, filename), 'utf8');
  const ast = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const imports = ast.statements
    .filter(ts.isImportDeclaration)
    .map(node => node.getText(ast));
  const declarations = new Map();
  for (const node of ast.statements) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      declarations.set(node.name.text, node);
    }
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          declarations.set(declaration.name.text, node);
        }
      }
    }
  }
  for (const [name, node] of declarations) {
    if (
      !ts.isFunctionDeclaration(node) ||
      !node.modifiers?.some(
        modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )
    ) {
      continue;
    }
    const dependencies = new Set([name]);
    function visit(current) {
      if (
        ts.isIdentifier(current) &&
        declarations.has(current.text) &&
        !dependencies.has(current.text)
      ) {
        dependencies.add(current.text);
        visit(declarations.get(current.text));
      }
      ts.forEachChild(current, visit);
    }
    visit(node);
    const helpers = [...dependencies]
      .filter(key => key !== name)
      .map(key => declarations.get(key).getText(ast));
    sources[name] = {
      file: `src/demos/${filename}`,
      code: [...imports, '', ...helpers, '', node.getText(ast)].join('\n'),
    };
  }
}
const target = path.join(root, 'src', 'data', 'demoSources.json');
const serialized = `${JSON.stringify(sources, null, 2)}\n`;
const catalog = {};
const catalogSource = fs.readFileSync(
  path.join(root, 'src', 'data', 'catalog.ts'),
  'utf8',
);
const compiled = ts.transpileModule(catalogSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
new Function('exports', compiled.outputText)(catalog);
const index = [
  '# Chỉ mục component',
  '',
  `${catalog.lessons.length} bài trong ${catalog.categories.length} nhóm. File này được sinh bởi npm run sync-examples.`,
  '',
];
for (const category of catalog.categories) {
  index.push(
    `## ${category.title}`,
    '',
    '| Component | Loại | Nền tảng | Source |',
    '| --- | --- | --- | --- |',
  );
  for (const item of catalog.lessons.filter(
    lesson => lesson.category === category.id,
  )) {
    if (!sources[item.demo]) {
      throw new Error(`Thiếu demo source: ${item.demo}`);
    }
    index.push(
      `| [${item.title}](${item.docs}) | ${catalog.kindLabels[item.kind]} | ${
        item.platform
      } | [${item.demo}](../${sources[item.demo].file}) |`,
    );
  }
  index.push('');
}
const indexTarget = path.join(root, 'docs', 'COMPONENT_INDEX.md');
const indexSerialized = `${index.join('\n')}\n`;
if (process.argv.includes('--check')) {
  if (
    !fs.existsSync(target) ||
    fs.readFileSync(target, 'utf8') !== serialized
  ) {
    console.error('Code examples chưa đồng bộ. Chạy npm run sync-examples.');
    process.exitCode = 1;
  }
  if (
    !fs.existsSync(indexTarget) ||
    fs.readFileSync(indexTarget, 'utf8') !== indexSerialized
  ) {
    console.error('Chỉ mục component chưa đồng bộ.');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(target, serialized);
  fs.mkdirSync(path.dirname(indexTarget), { recursive: true });
  fs.writeFileSync(indexTarget, indexSerialized);
}
console.log(
  `${Object.keys(sources).length} demo sources ${
    process.argv.includes('--check') ? 'checked' : 'synced'
  }.`,
);
