/* ==========================================================
   Jornada de Sucesso Broady
   Este arquivo só desenha a página. Os clientes e as tarefas
   ficam em dados.js — é lá que você (ou o Claude) atualiza tudo.
   ========================================================== */


/* ----------------------------------------------------------
   1. Etapas da jornada (cada uma com a sua cor)
   ---------------------------------------------------------- */

const ETAPAS = [
    { id: "descoberta",     nome: "Contato inicial",                          tom: "cinza" },
    { id: "onboarding",     nome: "Ativação e período de teste",                tom: "azul" },
    { id: "operacao",       nome: "Continuidade e operação",                tom: "verde" },
    { id: "acompanhamento", nome: "Evolução e escalabilidade",                tom: "turquesa" },
    { id: "sucesso",        nome: "Sucesso e evolução da operação",         tom: "indigo" }
];

// Os sete status oficiais da documentação, cada um com uma cor
// (cores conforme o guia de indicadores do projeto: verde = concluído,
// azul/turquesa = acompanhamento, laranja = pendência/ação necessária,
// vermelho = bloqueio, cinza = neutro).
const STATUS_OFICIAIS = [
    { nome: "Não iniciado",                 tom: "cinza" },
    { nome: "Em andamento",                 tom: "azul" },
    { nome: "Aguardando ação do cliente",   tom: "laranja" },
    { nome: "Aguardando ação da CX",        tom: "laranja" },
    { nome: "Bloqueado",                    tom: "vermelho" },
    { nome: "Concluído",                    tom: "verde" },
    { nome: "Em acompanhamento contínuo",   tom: "turquesa" }
];


/* ----------------------------------------------------------
   2. Leitura dos clientes e das tarefas (vindos de dados.js)
   ---------------------------------------------------------- */

const arquivoLido = typeof CLIENTES !== "undefined" && Array.isArray(CLIENTES);

const clientes = (arquivoLido ? CLIENTES : []).map(function (cliente, posicao) {

    // Avisa no console se alguma etapa foi escrita errada em dados.js
    if (!ETAPAS.some(function (etapa) { return etapa.id === cliente.etapa; })) {
        console.warn("dados.js: etapa desconhecida em \"" + cliente.nome + "\": " + cliente.etapa);
    }

    return Object.assign({ id: "c" + posicao }, cliente);

});

// Tarefas oficiais de cada etapa (as mesmas para todos os clientes) —
// vêm da documentação "Jornada de Sucesso do Cliente | Detalhamento".
const catalogo = (typeof TAREFAS !== "undefined" && Array.isArray(TAREFAS)) ? TAREFAS : [];

// Possíveis pendências e possíveis alertas de cada etapa (referência —
// não pertencem a nenhum cliente específico).
const catalogoPendenciasAlertas = (typeof PENDENCIAS_ALERTAS !== "undefined" && Array.isArray(PENDENCIAS_ALERTAS)) ? PENDENCIAS_ALERTAS : [];

// Avisos no console para ajudar a achar erros de digitação em dados.js
(function conferirDados() {

    const idsVistos = [];

    catalogo.forEach(function (tarefa) {

        if (!ETAPAS.some(function (etapa) { return etapa.id === tarefa.etapa; })) {
            console.warn("dados.js: tarefa \"" + tarefa.nome + "\" com etapa desconhecida: " + tarefa.etapa);
        }

        if (idsVistos.indexOf(tarefa.id) !== -1) {
            console.warn("dados.js: id de tarefa repetido: " + tarefa.id);
        }

        idsVistos.push(tarefa.id);

    });

    clientes.forEach(function (cliente) {

        if (!STATUS_OFICIAIS.some(function (opcao) { return opcao.nome === cliente.status; })) {
            console.warn("dados.js: status desconhecido em \"" + cliente.nome + "\": " + cliente.status);
        }

        (cliente.etapasConcluidas || []).forEach(function (idEtapa) {
            if (!ETAPAS.some(function (etapa) { return etapa.id === idEtapa; })) {
                console.warn("dados.js: \"" + cliente.nome + "\" tem uma etapa desconhecida em etapasConcluidas: " + idEtapa);
            }
        });

        Object.keys(cliente.tarefas || {}).forEach(function (idTarefa) {

            if (idsVistos.indexOf(idTarefa) === -1) {
                console.warn("dados.js: \"" + cliente.nome + "\" usa uma tarefa que não existe: " + idTarefa);
            }

            const registro = cliente.tarefas[idTarefa];
            const status = registro.status;

            if (!STATUS_OFICIAIS.some(function (opcao) { return opcao.nome === status; })) {
                console.warn("dados.js: status de tarefa desconhecido em \"" + cliente.nome + "\": " + status);
            }

            if (registro.impeditiva !== undefined && typeof registro.impeditiva !== "boolean") {
                console.warn("dados.js: \"impeditiva\" deveria ser true ou false em \"" + cliente.nome + "\", tarefa " + idTarefa);
            }

            ["responsavel", "dataCriacao", "dataConclusao", "prazo", "proximoPasso"].forEach(function (campo) {
                if (registro[campo] !== undefined && typeof registro[campo] !== "string") {
                    console.warn("dados.js: campo \"" + campo + "\" deveria ser texto em \"" + cliente.nome + "\", tarefa " + idTarefa);
                }
            });

        });

    });

    catalogoPendenciasAlertas.forEach(function (bloco) {

        if (!ETAPAS.some(function (etapa) { return etapa.id === bloco.etapa; })) {
            console.warn("dados.js: PENDENCIAS_ALERTAS com etapa desconhecida: " + bloco.etapa);
        }

        if (bloco.tipo !== "pendencia" && bloco.tipo !== "alerta") {
            console.warn("dados.js: PENDENCIAS_ALERTAS com tipo desconhecido na etapa \"" + bloco.etapa + "\": " + bloco.tipo);
        }

    });

})();

