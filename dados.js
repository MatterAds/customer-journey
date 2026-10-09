/* ==========================================================
   DADOS  —  Jornada de Sucesso Broady

   Este é o único arquivo com as informações do painel.
   Tudo o que aparece na página (números, barras, lista de
   atenção, detalhes, tarefas e checkpoints) é calculado a
   partir daqui.

   Fonte das tarefas, ações e checkpoints: documentação
   "Jornada de Sucesso do Cliente | Detalhamento" (Notion/PDF).
   Não foram criadas tarefas, ações ou checkpoints além dos
   que constam nessa documentação. Em outubro/2026 as etapas 1 e 2
   foram reorganizadas a pedido da Camila (o onboarding acontece na
   call inicial): as tarefas 1.2 a 1.7 e 2.1 a 2.6 foram juntadas em
   1.1 a 1.4 (Contato inicial) e 2.1 a 2.3 (Ativação), reaproveitando
   as ações originais da documentação. Depois, a etapa 3 (Período de
   teste) foi juntada à etapa 2, que passou a se chamar "Ativação e
   período de teste" (tarefas 2.1 a 2.6); a jornada passou a ter 5
   etapas e as etapas contínuas foram renumeradas (3, 4 e 5). Em seguida, a etapa
   3 (Continuidade e operação) ficou com 2 tarefas de marco, sem o
   acompanhamento diário, e a etapa 4 virou "Evolução e escalabilidade"
   (tarefas 4.1 a 4.4, incluindo a avaliação da ferramenta). A etapa 5
   foi reduzida a 5 tarefas (5.1 a 5.5): ganhou a análise geral dos
   fluxos (resposta inicial/padrão, sequência e broadcast) e termina com
   o contato com o cliente e o plano de ação (se necessário). As listas
   da parte 3 (possíveis pendências e alertas) continuam neste arquivo,
   mas não são mais exibidas na tela. Em seguida, os 7 clientes de exemplo
   foram substituídos pelos 10 clientes ativos reais, cadastrados só com o
   nome (etapa "Contato inicial", status "Não iniciado" e sem próxima ação),
   até a Camila passar a situação real de cada um.

   O arquivo tem duas partes:
     1. TAREFAS    — as tarefas oficiais de cada etapa, com as
                     ações que a compõem e o checkpoint da tarefa
                     (valem para todos os clientes)
     2. CLIENTES   — os clientes e o andamento de cada um

   Mantenha as aspas, os dois-pontos e as vírgulas no fim de
   cada linha e de cada bloco.
   ========================================================== */


/* ==========================================================
   1. TAREFAS (tarefas, ações e checkpoints de cada etapa)

   Campos de cada tarefa:
     id           identificação da etapa (ex.: "1.1", "2.3")
     etapa        código da etapa (veja a lista abaixo)
     nome         nome da tarefa
     acoes        lista das ações que compõem a tarefa
     checkpoint   o que confirma que a tarefa foi cumprida
     avancoEtapa  true só na tarefa que é o "checkpoint de
                  avanço da etapa" (existe nas etapas 1 e 2,
                  conforme a documentação)
     observacao   nota da documentação sobre a tarefa (opcional,
                  só existe na tarefa 5.6)

   ETAPA (use exatamente um destes códigos):
     descoberta      Contato inicial
     onboarding      Ativação e período de teste
     operacao        Continuidade e operação (contínua)
     acompanhamento  Evolução e escalabilidade (contínua)
     sucesso         Sucesso e evolução da operação (contínua)
   ========================================================== */

