fs = require('fs');
const path = require('path');
const fileNames = fs.readdirSync(path.join(__dirname, 'templates/images'));
const tables = Array.from(Array(10).keys())
  .map((_, i) =>
    Array.from(Array(10).keys())
      .map((_, j) => `${i + 1} & + & ${j + 1} & = &`)
  );

function tabular(table) {
  return table
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .reduce(function (previousValue, currentValue, index) {
      return `${previousValue}
    ${index === 0 ? '\\begin{tabular}{ccccc}\n' : ''}${currentValue}${index === 9 ? '\n\\end{tabular}' : ' \\\\'}`;
    }, '')
}

function generateTablePageLatexCode(fileName) {
  return `
  \\backgroundsetup{
    scale=1,
    color=black,
    opacity=0.2,
    angle=0,
    contents={%
        \\includegraphics[width=\\paperwidth,height=\\paperheight]{../images/${fileName}}
      }%
  }
  \\BgThispage
  \\begin{center}
    \\huge
    Tabuada de Adição
  \\end{center}
  \\large
  \\vspace{40pt}
  \\noindent
  Registre o tempo gasto (em minutos):
  \\begin{table}[!htpb]
    \\begin{tabular}{|c|c|c|c|c|}
      \\hline
      ${tables.reduce(function (previousValue, currentValue, index) {
    return `${previousValue}${tabular(currentValue)}${index === 4 ? '\n\\\\ \\hline' : (index === 9 ? '' : '&')}`
  }, '')}
      \\\\ \\hline
    \\end{tabular}
  \\end{table}
  \\vfil
  \\begin{flushright}
    \\begin{minipage}[b]{6cm}
      A tabuada é o objeto de estudo mais importante na Matemática. É o caminho para se chegar ao universo dos números. (José Carlos dos Santos)
    \\end{minipage}
  \\end{flushright}
  \\newpage
  `
}

function generateTableLatexCode() {
  return `
    \\documentclass{article}
    \\usepackage[top=2cm, bottom=2cm, outer=0.5cm, inner=0.5cm]{geometry}
    \\usepackage[pages=some]{background}
    \\usepackage{etoolbox}
    \\usepackage{indentfirst}
    \\AtBeginEnvironment{tabular}{\\Large}
    \\begin{document}
    ${Array.from(Array(30).keys())
      .reduce(function (previousValue, _currentValue, index) {
        return `${previousValue}\n${generateTablePageLatexCode(fileNames[index % (fileNames.length - 1)])}`
      }, '')}
    \\end{document}
  `
}

fs.writeFileSync('templates/table/main.tex', generateTableLatexCode(), { encoding: 'utf8', flag: 'w' });