let idSelecionado = null;
let textoPesquisa = "";

// Filtros da lista geral de clientes. Combinam-se entre si e com a
// pesquisa por nome — não alteram os dados, só o que é exibido. Os dois
// são ligados pelos indicadores do topo e pelas barras de "Clientes por
// etapa da jornada" (só a etapa).
let filtroEtapa = null;      // id de uma das etapas, ou null (sem filtro)
let filtroAtencao = false;   // true = mostrar só quem tem atencao: true

// Controla quais etapas aparecem abertas no acordeão de "Checkpoints por
// etapa" (área de detalhes do cliente). Guardado à parte da seleção do
// cliente, só para lembrar o que foi aberto/fechado manualmente.
let clienteDoAcordeao = null;
let etapasAbertas = {};

// Dentro de cada etapa aberta, os detalhes de cada tarefa e a lista de
// pendências/alertas começam recolhidos. Guarda o que foi aberto à mão (zera
// ao trocar de cliente, junto com etapasAbertas).
let tarefasAbertas = {};
let referenciasAbertas = {};

const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ----------------------------------------------------------
   3. Elementos da página
   ---------------------------------------------------------- */

const campoPesquisa = document.querySelector("#pesquisa-cliente");
const listaClientes = document.querySelector("#lista-clientes");

const botaoLimparFiltros = document.querySelector("#limpar-filtros");

const botaoAlternarTema = document.querySelector("#alternar-tema");

const cartaoDetalhes = document.querySelector("#cartao-detalhes");
const detalheNome = document.querySelector("#detalhe-nome");
const detalheEtapa = document.querySelector("#detalhe-etapa");
const detalheStatus = document.querySelector("#detalhe-status");
const detalheAcao = document.querySelector("#detalhe-acao");

const blocoAvisoImpeditiva = document.querySelector("#aviso-impeditiva");
const textoAvisoImpeditiva = document.querySelector("#texto-aviso-impeditiva");
const blocoAvisoInconsistencia = document.querySelector("#aviso-inconsistencia");
const textoAvisoInconsistencia = document.querySelector("#texto-aviso-inconsistencia");

const blocoNotasGerais = document.querySelector("#notas-gerais");
const listaNotasGerais = document.querySelector("#lista-notas-gerais");

const blocoAvanco = document.querySelector("#avanco-jornada");
const avancoValor = document.querySelector("#avanco-valor");
const avancoBarra = document.querySelector("#avanco-barra");
const blocoTarefas = document.querySelector("#checkpoints");
const listaTarefasEl = document.querySelector("#lista-checkpoints");
const botaoExpandirTodas = document.querySelector("#expandir-todas");
const botaoRecolherTodas = document.querySelector("#recolher-todas");


/* ----------------------------------------------------------
   3b. Tema claro/escuro (alternância manual, lembrada entre
   visitas no mesmo navegador — não muda nada em dados.js)
   ---------------------------------------------------------- */

const CHAVE_TEMA = "jornada-sucesso-tema";

function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    const claro = tema === "claro";
    botaoAlternarTema.setAttribute("aria-pressed", claro ? "true" : "false");
    botaoAlternarTema.setAttribute("aria-label", claro ? "Alternar para modo escuro" : "Alternar para modo claro");
}

(function iniciarTema() {

    let temaSalvo = null;

    try {
        temaSalvo = localStorage.getItem(CHAVE_TEMA);
    } catch (erro) {
        temaSalvo = null;
    }

    aplicarTema(temaSalvo === "claro" ? "claro" : "escuro");

    botaoAlternarTema.addEventListener("click", function () {

        const novoTema = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro";
        aplicarTema(novoTema);

        try {
            localStorage.setItem(CHAVE_TEMA, novoTema);
        } catch (erro) {
            // Armazenamento indisponível (ex.: navegação privada) — a
            // escolha só não é lembrada na próxima visita.
        }

    });

}());


/* ----------------------------------------------------------
   4. Funções de apoio
   ---------------------------------------------------------- */

function criar(tag, classe, texto) {

    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;

}

function acharEtapa(id) {
    return ETAPAS.find(function (etapa) { return etapa.id === id; }) || ETAPAS[0];
}

function acharCliente(id) {
    return clientes.find(function (cliente) { return cliente.id === id; });
}

function textoClientes(quantidade) {
    return quantidade === 1 ? "1 cliente" : quantidade + " clientes";
}

function contarPorEtapa(idEtapa) {
    return clientes.filter(function (c) { return c.etapa === idEtapa; }).length;
}

// Faz um cartão funcionar com clique, Enter e Espaço
function ativarClique(elemento, funcao) {

    elemento.addEventListener("click", funcao);

    elemento.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            funcao();
        }
    });

}

function mensagemVazia(texto) {
    const bloco = criar("div", "vazio");
    const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icone.setAttribute("viewBox", "0 0 24 24");
    icone.setAttribute("fill", "none");
    icone.setAttribute("aria-hidden", "true");
    icone.classList.add("vazio-icone");
    icone.innerHTML = '<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-4.3-4.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
    bloco.appendChild(icone);
    bloco.appendChild(criar("p", "", texto));
    return bloco;
}


