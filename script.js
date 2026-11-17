/* =========================================================
   ROTA BRASIL - Interatividade com JavaScript puro (ES6+)
   Funcionalidades:
     1. Modo Escuro (Dark Mode)
     2. Simulador / Calculadora de Orçamento
     3. Validação do Formulário de Contato + Alerta personalizado
     Extras: menu mobile, link ativo no menu e ano no rodapé
   ========================================================= */

/* "use strict" ativa um modo mais rigoroso que ajuda a evitar erros comuns */
"use strict";

/* =========================================================
   1. MODO ESCURO
   ========================================================= */

// document.getElementById busca um elemento do HTML pelo seu id
const btnTema = document.getElementById("btnTema");
const CHAVE_TEMA = "rotaBrasilTema"; // nome usado para salvar a preferência

/**
 * Aplica ou remove o modo escuro e atualiza o ícone do botão.
 * @param {boolean} escuro - true para ativar o modo escuro
 */
function aplicarTema(escuro) {
    // classList.toggle(classe, condição) adiciona se a condição for true e remove se for false
    document.body.classList.toggle("dark-mode", escuro);

    // Troca o ícone e o texto de acessibilidade do botão
    btnTema.textContent = escuro ? "☀️" : "🌙";
    btnTema.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
}

// Ao clicar no botão, invertemos o tema atual
btnTema.addEventListener("click", () => {
    const ficaraEscuro = !document.body.classList.contains("dark-mode");
    aplicarTema(ficaraEscuro);

    // Salva a escolha no navegador (localStorage) para lembrar na próxima visita.
    // try/catch evita erro caso o navegador bloqueie o armazenamento.
    try {
        localStorage.setItem(CHAVE_TEMA, ficaraEscuro ? "escuro" : "claro");
    } catch (erro) {
        console.warn("Não foi possível salvar o tema:", erro);
    }
});

// Ao carregar a página, recupera o tema salvo (se existir)
try {
    if (localStorage.getItem(CHAVE_TEMA) === "escuro") {
        aplicarTema(true);
    }
} catch (erro) {
    console.warn("Não foi possível ler o tema salvo:", erro);
}

/* =========================================================
   2. SIMULADOR DE ORÇAMENTO
   ========================================================= */

const CUSTO_DIARIO = 200; // valor fixo por pessoa, por dia (em reais)

const formOrcamento = document.getElementById("formOrcamento");
const campoDias = document.getElementById("dias");
const campoPessoas = document.getElementById("pessoas");
const resultadoOrcamento = document.getElementById("resultadoOrcamento");
const destinoEscolhido = document.getElementById("destinoEscolhido");
const custoDiarioTexto = document.getElementById("custoDiarioTexto");

// Intl.NumberFormat formata números no padrão brasileiro: R$ 1.234,56
const formatarMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

// Mostra o custo diário no texto usando a mesma constante do cálculo
custoDiarioTexto.textContent = formatarMoeda.format(CUSTO_DIARIO);

let nomeDestino = ""; // guarda o destino escolhido nos cards

/**
 * Lê os campos, valida e exibe o valor total na tela.
 * Fórmula: dias x pessoas x custo diário
 */
function calcularOrcamento() {
    // parseInt converte o texto digitado em número inteiro
    const dias = parseInt(campoDias.value, 10);
    const pessoas = parseInt(campoPessoas.value, 10);

    // Number.isNaN verifica se a conversão falhou (campo vazio ou inválido)
    if (Number.isNaN(dias) || Number.isNaN(pessoas) || dias < 1 || pessoas < 1) {
        resultadoOrcamento.classList.add("erro");
        resultadoOrcamento.textContent = "Informe valores válidos (mínimo 1) para dias e pessoas.";
        return; // interrompe a função aqui
    }

    const total = dias * pessoas * CUSTO_DIARIO;
    const destinoTexto = nomeDestino ? ` para ${nomeDestino}` : "";

    // Template string (crases) permite misturar texto e variáveis com ${ }
    resultadoOrcamento.classList.remove("erro");
    resultadoOrcamento.innerHTML = `
        Valor estimado${destinoTexto}:
        <strong>${formatarMoeda.format(total)}</strong>
        ${dias} dia(s) × ${pessoas} pessoa(s) × ${formatarMoeda.format(CUSTO_DIARIO)}
    `;
}

// Ao clicar em "Calcular" (envio do formulário)
formOrcamento.addEventListener("submit", (evento) => {
    evento.preventDefault(); // impede a página de recarregar
    calcularOrcamento();
});

// Atualização em tempo real: recalcula enquanto o usuário digita,
// mas só depois que os dois campos tiverem algum valor
[campoDias, campoPessoas].forEach((campo) => {
    campo.addEventListener("input", () => {
        if (campoDias.value !== "" && campoPessoas.value !== "") {
            calcularOrcamento();
        }
    });
});

// Botões "Simular viagem" dos cards: preenchem o destino no simulador
document.querySelectorAll(".card__botao").forEach((botao) => {
    botao.addEventListener("click", () => {
        // dataset lê os atributos data-* do HTML (data-destino)
        nomeDestino = botao.dataset.destino;
        destinoEscolhido.innerHTML = `Destino: <strong>${nomeDestino}</strong>`;

        // Se os campos já estiverem preenchidos, atualiza o resultado
        if (campoDias.value !== "" && campoPessoas.value !== "") {
            calcularOrcamento();
        }

        // Coloca o cursor no campo de dias depois da rolagem suave
        setTimeout(() => campoDias.focus({ preventScroll: true }), 600);
    });
});