const TAREFAS = [
    {
        "id": "1.1",
        "etapa": "descoberta",
        "nome": "Receber o contato inicial",
        "acoes": [
            "Receber o contato do cliente.",
            "Identificar quem realizou o contato.",
            "Registrar o nome do cliente ou empresa.",
            "Identificar o canal de entrada.",
            "Confirmar o interesse na Chatfood."
        ],
        "checkpoint": "O contato inicial foi recebido e identificado."
    },
    {
        "id": "1.2",
        "etapa": "descoberta",
        "nome": "Entender a operação e os objetivos do cliente",
        "acoes": [
            "Responder ao cliente pelo WhatsApp.",
            "Entender brevemente o negócio.",
            "Identificar o segmento de atuação.",
            "Entender como o cliente utiliza atualmente seus canais de comunicação.",
            "Identificar se já utiliza alguma ferramenta de automação.",
            "Levantar as principais dúvidas iniciais.",
            "Identificar quais canais o cliente utiliza.",
            "Entender se utiliza Facebook Messenger, WhatsApp ou outros canais.",
            "Identificar como o cliente realiza seus atendimentos.",
            "Entender o volume aproximado de contatos ou leads.",
            "Identificar se possui campanhas ou ações recorrentes.",
            "Entender como os leads são recebidos e trabalhados.",
            "Identificar quem será responsável pela operação da Chatfood.",
            "Perguntar o que o cliente espera alcançar.",
            "Identificar os principais objetivos com a Chatfood.",
            "Entender as dificuldades atuais.",
            "Identificar necessidades de automação.",
            "Identificar necessidades de organização.",
            "Identificar necessidades de escala.",
            "Verificar se o cliente possui alguma necessidade específica de treinamento.",
            "Identificar possíveis riscos ou limitações da operação."
        ],
        "checkpoint": "A operação e os principais objetivos do cliente foram compreendidos e registrados."
    },
    {
        "id": "1.3",
        "etapa": "descoberta",
        "nome": "Realizar a call de onboarding",
        "acoes": [
            "Relacionar as necessidades do cliente aos recursos da plataforma.",
            "Explicar os recursos mais relevantes para a operação.",
            "Esclarecer dúvidas iniciais.",
            "Alinhar expectativas sobre o uso da ferramenta.",
            "Explicar como será o processo de onboarding.",
            "Explicar o período de teste de 14 dias.",
            "Orientar sobre os próximos passos.",
            "Identificar se uma call é necessária.",
            "Agendar a reunião.",
            "Realizar a call.",
            "Aprofundar o entendimento da operação.",
            "Apresentar a ferramenta, quando necessário.",
            "Realizar orientações iniciais.",
            "Registrar dúvidas e necessidades levantadas durante a conversa.",
            "Confirmar que o cliente está pronto para iniciar.",
            "Confirmar os responsáveis do lado do cliente.",
            "Alinhar os próximos passos.",
            "Informar quais dados ou acessos serão necessários.",
            "Definir o canal principal de comunicação.",
            "Confirmar a criação do grupo de WhatsApp, quando aplicável.",
            "Agendar ou realizar o treinamento.",
            "Apresentar a interface da Chatfood.",
            "Explicar os recursos necessários para o cliente.",
            "Demonstrar como utilizar os principais recursos.",
            "Explicar como acompanhar a operação.",
            "Orientar sobre dúvidas comuns.",
            "Apresentar o canal de suporte.",
            "Confirmar se o cliente conseguiu acompanhar.",
            "Explicar como iniciar a utilização.",
            "Orientar sobre os primeiros passos.",
            "Explicar como solicitar suporte.",
            "Informar sobre o período de teste de 14 dias.",
            "Alinhar o que será acompanhado durante o teste.",
            "Orientar sobre a importância de informar erros ou dificuldades.",
            "Confirmar quem acompanhará a operação no dia a dia."
        ],
        "checkpoint": "A call de onboarding foi realizada, com a Chatfood apresentada, os responsáveis identificados e as orientações iniciais repassadas."
    },
    {
        "id": "1.4",
        "etapa": "descoberta",
        "nome": "Confirmar prontidão para a ativação",
        "acoes": [
            "Confirmar se o cliente deseja prosseguir.",
            "Verificar se as informações necessárias foram obtidas.",
            "Confirmar quem será o responsável pelo projeto no cliente.",
            "Identificar se existe alguma pendência antes do onboarding.",
            "Alinhar o início do processo.",
            "Registrar a data prevista para início."
        ],
        "checkpoint": "Existem informações suficientes para iniciar a ativação.",
        "avancoEtapa": true
    },
    {
        "id": "2.1",
        "etapa": "onboarding",
        "nome": "Criar e confirmar os acessos",
        "acoes": [
            "Solicitar os dados necessários.",
            "Criar os acessos da plataforma.",
            "Confirmar o recebimento dos convites.",
            "Verificar se o cliente conseguiu acessar.",
            "Confirmar os responsáveis que terão acesso.",
            "Identificar eventuais dificuldades de login.",
            "Orientar o cliente em caso de problemas."
        ],
        "checkpoint": "Os acessos necessários foram criados e confirmados."
    },
    {
        "id": "2.2",
        "etapa": "onboarding",
        "nome": "Realizar configurações iniciais",
        "acoes": [
            "Verificar as configurações básicas.",
            "Configurar os recursos necessários para o início.",
            "Conferir páginas e canais conectados.",
            "Verificar configurações relacionadas à operação.",
            "Confirmar informações necessárias do cliente.",
            "Identificar configurações que dependem do cliente.",
            "Registrar configurações ainda pendentes."
        ],
        "checkpoint": "As configurações iniciais necessárias foram realizadas ou possuem responsáveis e próximos passos definidos."
    },
    {
        "id": "2.3",
        "etapa": "onboarding",
        "nome": "Confirmar o início do uso das funcionalidades",
        "acoes": [
            "Confirmar que o cliente possui acesso.",
            "Confirmar que as configurações mínimas foram realizadas.",
            "Confirmar que o cliente recebeu treinamento ou orientação.",
            "Verificar se existem dúvidas impeditivas.",
            "Confirmar a data de início do teste.",
            "Registrar o início do período de 14 dias.",
            "Informar os próximos passos.",
            "Confirmar a data de início.",
            "Registrar o período de teste.",
            "Confirmar se o cliente conseguiu acessar.",
            "Verificar se o cliente iniciou a utilização.",
            "Confirmar se existem dúvidas iniciais.",
            "Reforçar o canal de suporte.",
            "Alinhar os próximos acompanhamentos."
        ],
        "checkpoint": "O uso das funcionalidades foi iniciado: páginas vinculadas e configuradas, fluxos iniciais criados e ativados e primeiros broadcasts enviados."
    },
    {
        "id": "2.4",
        "etapa": "onboarding",
        "nome": "Acompanhar o período de teste",
        "acoes": [
            "Verificar se o cliente começou a utilizar a plataforma.",
            "Confirmar se as configurações estão funcionando.",
            "Identificar dificuldades iniciais.",
            "Responder dúvidas.",
            "Orientar sobre os recursos utilizados.",
            "Apoiar ajustes necessários.",
            "Verificar se o cliente precisa de novo treinamento.",
            "Acompanhar as solicitações recebidas no grupo.",
            "Verificar dúvidas recorrentes.",
            "Identificar erros relatados.",
            "Orientar o cliente sobre a utilização.",
            "Apoiar configurações adicionais.",
            "Confirmar se os recursos necessários estão sendo utilizados.",
            "Registrar problemas que exigem investigação.",
            "Acompanhar a resolução de problemas."
        ],
        "checkpoint": "A utilização no período de teste foi acompanhada e as principais dificuldades estão registradas."
    },
    {
        "id": "2.5",
        "etapa": "onboarding",
        "nome": "Revisar pendências e confirmar a ativação operacional",
        "acoes": [
            "Confirmar se o cliente está utilizando a plataforma.",
            "Verificar se os recursos principais estão configurados.",
            "Identificar se existem fluxos ou broadcasts em funcionamento.",
            "Confirmar se o cliente entende o funcionamento básico.",
            "Avaliar se o cliente consegue realizar tarefas simples.",
            "Identificar dependências que ainda impedem a operação.",
            "Verificar se há necessidade de treinamento complementar.",
            "Levantar pendências ainda abertas.",
            "Identificar erros não resolvidos.",
            "Verificar configurações incompletas.",
            "Confirmar dúvidas ainda existentes.",
            "Identificar dificuldades de autonomia.",
            "Confirmar se o cliente precisa de suporte adicional.",
            "Definir responsáveis pelas pendências.",
            "Registrar os próximos passos."
        ],
        "checkpoint": "O cliente está utilizando a Chatfood e as pendências possuem encaminhamento."
    },
    {
        "id": "2.6",
        "etapa": "onboarding",
        "nome": "Confirmar o encerramento do período de teste",
        "acoes": [
            "Confirmar a conclusão dos 14 dias.",
            "Verificar se o cliente utilizou a plataforma.",
            "Confirmar se existem problemas críticos.",
            "Verificar se o cliente está preparado para continuar.",
            "Registrar feedback inicial.",
            "Confirmar os próximos passos após o teste.",
            "Informar sobre o início da cobrança, quando aplicável.",
            "Manter o grupo de comunicação ativo."
        ],
        "checkpoint": "O teste foi concluído e o cliente está preparado para continuar a operação.",
        "avancoEtapa": true
    },
    {
        "id": "3.1",
        "etapa": "operacao",
        "nome": "Confirmar a efetivação do plano",
        "acoes": [],
        "checkpoint": "O período de teste foi finalizado e o plano foi efetivado."
    },
    {
        "id": "3.2",
        "etapa": "operacao",
        "nome": "Manter o acompanhamento ativo",
        "acoes": [
            "Manter o grupo de WhatsApp ativo.",
            "Receber solicitações.",
            "Responder dúvidas.",
            "Orientar sobre o uso da plataforma.",
            "Identificar solicitações urgentes.",
            "Encaminhar problemas quando necessário.",
            "Acompanhar solicitações até sua conclusão.",
            "Verificar se os broadcasts estão sendo enviados corretamente.",
            "Identificar broadcasts com erros.",
            "Verificar se existem páginas desvinculadas.",
            "Conferir alertas apresentados.",
            "Verificar fluxos configurados incorretamente.",
            "Identificar comportamentos fora do esperado.",
            "Registrar ocorrências relevantes.",
            "Tomar as providências necessárias."
        ],
        "checkpoint": "O grupo de acompanhamento segue ativo e as análises diárias da operação continuam sendo realizadas."
    },
    {
        "id": "4.1",
        "etapa": "acompanhamento",
        "nome": "Realizar o contato de evolução (call, WhatsApp ou questionário)",
        "acoes": [
            "Entrar em contato com o cliente.",
            "Sugerir datas e horários.",
            "Confirmar a reunião.",
            "Registrar a data.",
            "Identificar os participantes.",
            "Definir os assuntos que serão abordados.",
            "Confirmar a realização.",
            "Entender como está a utilização da Chatfood.",
            "Verificar se os recursos necessários estão sendo utilizados.",
            "Identificar mudanças na operação.",
            "Verificar se houve aumento de volume.",
            "Identificar novos canais ou necessidades.",
            "Entender se existem dificuldades atuais.",
            "Revisar problemas recorrentes.",
            "Perguntar como está sendo a experiência.",
            "Identificar pontos positivos.",
            "Identificar dificuldades.",
            "Entender se o suporte está atendendo às necessidades.",
            "Verificar se o cliente sente falta de algum recurso ou orientação.",
            "Identificar dúvidas sobre a plataforma.",
            "Registrar feedbacks."
        ],
        "checkpoint": "O contato de evolução foi realizado e a percepção do cliente foi registrada."
    },
    {
        "id": "4.2",
        "etapa": "acompanhamento",
        "nome": "Avaliar a evolução e a capacidade de escala",
        "acoes": [
            "Verificar se o cliente possui novos objetivos.",
            "Identificar mudanças na operação.",
            "Entender se precisa de novos treinamentos.",
            "Identificar novos recursos que podem ser utilizados.",
            "Identificar necessidades de escala.",
            "Verificar necessidades relacionadas à contingência.",
            "Identificar oportunidades de melhoria.",
            "Entender se o cliente pretende aumentar a operação.",
            "Identificar crescimento no volume de leads.",
            "Verificar se existem novos canais ou páginas.",
            "Identificar necessidade de novos fluxos.",
            "Avaliar necessidade de novos treinamentos.",
            "Identificar possíveis limitações operacionais.",
            "Registrar os próximos objetivos."
        ],
        "checkpoint": "As necessidades de evolução e os objetivos de crescimento do cliente foram identificados."
    },
    {
        "id": "4.3",
        "etapa": "acompanhamento",
        "nome": "Avaliar a ferramenta (bugs e sugestões de melhoria)",
        "acoes": [],
        "checkpoint": "A avaliação do cliente sobre a ferramenta, os bugs encontrados e as sugestões de melhoria foram registrados."
    },
    {
        "id": "4.4",
        "etapa": "acompanhamento",
        "nome": "Definir as ações de evolução",
        "acoes": [
            "Identificar se o cliente precisa de acompanhamento periódico.",
            "Definir uma periodicidade inicial.",
            "Avaliar possibilidade de contato mensal.",
            "Avaliar possibilidade de contato bimestral.",
            "Considerar o perfil e a complexidade da operação.",
            "Registrar a periodicidade definida.",
            "Definir a data do próximo contato.",
            "Registrar as ações combinadas.",
            "Definir responsáveis.",
            "Definir prazos, quando necessário.",
            "Identificar se será necessário treinamento.",
            "Identificar se será necessário ajuste de configuração.",
            "Registrar melhorias sugeridas.",
            "Definir a próxima revisão.",
            "Registrar a data do contato.",
            "Registrar os participantes.",
            "Registrar os principais assuntos.",
            "Registrar feedbacks.",
            "Registrar pendências.",
            "Registrar ações futuras.",
            "Atualizar a data do próximo acompanhamento."
        ],
        "checkpoint": "As ações de evolução e a data do próximo contato foram definidas e registradas."
    },
    {
        "id": "5.1",
        "etapa": "sucesso",
        "nome": "Avaliar autonomia e organização da operação",
        "acoes": [
            "Verificar se o cliente consegue utilizar os recursos principais.",
            "Identificar se depende constantemente de suporte.",
            "Observar dúvidas recorrentes.",
            "Confirmar se consegue realizar tarefas básicas.",
            "Identificar necessidade de treinamento adicional.",
            "Registrar o nível de autonomia percebido.",
            "Verificar se a operação está organizada.",
            "Identificar se os fluxos estão estruturados.",
            "Conferir se os recursos são utilizados de forma adequada.",
            "Identificar configurações que precisam ser revisadas.",
            "Verificar se existem processos repetitivos que podem ser melhorados.",
            "Sugerir ajustes quando necessário."
        ],
        "checkpoint": "A autonomia do cliente e os principais pontos de organização da operação foram observados e registrados."
    },
    {
        "id": "5.2",
        "etapa": "sucesso",
        "nome": "Acompanhar resultados relatados pelo cliente",
        "acoes": [
            "Perguntar se o cliente percebeu evolução.",
            "Identificar resultados relatados.",
            "Entender se houve melhoria na organização.",
            "Verificar se houve aumento de volume ou escala.",
            "Perguntar sobre percepção de campanhas e ações realizadas.",
            "Registrar dados fornecidos pelo cliente.",
            "Diferenciar informações relatadas de indicadores internos validados."
        ],
        "checkpoint": "Os resultados percebidos pelo cliente foram registrados, quando disponíveis.",
        "observacao": "Informações como vendas, leads, conversões, faturamento e ROI poderão ser registradas como relatos do cliente. Esses dados não devem ser tratados automaticamente como indicadores internos da Chatfood sem uma integração ou validação específica."
    },
    {
        "id": "5.3",
        "etapa": "sucesso",
        "nome": "Fazer a análise geral dos fluxos",
        "acoes": [],
        "checkpoint": "Os fluxos de resposta inicial/padrão, sequência e broadcast foram analisados e os pontos de melhoria identificados."
    },
    {
        "id": "5.4",
        "etapa": "sucesso",
        "nome": "Avaliar capacidade de escala e uso dos recursos",
        "acoes": [
            "Entender se o cliente pretende aumentar a operação.",
            "Identificar crescimento no volume de leads.",
            "Verificar se existem novos canais ou páginas.",
            "Identificar necessidade de novos fluxos.",
            "Avaliar necessidade de novos treinamentos.",
            "Identificar possíveis limitações operacionais.",
            "Registrar os próximos objetivos.",
            "Verificar se o cliente utiliza os recursos necessários.",
            "Identificar recursos ainda não utilizados.",
            "Entender se existem recursos que poderiam ajudar na operação.",
            "Sugerir melhorias de utilização.",
            "Identificar necessidade de demonstração.",
            "Registrar oportunidades de evolução."
        ],
        "checkpoint": "Os objetivos de crescimento, as necessidades de escala e as oportunidades de melhoria no uso da plataforma foram identificados."
    },
    {
        "id": "5.5",
        "etapa": "sucesso",
        "nome": "Contatar o cliente e alinhar o plano de ação (se necessário)",
        "acoes": [],
        "checkpoint": "O cliente foi contatado e, quando necessário, o plano de ação sobre escala, melhorias e evolução foi alinhado com base na análise dos fluxos."
    }
];