/* ----------------------------------------------------------
   5. Desenhar cada parte da página
   ---------------------------------------------------------- */

// Cartões de números no topo
function desenharIndicadores() {

    const valores = {
        total: clientes.length,
        onboarding: contarPorEtapa("onboarding"),
        operacao: contarPorEtapa("operacao"),
        atencao: clientes.filter(function (c) { return c.atencao; }).length,
        acompanhamento: contarPorEtapa("acompanhamento")
    };

    document.querySelectorAll("[data-indicador]").forEach(function (cartao) {
        cartao.querySelector("strong").textContent = valores[cartao.dataset.indicador];
    });

}

// Barras de cada etapa (quantos clientes estão em cada uma agora)
function desenharEtapas() {

    document.querySelectorAll("[data-etapa]").forEach(function (bloco) {

        const quantidade = contarPorEtapa(bloco.dataset.etapa);
        const percentual = clientes.length ? Math.round((quantidade / clientes.length) * 100) : 0;

        bloco.querySelector(".cabecalho-etapa strong").textContent = textoClientes(quantidade);
        bloco.querySelector(".progresso").style.setProperty("--valor", percentual + "%");

    });

}

// Lista geral: respeita a pesquisa por nome e os filtros ativos (etapa e
// atenção), todos combinados ao mesmo tempo. Nenhum deles altera os
// dados — só o que é exibido aqui.
function desenharLista() {

    listaClientes.innerHTML = "";

    if (!arquivoLido) {
        listaClientes.appendChild(mensagemVazia("Não consegui ler o arquivo dados.js. Confira se ele está na mesma pasta e sem erros de digitação."));
        return;
    }

    const lista = clientes.filter(function (c) {

        const correspondeNome = c.nome.toLowerCase().includes(textoPesquisa);
        const correspondeEtapa = !filtroEtapa || c.etapa === filtroEtapa;
        const correspondeAtencao = !filtroAtencao || c.atencao === true;

        return correspondeNome && correspondeEtapa && correspondeAtencao;

    }).sort(function (a, b) {
        // Quem precisa de atenção (atencao:true, tarefa impeditiva pendente
        // ou inconsistência técnica) aparece primeiro. Sort é estável, então
        // a ordem original de dados.js é preservada dentro de cada grupo.
        const destaqueA = precisaDestaque(a) ? 0 : 1;
        const destaqueB = precisaDestaque(b) ? 0 : 1;
        return destaqueA - destaqueB;
    });

    if (lista.length === 0) {

        listaClientes.appendChild(mensagemVazia(
            clientes.length === 0
                ? "Nenhum cliente cadastrado em dados.js."
                : "Nenhum cliente encontrado com a pesquisa ou os filtros atuais."
        ));
        return;

    }

    lista.forEach(function (cliente) {

        const etapa = acharEtapa(cliente.etapa);

        const item = criar("div", "cliente");
        item.dataset.tom = etapa.tom;
        item.tabIndex = 0;
        item.setAttribute("role", "button");

        if (cliente.id === idSelecionado) {
            item.classList.add("selecionado");
        }

        // Linha de cima: nome + status. Linha de baixo: etapa + avisos.
        const topo = criar("div", "cliente-topo");
        topo.appendChild(criar("strong", "", cliente.nome));
        topo.appendChild(criar("span", "status", cliente.status));

        const base = criar("div", "cliente-base");
        base.appendChild(criar("span", "cliente-etapa", etapa.nome));

        item.appendChild(topo);
        item.appendChild(base);

        // Indicadores pequenos de tarefa impeditiva pendente e/ou
        // inconsistência técnica — mesmo critério e cores dos avisos do
        // painel de detalhes, só que em miniatura. Só informativo.
        const indicadores = criar("div", "cliente-indicadores");

        if (tarefasImpeditivasPendentes(cliente).length > 0) {
            const ponto = criar("span", "indicador-aviso", "!");
            ponto.dataset.tipo = "impeditiva";
            ponto.title = "Tem tarefa impeditiva pendente";
            indicadores.appendChild(ponto);
        }

        if (etapasComInconsistencia(cliente).length > 0) {
            const ponto = criar("span", "indicador-aviso", "i");
            ponto.dataset.tipo = "inconsistencia";
            ponto.title = "Possível inconsistência técnica";
            indicadores.appendChild(ponto);
        }

        if (indicadores.children.length > 0) {
            base.appendChild(indicadores);
        }

        ativarClique(item, function () {
            selecionar(cliente.id);
        });

        listaClientes.appendChild(item);

    });

    // Pequena transição ao atualizar a lista (pesquisa, filtro ou "Limpar
    // filtros") — reaproveita o padrão já usado no card de detalhes:
    // remove e readiciona a classe para reiniciar a animação.
    if (!menosMovimento) {
        listaClientes.classList.remove("atualizada");
        void listaClientes.offsetWidth;
        listaClientes.classList.add("atualizada");
    }

}

// ----- Filtros da lista geral de clientes -----

// Alterna o filtro por etapa: clicar numa etapa já ativa desliga o
// filtro; clicar em outra troca para ela (só uma etapa por vez, já que
// cada cliente só está em uma etapa).
function alternarFiltroEtapa(idEtapa) {
    filtroEtapa = (filtroEtapa === idEtapa) ? null : idEtapa;
    atualizarFiltros();
}

