const htmlInput = document.getElementById('html');
const cssInput = document.getElementById('css');
const jsInput = document.getElementById('js');
const previewFrame = document.getElementById('preview');

function updatePreview() {
  const html = htmlInput.value;
  const css = `<style>${cssInput.value}</style>`;
  const js = `<script>${jsInput.value}<\/script>`;
  const code = `${html}\n${css}\n${js}`;

  const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
  preview.open();
  preview.write(code);
  preview.close();
}

htmlInput.addEventListener('input', updatePreview);
cssInput.addEventListener('input', updatePreview);
jsInput.addEventListener('input', updatePreview);

window.addEventListener('load', updatePreview);

function formatHTML(html) {
  // Formatação simples: identação de tags
  let formatted = '';
  const lines = html.replace(/></g, '>\n<').split('\n');
  let indent = 0;
  lines.forEach(line => {
    if (line.match(/^<\/\w/)) indent--;
    formatted += '  '.repeat(indent) + line + '\n';
    if (line.match(/^<\w[^>]*[^\/]>.*$/)) indent++;
  });
  return formatted.trim();
}

function formatCSS(css) {
  // Formatação simples: quebra cada regra em nova linha
  return css
    .replace(/}/g, '}\n')
    .replace(/{/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\n\s+\n/g, '\n')
    .trim();
}

function formatJS(js) {
  // Apenas identação básica (não é um beautifier real)
  try {
    // Tenta formatar como JSON, se possível
    return JSON.stringify(JSON.parse(js), null, 2);
  } catch {
    // Senão, apenas identa chaves e pontos e vírgula
    return js
      .replace(/;/g, ';\n')
      .replace(/{/g, '{\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/\n\s+\n/g, '\n')
      .trim();
  }
}

document.querySelectorAll('.format-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const target = document.getElementById(this.dataset.target);
    if (this.dataset.target === 'html') {
      target.value = formatHTML(target.value);
    } else if (this.dataset.target === 'css') {
      target.value = formatCSS(target.value);
    } else if (this.dataset.target === 'js') {
      target.value = formatJS(target.value);
    }
    updatePreview();
  });
});

// Botão de limpar
document.querySelectorAll('.clear-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const target = document.getElementById(this.dataset.target);
    target.value = '';
    updatePreview();
  });
});