/* ==========================================================
   2. CLIENTES

   Campos de cada cliente:
     nome, etapa, status, proximaAcao, responsavel,
     atencao (true ou false) e motivo (usado quando atencao
     for true)

   notasGerais (opcional): lista de notas gerais sobre o
   cliente — diferente das observações de cada tarefa, é um
   espaço livre para contexto do relacionamento como um todo
   (ex.: um combinado com o cliente, um retorno que ele deu).
   Cada nota é um objeto com "data" (formato AAAA-MM-DD) e
   "texto". A mais recente pode vir em qualquer posição da
   lista — o painel mostra sempre ordenado da mais recente
   para a mais antiga. Não é editável pelo próprio dashboard:
   para adicionar uma nota, peça para o Claude incluir aqui.
   Exemplo:
     "notasGerais": [
         { "data": "2026-03-10", "texto": "Cliente pediu para remarcar o treinamento para a segunda quinzena de abril." }
     ]

   STATUS (do cliente e de cada tarefa — use exatamente um
   destes textos, os sete status oficiais da documentação):
     Não iniciado
     Em andamento
     Aguardando ação do cliente
     Aguardando ação da CX
     Bloqueado
     Concluído
     Em acompanhamento contínuo

   etapasConcluidas: lista das etapas que você já confirmou
   como concluídas para este cliente (ex.: ["descoberta",
   "onboarding"]). É o que a documentação chama de "etapas
   concluídas" na Regra 5 — é a partir daqui que o percentual
   de avanço da jornada é calculado (veja a tabela da Regra 5:
   0 etapas = 0%, 1 etapa = 20%, 2 = 40%, 3 = 60%, 4 = 80%,
   5 = 100%). Uma etapa só deve entrar nessa lista quando o
   checkpoint de avanço dela (etapas 1 e 2) tiver sido atendido,
   ou quando você decidir registrar as etapas contínuas (3, 4 e
   5) como concluídas.

   tarefas: o andamento de cada tarefa do cliente, usando o
   "id" da tarefa (ex.: "2.1"). Tarefa que não aparece aqui
   conta como "Não iniciado".

   Cada tarefa aceita, além de "status", estes campos opcionais
   (baseados na "Estrutura sugerida de tarefa no dashboard" da
   documentação). Só inclua o campo quando tiver a informação —
   nenhum deles é obrigatório:
     responsavel     quem está responsável pela tarefa (texto,
                      ex.: "CX" ou "Cliente")
     dataCriacao      data em que a tarefa foi criada/iniciada
                      (use o formato AAAA-MM-DD, ex.: "2026-03-10")
     dataConclusao    data em que a tarefa foi concluída
                      (mesmo formato AAAA-MM-DD)
     prazo            prazo da tarefa, quando houver um prazo
                      definido (mesmo formato AAAA-MM-DD)
     impeditiva       true só quando VOCÊ identificar que essa
                      tarefa está impedindo o cliente de avançar.
                      Não existe regra automática que marque isso
                      sozinho — é sempre uma decisão sua.
     observacao       nota sua sobre a tarefa (já existia)
     proximoPasso     o próximo passo definido para essa tarefa
                      (texto livre)

   Exemplo de uma tarefa com todos os campos preenchidos:
     "2.3": {
         "status": "Em andamento",
         "responsavel": "CX",
         "dataCriacao": "2026-03-01",
         "prazo": "2026-03-15",
         "impeditiva": false,
         "observacao": "Aguardando retorno do time técnico.",
         "proximoPasso": "Cobrar retorno até sexta-feira."
     }
   ========================================================== */