// Atualiza a aparência de todos os controles de filtro (as barras de
// "Clientes por etapa da jornada" e os indicadores do topo, que são os
// atalhos de filtro) e redesenha a lista.
function atualizarFiltros() {

    document.querySelectorAll(".etapa[data-etapa]").forEach(function (bloco) {
        const ativo = bloco.dataset.etapa === filtroEtapa;
        bloco.classList.toggle("ativo", ativo);
        bloco.setAttribute("aria-pressed", ativo ? "true" : "false");
    });

    // Indicadores do topo: ficam destacados quando o filtro correspondente
    // está ligado ("Total de clientes" não é um filtro, então nunca fica ativo)
    document.querySelectorAll("[data-indicador]").forEach(function (cartao) {
        const tipo = cartao.dataset.indicador;
        const ativo = (tipo === "atencao") ? filtroAtencao
                    : (tipo === "total") ? false
                    : filtroEtapa === tipo;
        cartao.classList.toggle("ativo", ativo);
        cartao.setAttribute("aria-pressed", ativo ? "true" : "false");
    });

    botaoLimparFiltros.hidden = !(filtroEtapa || filtroAtencao);

    desenharLista();

}

// "Limpar filtros" só aparece quando há algum filtro ligado
botaoLimparFiltros.addEventListener("click", function () {
    filtroEtapa = null;
    filtroAtencao = false;
    atualizarFiltros();
});

// As barras de "Clientes por etapa da jornada" continuam mostrando sempre
// a contagem e o percentual totais (desenharEtapas não muda) — além disso,
// cada barra serve de atalho para filtrar a lista por aquela etapa.
document.querySelectorAll(".etapa[data-etapa]").forEach(function (bloco) {

    bloco.setAttribute("role", "button");
    bloco.tabIndex = 0;
    bloco.setAttribute("aria-pressed", "false");

    ativarClique(bloco, function () {
        alternarFiltroEtapa(bloco.dataset.etapa);
    });

});

// Os indicadores do topo também funcionam como atalho de filtro (mesmo
// filtro por etapa das barras de "Clientes por etapa"): "Total de clientes" limpa os
// filtros; "Precisam de atenção" liga/desliga o filtro de atenção; os
// demais filtram pela etapa correspondente. Os números mostrados não
// mudam — continuam sendo sempre o total geral.
document.querySelectorAll("[data-indicador]").forEach(function (cartao) {

    const tipo = cartao.dataset.indicador;

    cartao.setAttribute("role", "button");
    cartao.tabIndex = 0;
    cartao.setAttribute("aria-pressed", "false");

    ativarClique(cartao, function () {

        if (tipo === "total") {
            filtroEtapa = null;
            filtroAtencao = false;
            atualizarFiltros();
        } else if (tipo === "atencao") {
            filtroAtencao = !filtroAtencao;
            atualizarFiltros();
        } else {
            alternarFiltroEtapa(tipo);
        }

    });

});

// ----- Tarefas, ações, checkpoints e avanço da jornada -----

// Bloco de "possíveis pendências" ou "possíveis alertas" de uma etapa
// (referência — não é específico de nenhum cliente)
function referenciaDaEtapa(idEtapa) {
    return catalogoPendenciasAlertas.find(function (bloco) { return bloco.etapa === idEtapa; });
}

// Tarefas de uma etapa, na ordem da documentação (1.1, 1.2, 1.3...)
function tarefasDaEtapa(idEtapa) {
    return catalogo
        .filter(function (tarefa) { return tarefa.etapa === idEtapa; })
        .sort(function (a, b) { return a.id.localeCompare(b.id, "pt-BR", { numeric: true }); });
}

// Situação de uma tarefa para um cliente (sem registro = "Não iniciado").
// Os campos além de "status" são opcionais em dados.js — quando não
// foram definidos, chegam aqui vazios ("" ou false) e simplesmente não
// são exibidos (veja desenharTarefas).
function estadoTarefa(cliente, idTarefa) {

    const registro = (cliente.tarefas && cliente.tarefas[idTarefa]) || {};

    return {
        status: registro.status || "Não iniciado",
        responsavel: registro.responsavel || "",
        dataCriacao: registro.dataCriacao || "",
        dataConclusao: registro.dataConclusao || "",
        prazo: registro.prazo || "",
        impeditiva: registro.impeditiva === true,
        observacao: registro.observacao || "",
        proximoPasso: registro.proximoPasso || ""
    };

}

// Transforma uma data no formato AAAA-MM-DD (ex.: "2026-03-15") em
// DD/MM/AAAA para exibição. Se o texto não estiver nesse formato,
// mostra exatamente como foi digitado em dados.js.
function formatarData(texto) {

    if (!texto) {
        return "";
    }

    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);

    if (!partes) {
        return texto;
    }

    return partes[3] + "/" + partes[2] + "/" + partes[1];

}

// Quantas tarefas de uma etapa já estão concluídas para este cliente
// (informação de apoio, mostrada junto de cada etapa — não é o que
// define o percentual de avanço da jornada, que segue a Regra 5)
function progressoEtapa(cliente, idEtapa) {

    const lista = tarefasDaEtapa(idEtapa);

    if (lista.length === 0) {
        return null;
    }

    const concluidas = lista.filter(function (tarefa) {
        return estadoTarefa(cliente, tarefa.id).status === "Concluído";
    }).length;

    return { total: lista.length, concluidas: concluidas };

}