/* =========================================================
   3. VALIDAÇÃO DO FORMULÁRIO DE CONTATO + ALERTA
   ========================================================= */

const formContato = document.getElementById("formContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");

// Expressão regular simples para verificar o formato texto@texto.texto
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mostra ou limpa a mensagem de erro de um campo.
 * @param {HTMLInputElement} campo - o input validado
 * @param {HTMLElement} elementoErro - onde a mensagem aparece
 * @param {string} mensagem - texto do erro ("" para limpar)
 */
function definirErro(campo, elementoErro, mensagem) {
    elementoErro.textContent = mensagem;
    campo.classList.toggle("invalido", mensagem !== "");
}

formContato.addEventListener("submit", (evento) => {
    // preventDefault() intercepta o envio: a página não recarrega
    evento.preventDefault();

    // trim() remove espaços no início e no fim (evita nome só com espaços)
    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    let valido = true;

    // Validação do nome
    if (nome === "") {
        definirErro(campoNome, erroNome, "Por favor, preencha o seu nome.");
        valido = false;
    } else {
        definirErro(campoNome, erroNome, "");
    }

    // Validação do e-mail
    if (email === "") {
        definirErro(campoEmail, erroEmail, "Por favor, preencha o seu e-mail.");
        valido = false;
    } else if (!REGEX_EMAIL.test(email)) {
        definirErro(campoEmail, erroEmail, "Digite um e-mail válido (ex.: nome@email.com).");
        valido = false;
    } else {
        definirErro(campoEmail, erroEmail, "");
    }

    // Se algo estiver errado, coloca o foco no primeiro campo inválido e para
    if (!valido) {
        formContato.querySelector(".invalido").focus();
        return;
    }

    // Tudo certo: mostra o alerta personalizado e limpa o formulário
    const primeiroNome = nome.split(" ")[0];
    abrirAlerta(`Obrigado, ${primeiroNome}! Em breve responderemos no e-mail ${email}.`);
    formContato.reset();
});

// Remove a mensagem de erro assim que o usuário começa a corrigir o campo
campoNome.addEventListener("input", () => definirErro(campoNome, erroNome, ""));
campoEmail.addEventListener("input", () => definirErro(campoEmail, erroEmail, ""));

/* ---------- Alerta personalizado (modal) ---------- */
const alerta = document.getElementById("alerta");
const alertaTexto = document.getElementById("alertaTexto");
const alertaFechar = document.getElementById("alertaFechar");

/**
 * Exibe o modal de sucesso com uma mensagem.
 * @param {string} mensagem
 */
function abrirAlerta(mensagem) {
    // textContent (e não innerHTML) evita que o texto digitado vire código HTML
    alertaTexto.textContent = mensagem;
    alerta.hidden = false;

    // requestAnimationFrame espera o navegador desenhar o modal
    // antes de adicionar a classe, para a animação de entrada funcionar
    requestAnimationFrame(() => alerta.classList.add("ativo"));
    alertaFechar.focus();
}

function fecharAlerta() {
    alerta.classList.remove("ativo");
    // Espera a animação de saída (300ms) terminar antes de esconder
    setTimeout(() => {
        alerta.hidden = true;
    }, 300);
}

alertaFechar.addEventListener("click", fecharAlerta);

// Fecha ao clicar fora da caixa (no fundo escuro)
alerta.addEventListener("click", (evento) => {
    if (evento.target === alerta) {
        fecharAlerta();
    }
});

// Fecha com a tecla Esc
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !alerta.hidden) {
        fecharAlerta();
    }
});

/* =========================================================
   EXTRAS
   ========================================================= */

/* ---------- Menu mobile (hambúrguer) ---------- */
const menuToggle = document.getElementById("menuToggle");
const menuPrincipal = document.getElementById("menuPrincipal");

menuToggle.addEventListener("click", () => {
    const aberto = menuPrincipal.classList.toggle("aberto"); // toggle retorna true/false
    menuToggle.classList.toggle("aberto", aberto);
    menuToggle.setAttribute("aria-expanded", aberto);
    menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});

// Fecha o menu ao clicar em um link (no celular)
menuPrincipal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menuPrincipal.classList.remove("aberto");
        menuToggle.classList.remove("aberto");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    });
});

/* ---------- Destaca no menu a seção visível na tela ----------
   IntersectionObserver "observa" quando cada seção entra na tela. */
const linksMenu = menuPrincipal.querySelectorAll("a");
const secoes = document.querySelectorAll("main section[id]");

const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                linksMenu.forEach((link) => {
                    link.classList.toggle("ativo", link.getAttribute("href") === `#${entrada.target.id}`);
                });
            }
        });
    },
    { rootMargin: "-45% 0px -50% 0px" } // considera ativa a seção no meio da tela
);

secoes.forEach((secao) => observador.observe(secao));

/* ---------- Ano atual no rodapé ---------- */
document.getElementById("anoAtual").textContent = new Date().getFullYear();