const CLIENTES = [
    {
        "nome": "Cenário Capital",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "J Lord Performance",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Zimmerman",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "PubViews",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Minuto VIP",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Mira Media",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Omes",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Huigor",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Rocket",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "Matter",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    },
    {
        "nome": "KHS Mídia",
        "etapa": "descoberta",
        "status": "Não iniciado",
        "proximaAcao": "",
        "responsavel": "",
        "atencao": false,
        "motivo": "",
        "etapasConcluidas": [],
        "tarefas": {}
    }
];


/* ==========================================================
   3. POSSÍVEIS PENDÊNCIAS E POSSÍVEIS ALERTAS

   Fonte: mesma documentação "Jornada de Sucesso do Cliente |
   Detalhamento". São só listas de referência, uma por etapa —
   o que costuma travar ou pedir atenção nela. Elas NÃO se
   ligam automaticamente a nenhum cliente: se um cliente
   específico está com uma dessas situações, isso continua
   sendo registrado à parte, nos campos "atencao" e "motivo"
   do próprio cliente (ou nas observações das tarefas).

   Campos:
     etapa   código da etapa (a mesma lista de sempre)
     tipo    "pendencia" ou "alerta" — na documentação, as
             etapas 1, 2, 3, 5 e 6 têm "Possíveis pendências"
             e a etapa 4 tem "Possíveis alertas"
     itens   a lista, copiada da documentação
   ========================================================== */