// Avanço da jornada (Regra 5 da documentação): o percentual representa
// quantas das etapas já foram registradas como concluídas para o
// cliente (cliente.etapasConcluidas), e não uma nota ou avaliação.
function avancoJornada(cliente) {

    const concluidas = (cliente.etapasConcluidas || []).filter(function (idEtapa) {
        return ETAPAS.some(function (etapa) { return etapa.id === idEtapa; });
    }).length;

    return Math.round((concluidas / ETAPAS.length) * 100);

}

// Aviso de tarefas impeditivas pendentes (Frente 2): informativo, não
// altera nenhum dado. Considera só tarefas com impeditiva:true e status
// diferente de "Concluído" — uma vez concluída, deixa de contar aqui.
function tarefasImpeditivasPendentes(cliente) {
    return catalogo.filter(function (tarefa) {
        const estado = estadoTarefa(cliente, tarefa.id);
        return estado.impeditiva && estado.status !== "Concluído";
    });
}

function desenharAvisoImpeditiva(cliente) {

    const pendentes = cliente ? tarefasImpeditivasPendentes(cliente) : [];

    if (pendentes.length === 0) {
        blocoAvisoImpeditiva.hidden = true;
        return;
    }

    blocoAvisoImpeditiva.hidden = false;
    textoAvisoImpeditiva.innerHTML = "";

    const forte = criar("strong", "", pendentes.length === 1
        ? "1 tarefa impeditiva pendente."
        : pendentes.length + " tarefas impeditivas pendentes.");
    textoAvisoImpeditiva.appendChild(forte);
    textoAvisoImpeditiva.appendChild(document.createTextNode(
        " Verifique os detalhes na" + (pendentes.length === 1 ? " etapa correspondente" : "s etapas correspondentes") + ", abaixo."
    ));

}

// Mapa etapa -> tarefa que é o checkpoint de avanço (avancoEtapa: true),
// construído a partir do catálogo em dados.js. Hoje existe um checkpoint
// desse tipo só nas etapas 1 e 2 (descoberta, onboarding) — as
// únicas com uma etapa seguinte formal; as etapas 4, 5 e 6 são contínuas
// e não entram neste mapa.
const etapasComCheckpointAvanco = {};
catalogo.forEach(function (tarefa) {
    if (tarefa.avancoEtapa === true) {
        etapasComCheckpointAvanco[tarefa.etapa] = tarefa.id;
    }
});

// Aviso de inconsistência técnica (Frente 4): informativo, não corrige
// nada. Caso verificado nesta primeira versão: a etapa já está em
// etapasConcluidas, mas a tarefa que é o checkpoint de avanço dessa etapa
// ainda não está "Concluído". Só se aplica às etapas com checkpoint de
// avanço (ver etapasComCheckpointAvanco acima).
function etapasComInconsistencia(cliente) {
    const concluidas = cliente.etapasConcluidas || [];
    return Object.keys(etapasComCheckpointAvanco).filter(function (idEtapa) {
        if (concluidas.indexOf(idEtapa) === -1) {
            return false;
        }
        const idTarefaCheckpoint = etapasComCheckpointAvanco[idEtapa];
        // Lê o status bruto, sem passar por estadoTarefa() — aqui, ausência de
        // status (tarefa nunca preenchida em dados.js) NÃO deve ser tratada
        // como inconsistência, só um status explicitamente registrado e
        // diferente de "Concluído" (ex.: "Em andamento", "Bloqueado"). Isso
        // evita falso positivo em etapas antigas cujo checkpoint nunca foi
        // preenchido depois que o cliente já avançou.
        const registro = (cliente.tarefas && cliente.tarefas[idTarefaCheckpoint]) || {};
        const statusRegistrado = registro.status || "";
        if (!statusRegistrado) {
            return false;
        }
        return statusRegistrado !== "Concluído";
    });
}

function desenharAvisoInconsistencia(cliente) {

    const etapasIds = cliente ? etapasComInconsistencia(cliente) : [];

    if (etapasIds.length === 0) {
        blocoAvisoInconsistencia.hidden = true;
        return;
    }

    const nomes = etapasIds.map(function (id) { return acharEtapa(id).nome; });

    blocoAvisoInconsistencia.hidden = false;
    textoAvisoInconsistencia.innerHTML = "";

    const forte = criar("strong", "", etapasIds.length === 1
        ? "Possível inconsistência técnica."
        : "Possíveis inconsistências técnicas.");
    textoAvisoInconsistencia.appendChild(forte);
    textoAvisoInconsistencia.appendChild(document.createTextNode(
        " " + (etapasIds.length === 1
            ? "A etapa \"" + nomes[0] + "\" está registrada como concluída, mas o checkpoint de avanço dessa etapa ainda não está marcado como \"Concluído\"."
            : "As etapas " + nomes.map(function (n) { return "\"" + n + "\""; }).join(", ") + " estão registradas como concluídas, mas os respectivos checkpoints de avanço ainda não estão marcados como \"Concluído\".")
    ));

}

// Um cliente "precisa de destaque" (aparece primeiro na lista geral e ganha
// indicadores no cartão) quando tem atencao:true, uma ou mais tarefas
// impeditivas pendentes, ou uma inconsistência técnica detectada.
function precisaDestaque(cliente) {
    return cliente.atencao === true
        || tarefasImpeditivasPendentes(cliente).length > 0
        || etapasComInconsistencia(cliente).length > 0;
}

