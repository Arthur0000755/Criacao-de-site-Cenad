# Rota Brasil — Mini site de Viagens e Turismo

Projeto avaliativo de Desenvolvimento Web (CENAD — Prof. Wesley Souza).
Feito só com HTML5, CSS3 e JavaScript puro, sem frameworks.

🌐 **Site publicado:** https://arthur0000755.github.io/Criacao-de-site-Cenad/

## Estrutura

```
projeto/
├── index.html   → estrutura semântica (header, nav, section, article, footer)
├── style.css    → variáveis de cor, Flexbox, Grid, media queries, modo escuro
├── script.js    → modo escuro, simulador de orçamento, validação do formulário
└── imagens/     → fotos locais (JPG otimizados)
```

## Funcionalidades em JavaScript

1. **Modo escuro**: o botão 🌙 no cabeçalho alterna a classe `dark-mode` no `<body>`. A escolha fica salva no navegador.
2. **Simulador de orçamento**: dias × pessoas × R$ 200,00, com o valor formatado em reais. O resultado atualiza enquanto você digita.
3. **Validação do formulário de contato**: usa `preventDefault()`, confere nome e e-mail, mostra um alerta personalizado e limpa os campos.

Extras: menu hambúrguer no celular, link ativo no menu conforme a rolagem e ano automático no rodapé.

## Como testar

Abra a pasta no VS Code e use a extensão **Live Preview** (ou abra o `index.html` no navegador).

## Trocar as imagens

As imagens em `imagens/` são fotos JPG (cards com 900px de largura e banner com 1920px, para o site carregar rápido). Para trocar uma foto, salve a nova na mesma pasta (ex.: `gramado.jpg`) e troque o `src` no `index.html`. Para o banner, troque o `url(...)` em `.banner` no `style.css`.