const PENDENCIAS_ALERTAS = [
    {
        "etapa": "descoberta",
        "tipo": "pendencia",
        "itens": [
            "Cliente não respondeu.",
            "Informações sobre a operação estão incompletas.",
            "Call ainda não foi realizada.",
            "Necessidades não foram identificadas.",
            "Cliente ainda está avaliando a contratação.",
            "Responsável pela operação não foi definido.",
            "Cliente não está pronto para iniciar.",
            "Existem dúvidas comerciais ou operacionais pendentes."
        ]
    },
    {
        "etapa": "onboarding",
        "tipo": "pendencia",
        "itens": [
            "Acesso não criado.",
            "Convite não aceito.",
            "Cliente não conseguiu acessar.",
            "Configuração incompleta.",
            "Página ou canal não conectado.",
            "Informações não enviadas pelo cliente.",
            "Treinamento pendente.",
            "Dúvidas iniciais não resolvidas.",
            "Dependência de outro responsável do cliente.",
            "Cliente ainda não está pronto para iniciar o teste.",
            "Cliente não iniciou o teste.",
            "Cliente não acessou a plataforma.",
            "Cliente não utilizou os recursos.",
            "Configurações incompletas.",
            "Erros durante a utilização.",
            "Dúvidas recorrentes.",
            "Falta de autonomia.",
            "Necessidade de novo treinamento.",
            "Problemas ainda não resolvidos.",
            "Cliente sem retorno.",
            "Dependência de informações ou ações do cliente."
        ]
    },
    {
        "etapa": "operacao",
        "tipo": "alerta",
        "itens": [
            "Broadcast com erro.",
            "Envio restrito pela Meta.",
            "Página desvinculada.",
            "Fluxo configurado incorretamente.",
            "Cliente sem retorno.",
            "Problema recorrente.",
            "Necessidade de intervenção.",
            "Dificuldade de utilização.",
            "Necessidade de treinamento.",
            "Dependência de outra equipe ou responsável."
        ]
    },
    {
        "etapa": "acompanhamento",
        "tipo": "pendencia",
        "itens": [
            "Reunião não agendada.",
            "Cliente não respondeu.",
            "Reunião cancelada.",
            "Feedback pendente.",
            "Dificuldade não resolvida.",
            "Treinamento necessário.",
            "Próximos passos não definidos.",
            "Responsável não identificado.",
            "Necessidade de novo contato."
        ]
    },
    {
        "etapa": "sucesso",
        "tipo": "pendencia",
        "itens": [
            "Cliente com baixa autonomia.",
            "Necessidade de treinamento.",
            "Operação desorganizada.",
            "Falta de contingência.",
            "Dependência de um único acesso.",
            "Dificuldades recorrentes.",
            "Recursos importantes não utilizados.",
            "Objetivos do cliente não definidos.",
            "Falta de informações sobre resultados.",
            "Necessidade de acompanhamento adicional."
        ]
    }
];