// Bloco "Avanço da jornada" + lista de tarefas do cliente, por etapa
function desenharTarefas(cliente) {

    listaTarefasEl.innerHTML = "";

    const etapasComTarefas = ETAPAS.filter(function (etapa) {
        return tarefasDaEtapa(etapa.id).length > 0;
    });

    // Sem cliente selecionado ou sem tarefas cadastradas: esconde os dois blocos
    if (!cliente || etapasComTarefas.length === 0) {
        blocoAvanco.hidden = true;
        blocoTarefas.hidden = true;
        return;
    }

    blocoAvanco.hidden = false;
    blocoTarefas.hidden = false;

    const avanco = avancoJornada(cliente);
    avancoValor.textContent = avanco + "%";
    avancoBarra.style.setProperty("--valor", avanco + "%");

    // Ao trocar de cliente, a etapa atual dele abre e as outras fecham.
    // Enquanto for o mesmo cliente, mantém o que foi aberto/fechado à mão.
    if (cliente.id !== clienteDoAcordeao) {

        clienteDoAcordeao = cliente.id;
        etapasAbertas = {};
        tarefasAbertas = {};
        referenciasAbertas = {};

        ETAPAS.forEach(function (etapa) {
            etapasAbertas[etapa.id] = (etapa.id === cliente.etapa);
        });

    }

    const etapasConcluidas = cliente.etapasConcluidas || [];

    etapasComTarefas.forEach(function (etapa) {

        const progresso = progressoEtapa(cliente, etapa.id);
        const percentual = Math.round((progresso.concluidas / progresso.total) * 100);
        const etapaConcluida = etapasConcluidas.indexOf(etapa.id) !== -1;

        const grupo = criar("div", "grupo-checkpoints");
        grupo.dataset.tom = etapa.tom;

        if (etapa.id === cliente.etapa) {
            grupo.classList.add("atual");
        }

        // A etapa abre e fecha (acordeão). Recolhida, mostra só o que já
        // está no cabeçalho de sempre (nome, "concluída" quando for o
        // caso, tarefas concluídas e percentual) e a barra de progresso;
        // tarefas, ações, checkpoints, pendências e alertas só aparecem
        // com a etapa aberta.
        const aberta = etapasAbertas[etapa.id] === true;
        grupo.classList.toggle("aberta", aberta);

        // Título da etapa e progresso das tarefas dela — também é o
        // "botão" que abre/fecha a etapa
        const cabecalho = criar("div", "cabecalho-grupo");
        cabecalho.setAttribute("role", "button");
        cabecalho.tabIndex = 0;
        cabecalho.setAttribute("aria-expanded", aberta ? "true" : "false");

        let rotulo = etapa.nome;

        if (etapa.id === cliente.etapa) {
            rotulo += " (etapa atual)";
        } else if (etapaConcluida) {
            rotulo += " (concluída)";
        }

        const ladoDireitoCabecalho = criar("div", "lado-direito-grupo");
        ladoDireitoCabecalho.appendChild(criar("strong", "", progresso.concluidas + " de " + progresso.total + " tarefas • " + percentual + "%"));
        ladoDireitoCabecalho.appendChild(criar("span", "seta-accordion", "▾"));

        cabecalho.appendChild(criar("span", "nome-etapa-grupo", rotulo));
        cabecalho.appendChild(ladoDireitoCabecalho);
        grupo.appendChild(cabecalho);

        ativarClique(cabecalho, function () {
            etapasAbertas[etapa.id] = !aberta;
            desenharTarefas(cliente);
        });

        const barra = criar("div", "barra");
        const preenchimento = criar("div", "progresso");
        preenchimento.style.setProperty("--valor", percentual + "%");
        barra.appendChild(preenchimento);
        grupo.appendChild(barra);

        // Conteúdo que só aparece com a etapa aberta: tarefas, ações,
        // checkpoints, status, possíveis pendências e possíveis alertas
        const conteudo = criar("div", "conteudo-grupo");
        conteudo.hidden = !aberta;

        // Tarefas da etapa
        const lista = criar("div", "lista-checkpoint");

        tarefasDaEtapa(etapa.id).forEach(function (tarefa) {

            const estado = estadoTarefa(cliente, tarefa.id);
            const statusInfo = STATUS_OFICIAIS.find(function (opcao) { return opcao.nome === estado.status; }) || STATUS_OFICIAIS[0];

            const linha = criar("div", "checkpoint");

            const texto = criar("div");

            const tituloTarefa = tarefa.id + " · " + tarefa.nome + (tarefa.avancoEtapa ? " (checkpoint de avanço da etapa)" : "");
            texto.appendChild(criar("strong", "", tituloTarefa));

            // Checkpoint da tarefa (o que confirma que ela foi cumprida):
            // sempre visível, é o resumo da tarefa
            if (tarefa.checkpoint) {
                texto.appendChild(criar("span", "checkpoint-texto", "Checkpoint: " + tarefa.checkpoint));
            }

            // Andamento do cliente nesta tarefa: texto corrido curto (campo
            // "observacao" da tarefa, em dados.js). Só aparece quando existe.
            if (estado.observacao) {
                texto.appendChild(criar("span", "andamento-texto", "Andamento: " + estado.observacao));
            }

            // Os demais campos opcionais da "estrutura sugerida de tarefa"
            // ficam recolhidos atrás de "Ver detalhes" (só aparecem quando
            // foram preenchidos em dados.js). A lista de ações da tarefa
            // continua em dados.js, mas não é mais exibida na tela.
            const detalhes = criar("div", "detalhes-tarefa");
            detalhes.id = "detalhes-tarefa-" + String(tarefa.id).replace(/[^a-zA-Z0-9_-]/g, "-");
            let temDetalhes = false;

            function adicionarDetalhe(textoDetalhe) {
                detalhes.appendChild(criar("span", "observacao-texto", textoDetalhe));
                temDetalhes = true;
            }

            if (estado.responsavel) {
                adicionarDetalhe("Responsável: " + estado.responsavel);
            }

            if (estado.dataCriacao) {
                adicionarDetalhe("Criada em: " + formatarData(estado.dataCriacao));
            }

            if (estado.dataConclusao) {
                adicionarDetalhe("Concluída em: " + formatarData(estado.dataConclusao));
            }

            if (estado.prazo) {
                adicionarDetalhe("Prazo: " + formatarData(estado.prazo));
            }

            if (estado.impeditiva) {
                adicionarDetalhe("Tarefa impeditiva para avançar de etapa.");
            }

            if (tarefa.observacao) {
                adicionarDetalhe("Observação: " + tarefa.observacao);
            }

            if (estado.proximoPasso) {
                adicionarDetalhe("Próximo passo: " + estado.proximoPasso);
            }

            if (temDetalhes) {

                const rotuloFechado = "Ver detalhes";
                const rotuloAberto = "Ocultar detalhes";
                const abertaTarefa = tarefasAbertas[tarefa.id] === true;

                const barraDetalhes = criar("div", "barra-detalhes-tarefa");

                const botaoDetalhes = criar("button", "botao-detalhes-tarefa", abertaTarefa ? rotuloAberto : rotuloFechado);
                botaoDetalhes.type = "button";
                botaoDetalhes.setAttribute("aria-expanded", abertaTarefa ? "true" : "false");
                botaoDetalhes.setAttribute("aria-controls", detalhes.id);
                detalhes.hidden = !abertaTarefa;

                // Abre/fecha no lugar, sem redesenhar a lista (o foco do
                // teclado continua no botão)
                botaoDetalhes.addEventListener("click", function () {
                    const abrir = botaoDetalhes.getAttribute("aria-expanded") !== "true";
                    tarefasAbertas[tarefa.id] = abrir;
                    botaoDetalhes.setAttribute("aria-expanded", abrir ? "true" : "false");
                    botaoDetalhes.textContent = abrir ? rotuloAberto : rotuloFechado;
                    detalhes.hidden = !abrir;
                });

                barraDetalhes.appendChild(botaoDetalhes);

                // Marcas discretas, para não esconder o que merece atenção
                if (estado.impeditiva) {
                    barraDetalhes.appendChild(criar("span", "marca-tarefa", "Impeditiva"));
                }

                if (estado.prazo) {
                    barraDetalhes.appendChild(criar("span", "marca-tarefa", "Com prazo"));
                }

                if (estado.proximoPasso) {
                    barraDetalhes.appendChild(criar("span", "marca-tarefa", "Próximo passo"));
                }

                texto.appendChild(barraDetalhes);
                texto.appendChild(detalhes);

            }

            const selo = criar("span", "status", statusInfo.nome);
            selo.dataset.tom = statusInfo.tom;

            linha.appendChild(texto);
            linha.appendChild(selo);
            lista.appendChild(linha);

        });

        conteudo.appendChild(lista);

        // As caixas de "possíveis pendências" e "possíveis alertas" deixaram de
        // ser exibidas (a pedido da Camila). Os textos continuam em dados.js
        // (PENDENCIAS_ALERTAS) para poderem voltar depois, já revisados.

        grupo.appendChild(conteudo);
        listaTarefasEl.appendChild(grupo);

    });

    // Avisa quantas etapas ainda não têm tarefas cadastradas
    const semTarefas = ETAPAS.length - etapasComTarefas.length;

    if (semTarefas > 0) {
        listaTarefasEl.appendChild(criar("p", "nota-checkpoints",
            semTarefas === 1
                ? "1 etapa ainda não tem tarefas cadastradas."
                : semTarefas + " etapas ainda não têm tarefas cadastradas."
        ));
    }

}

// Controles "Expandir todas" / "Recolher todas": abrem ou fecham as seis
// etapas do acordeão do cliente selecionado de uma vez, reaproveitando o
// mesmo estado (etapasAbertas) e a mesma função de desenho usados no
// clique individual de cada etapa — não existe uma segunda lógica.
function definirTodasEtapas(aberta) {

    const cliente = acharCliente(idSelecionado);

    if (!cliente) {
        return;
    }

    ETAPAS.forEach(function (etapa) {
        etapasAbertas[etapa.id] = aberta;
    });

    desenharTarefas(cliente);

}

botaoExpandirTodas.addEventListener("click", function () {
    definirTodasEtapas(true);
});

botaoRecolherTodas.addEventListener("click", function () {
    definirTodasEtapas(false);
});

// Cartão "Detalhes do cliente"
// Notas gerais do cliente (campo opcional notasGerais em dados.js) — texto
// livre sobre o relacionamento como um todo, diferente das observações por
// tarefa. Mostra da mais recente para a mais antiga; some por completo
// quando o cliente não tem nenhuma nota registrada.
function desenharNotasGerais(cliente) {

    const notas = (cliente && Array.isArray(cliente.notasGerais)) ? cliente.notasGerais.slice() : [];

    if (notas.length === 0) {
        blocoNotasGerais.hidden = true;
        listaNotasGerais.innerHTML = "";
        return;
    }

    notas.sort(function (a, b) {
        return (b.data || "").localeCompare(a.data || "");
    });

    blocoNotasGerais.hidden = false;
    listaNotasGerais.innerHTML = "";

    notas.forEach(function (nota) {
        const item = criar("li");
        if (nota.data) {
            item.appendChild(criar("span", "nota-geral-data", formatarData(nota.data)));
        }
        item.appendChild(criar("span", "nota-geral-texto", nota.texto || ""));
        listaNotasGerais.appendChild(item);
    });

}

// Preenche uma etiqueta (status / próxima ação) do resumo do cliente.
// Sem texto, mostra só um traço, sem a bolinha colorida.
function mostrarEtiqueta(elemento, texto, tom) {
    elemento.textContent = texto || "-";
    elemento.dataset.tom = tom;
    elemento.classList.toggle("sem-valor", !texto);
}

function desenharDetalhes(comAnimacao) {

    const cliente = acharCliente(idSelecionado);

    if (!cliente) {

        cartaoDetalhes.dataset.tom = "cinza";
        detalheNome.textContent = "Selecione um cliente";
        detalheEtapa.textContent = "-";
        mostrarEtiqueta(detalheStatus, "", "cinza");
        mostrarEtiqueta(detalheAcao, "", "cinza");
        desenharAvisoImpeditiva(null);
        desenharAvisoInconsistencia(null);
        desenharNotasGerais(null);
        desenharTarefas(null);
        return;

    }

    const etapa = acharEtapa(cliente.etapa);

    cartaoDetalhes.dataset.tom = etapa.tom;
    detalheNome.textContent = cliente.nome;
    detalheEtapa.textContent = etapa.nome;

    // Status na cor oficial do status; próxima ação no mesmo formato, em tom neutro
    const statusDoCliente = STATUS_OFICIAIS.find(function (opcao) { return opcao.nome === cliente.status; });
    mostrarEtiqueta(detalheStatus, cliente.status, statusDoCliente ? statusDoCliente.tom : "cinza");
    mostrarEtiqueta(detalheAcao, cliente.proximaAcao || "A definir", "cinza");

    desenharAvisoImpeditiva(cliente);
    desenharAvisoInconsistencia(cliente);
    desenharNotasGerais(cliente);

    desenharTarefas(cliente);

    if (comAnimacao) {
        // Reinicia a animação de entrada dos detalhes
        cartaoDetalhes.classList.remove("trocou");
        void cartaoDetalhes.offsetWidth;
        cartaoDetalhes.classList.add("trocou");
    }

}

function selecionar(id) {
    idSelecionado = id;
    desenharLista();
    desenharDetalhes(true);
}

// Desenha a página inteira
function desenharTudo() {
    desenharIndicadores();
    desenharEtapas();
    desenharLista();
    desenharDetalhes(false);
}


/* ----------------------------------------------------------
   6. Pesquisa
   ---------------------------------------------------------- */

campoPesquisa.addEventListener("input", function () {
    textoPesquisa = campoPesquisa.value.toLowerCase().trim();
    desenharLista();
});


/* ----------------------------------------------------------
   7. Animações de entrada
   ---------------------------------------------------------- */

// Animação de contagem dos números dos indicadores
function contarAte(elemento) {

    const valorFinal = parseInt(elemento.textContent, 10);

    if (isNaN(valorFinal) || menosMovimento) {
        return;
    }

    const duracao = 1200;
    const inicio = performance.now();

    function passo(agora) {

        const progresso = Math.min((agora - inicio) / duracao, 1);

        // Começa rápido e desacelera no final
        const suavizado = 1 - Math.pow(1 - progresso, 4);

        elemento.textContent = Math.round(valorFinal * suavizado);

        if (progresso < 1) {
            requestAnimationFrame(passo);
        }

    }

    elemento.textContent = 0;
    requestAnimationFrame(passo);

}

// Desenha a página pela primeira vez (antes de preparar as animações)
desenharTudo();

// Elementos que aparecem suavemente ao entrar na tela
// O cartão de detalhes ficou de fora desta lista: com as tarefas de
// todas as etapas, ele pode ficar bem mais alto que a tela, e o efeito
// de "aparecer suavemente ao rolar" (calculado sobre 15% da altura do
// elemento) deixaria de disparar. Ele continua sempre visível.
const elementosRevelar = document.querySelectorAll(
    ".resumo h2, .etapas h2, .detalhes-cliente h2, " +
    ".cartao, .lista-etapas, .etapa, .area-pesquisa, .cliente"
);

// Cada elemento recebe uma posição para aparecer em sequência (efeito cascata)
elementosRevelar.forEach(function (elemento) {

    elemento.classList.add("revelar");

    const irmaos = Array.from(elemento.parentElement.children);
    elemento.style.setProperty("--i", irmaos.indexOf(elemento));

});

if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver(function (entradas) {

        entradas.forEach(function (entrada) {

            if (!entrada.isIntersecting) {
                return;
            }

            entrada.target.classList.add("visivel");

            // Números dos indicadores contam de 0 até o valor
            if (entrada.target.classList.contains("cartao")) {
                contarAte(entrada.target.querySelector("strong"));
            }

            observador.unobserve(entrada.target);

        });

    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    elementosRevelar.forEach(function (elemento) {
        observador.observe(elemento);
    });

} else {

    // Navegadores antigos: mostra tudo sem animação
    elementosRevelar.forEach(function (elemento) {
        elemento.classList.add("visivel");
    });

}
