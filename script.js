var randomnumber = 0;
const priorityDays = {
    2: 30,
    3: 60,
    4: 90
}

var quantAlta = 0;
var quantMedia = 0;
var quantBaixa = 0;
var quantParada = 0;

helloMessage();
document.querySelector("#searchTxt").addEventListener("keydown", function(event){
    if(event.keyCode === 13){
        sendMessage();
    }
});

function getName(){
    var name;
    var minNumber = 0;
    var maxNumber = 2;
    randomnumber = Math.floor(Math.random() * (maxNumber + 1) + minNumber);
    switch(randomnumber){
        case 0:
            name = "S.A.M.A.N.T.H.A. - Sistema de Acompanhamento Manserv de Tratativas, Históricos e Atendimentos";
            break;
        case 1:
            name = "S.A.M.A.N.T.H.A. - Sistema de Acompanhamento Manserv de Tratativas, Históricos e Atendimentos";
            break;
        case 2:
            name = "S.A.M.A.N.T.H.A. - Sistema de Acompanhamento Manserv de Tratativas, Históricos e Atendimentos";
            break;
    }
    return name;
}

function helloMessage(){
    var assistente = getName();
    const hello = `Olá! Me chamo ${assistente}. Sou assistente virtual da Manserv, e irei ajudar com o seu atendimento. Por favor, informe o número do seu chamado através da ordem SAP. Exemplo: 820171234`;
    const outputDate = dateFormat();
    document.querySelector('#chat-messages')
    .innerHTML += `<div class="incoming-chat">
                    <p class="incoming-message">${hello}</p>
                    <span class="time">${outputDate}</span>
                    </div>`;
}

function sendMessage(){
    const message = document.getElementById("searchTxt").value;
    document.getElementById("searchTxt").value = "";
    const outputDate = dateFormat();
    document.querySelector('#chat-messages')
    .innerHTML += `<div class="outgoing-chat"></div>
                    <div class="outgoing-chat"></div>
                    <div class="outgoing-chat">
                    <p class="outgoing-message">${message}</p>
                    <span class="time">${outputDate}</span>
                    </div>`;
    if(message.length != 9 || message.substring(0, 1) != "8"){
        document.querySelector('#chat-messages')
        .innerHTML += `<div class="incoming-chat response">
                    <p class="incoming-message">Por favor, digite um número de chamado válido</p>
                    <span class="time">${outputDate}</span>
                    </div>`;
        document.querySelector('.response').classList.remove('response');
        document.getElementById('chat-messages').scrollTop = document
        .getElementById('chat-messages').scrollHeight;
    }else{
        searchIncident(message);
    }
}

function countIncidents(){
    quantAlta = 0;
    quantMedia = 0;
    quantBaixa = 0;
    quantParada = 0;
    for(let i = 0; i < json.sisteplant.length; i++){
        if(json.sisteplant[i][7] < 96){
            switch(json.sisteplant[i][2]){
                case "2":
                    quantAlta++;
                    break;
                case "3":
                    quantMedia++;
                    break;
                case "4":
                    quantBaixa++;
                    break;
                case "5":
                    quantParada++;
                    break;
            }
        }
    }
}

function searchIncident(text){
    var found = false;
    for(let i = 0; i < json.sisteplant.length; i++){
        if(json.sisteplant[i][1].includes(text)){
            returnMessage(json.sisteplant[i]);
            found = true;
            break;
        }
    }
    if(!found){
        var outputDate = dateFormat();
        document.querySelector('#chat-messages')
        .innerHTML += `<div class="incoming-chat response">
                    <p class="incoming-message">${searchError}</p>
                    <span class="time">${outputDate}</span>
                    </div>`;
        document.querySelector('.response').classList.remove('response');
        document.getElementById('chat-messages').scrollTop = document
        .getElementById('chat-messages').scrollHeight;
    }
}

function dateConversion(date){
    var date = new Date(Math.round((date - 25569)*86400*1000));
    var stringDate = date.toString();
    var day = stringDate.substring(8, 10);
    var month = stringDate.substring(4, 7);
    console.log(day);
    console.log(month);
    var monthNb;
    switch(month){
        case "Jan":
            monthNb = "01";
            break;
        case "Feb":
            monthNb = "02";
            break;
        case "Mar":
            monthNb = "03";
            break;
        case "Apr":
            monthNb = "04";
            break;
        case "May":
            monthNb = "05";
            break;
        case "Jun":
            monthNb = "06";
            break;
        case "Jul":
            monthNb = "07";
            break;
        case "Aug":
            monthNb = "08";
            break;
        case "Sep":
            monthNb = "09";
            break;
        case "Oct":
            monthNb = "10";
            break;
        case "Nov":
            monthNb = "11";
            break;
        case "Dec":
            monthNb = "12";
            break;
    }
    var templateDate = `${day}/${monthNb}`;
    return templateDate;
}

const winking = "";
const duvida = `Caso ainda tenha alguma dúvida sobre o seu chamado, ou precise de alguma outra informação, favor enviar e-mail para manserv@stihl.com.br. Ah, não esqueça de informar o número do seu chamado no e-mail ;)${winking}`;
const searchError = `Poxa, não consegui localizar o seu chamado 😕. Por favor, verifique se o número está correto e, caso esteja, envie um e-mail para manserv@stihl.com.br informando o número.`;

function returnMessage(object){
    countIncidents();
    var quantChamados = ``;
    var status = object[7];
    var tipoServ = object[9];
    var message = "";
    var prioridade = object[2];
    var prazoAva;
    var dataPrev = object[8].substring(0, 11);
    var prioTxt = "";
    var prazo = "";
    var enviarDuvida;

    const dateS = new Date();
    const day = String(dateS.getDate()).padStart(2, '0');
    const month = String(dateS.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = dateS.getFullYear();
    const today = `${day}/${month}/${year}`;

    const dateToday = parseDate(today);
    const datePreview = parseDate(dataPrev);
    const datePlusPrio = addPriorityDays(dateToday, prioridade)
    const strDatePreview = dateToString(datePreview);
    const strDatePlusPrio = dateToString(datePlusPrio);

    switch(prioridade){
        case "2":
            prioTxt = "alta";
            prazo = "30 dias";
            prazoAva = "10 dias";
            break;
        case "3":
            prioTxt = "média";
            prazo = "60 dias";
            prazoAva = "15 dias";
            break;
        case "4":
            prioTxt = "baixa";
            prazo = "90 dias";
            prazoAva = "30 dias";
            break;
        case "5":
            prioTxt = "parada programada";
            prazo = "ser executada na próxima parada de manutenção";
            prazoAva = "60 dias;"
            break;
    }
    switch(status){
        case "0": //Aberta
            switch(randomnumber){
                case 0:
                    message = `Seu chamado foi aberto como prioridade ${prioTxt} e está aguardando avaliação da equipe responsável. Um de nossos técnicos irá te procurar em breve, o prazo de avaliação é de ${prazoAva} 😉`;
                    enviarDuvida = true;
                    break;
                case 1:
                    message = `Seu chamado foi aberto como prioridade ${prioTxt} e está aguardando avaliação da equipe responsável. Em um prazo de ${prazoAva}, um de nossos técnicos entrará em contato. Por favor, aguarde 😊`;
                    enviarDuvida = true;
                    break;
                case 2:
                    message = `Seu chamado foi aberto como prioridade ${prioTxt} e está em análise pela equipe responsável. Um de nossos técnicos entrará em contato em até ${prazoAva}. Pedimos que aguarde 😙`;
                    enviarDuvida = true;
                    break;
            }
            break;
        case "00": //Aberta
            switch(randomnumber){
                case 0:
                    message = `Seu chamado está aberto e aguardando avaliação da equipe responsável. Um de nossos técnicos irá te procurar em breve, peço que aguarde alguns dias e depois faça a consulta novamente 😉`;
                    enviarDuvida = true;
                    break;
                case 1:
                    message = `Seu chamado foi aberto e está aguardando a avaliação da equipe responsável. Em breve, um de nossos técnicos entrará em contato. Por favor, aguarde e consulte novamente depois de alguns dias 😊`;
                    enviarDuvida = true;
                    break;
                case 2:
                    message = `Seu chamado está em análise pela equipe responsável. Um de nossos técnicos entrará em contato em breve. Pedimos que aguarde e realize uma nova consulta após alguns dias 😙`;
                    enviarDuvida = true;
                    break;
            }
            break;
        case "39": //Impedimento - fornecedor
            message = `Estamos buscando um fornecedor no mercado para que possamos adquirir os materiais necessários para atender seu chamado. Peço que consulte novamente dentro de alguns dias 🫡`;
            break
        case "40": //Impedimento - material
            if(datePreview < dateToday){
                switch(randomnumber){
                    case 0:
                        message = `Seu chamado está aguardando compra de material. Assim que o material estiver disponível, entrará na programação 🫡`;
                        enviarDuvida = true;
                        break;
                    case 1:
                        message = `Seu chamado está aguardando a aquisição do material. Assim que ele estiver disponível, será incluído na programação 😁`;
                        enviarDuvida = true;
                        break;
                    case 2:
                        message = `O atendimento do seu chamado depende da compra do material. Assim que estiver disponível, será programado para execução 😚`;
                        enviarDuvida = true;
                        break;
                }
            } else{
                switch(randomnumber){
                    case 0:
                        message = `Seu chamado está aguardando compra de material. Assim que o material estiver disponível, entrará na programação 🫡`;
                        enviarDuvida = true;
                        break;
                    case 1:
                        message = `Seu chamado está aguardando a aquisição do material. Assim que ele estiver disponível, será incluído na programação 😁`;
                        enviarDuvida = true;
                        break;
                    case 2:
                        message = `O atendimento do seu chamado depende da compra do material. Assim que estiver disponível, será programado para execução 😚`;
                        enviarDuvida = true;
                        break;
                }
            }
            break;
        case "41": //Impedimento - ferramenta
            message = `Seu chamado está aguardando algum de nossos recursos estar disponível para ser programado. Aguarde alguns dias e verifique novamente para uma atualização do status 😁`;
            enviarDuvida = true;
            break;
        case "42": //Impedimento - liberação
            message = `Tentamos executar o seu chamado, porém a área não foi liberada 🥺. Favor enviar e-mail para manserv@stihl.com.br com uma data onde a área estará disponível, com pelo menos uma semana de antecedência`;
            enviarDuvida = false;
            break;
        case "43": //Impedimento - material estoque
            message = `Seu chamado está aguardando reposição de material no estoque 🙂. Assim que o material estiver disponível, entrará na programação. A previsão máxima é de ${strDatePreview}`;
            enviarDuvida = true;
            break;
        case "44": //Parada programada
            message = `Recebemos a informação que seu chamado precisa ser executado durante a próxima parada de manutenção, e ele foi programado para esta data 😀. Caso essa informação esteja incorreta, favor informar através do e-mail manserv@stihl.com.br`;
            enviarDuvida = false;
            break;
        case "45": //Impedimento - verba
            message = `Para realizar seu chamado, precisamos de uma verba que o setor de Infraestrutura não possui no momento 🫤. No próximo mês, faremos uma nova avaliação de custos, portanto peço que consulte novamente seu chamado, tá bom? Caso seja algo muito importante para o setor, e vocês possuam a verba para disponibilizar, favor entrar em contato com o setor de Infraestrutura`;
            enviarDuvida = false;
            break;
        case "46": //Necessário serviço externo
            message = `Seu chamado necessitará de atendimento de uma empresa externa e está em processo de cotação e programação, conforme prioridades definidas pelo setor de Infraestrutura. A previsão máxima, até o momento, é de ${strDatePreview} 😉`;
            enviarDuvida = true;
            break;
        case "47": //Disponível para programar
            if(datePreview < dateToday){
                message = `Seu chamado foi definido como prioridade ${prioTxt} e tem o prazo de ${prazo}. Até o momento, a previsão máxima de execução é ${strDatePlusPrio} ☺️`;
                enviarDuvida = true;
                break;
            } else{
                message = `Seu chamado foi definido como prioridade ${prioTxt} e tem o prazo de ${prazo}. Até o momento, a previsão máxima de execução é ${strDatePreview} ☺️`;
                enviarDuvida = true;
                break;
            }
            break;
        case "48": //Aguardando orçamento
            message = `Vi aqui que seu chamado foi avaliado e está em processo de cotação, a requisição de compra deve ser criada logo mais. Sugiro que verifique novamente dentro de alguns dias para que eu possa te atualizar melhor 😉`;
            enviarDuvida = true;
            break;
        case "49": //Requisição criada
            switch(randomnumber){
                case 0:
                    message = `Já criamos a requisição de compra para poder atender seu chamado e estamos aguardando a entrega do material. Até o momento, a previsão é para ${strDatePreview} 😄`;
                    enviarDuvida = true;
                    break;
                case 1:
                    message = `A requisição de compra já foi criada para atender seu chamado e agora estamos aguardando a entrega do material. Até o momento, a previsão é para ${strDatePreview} 😊`;
                    enviarDuvida = true;
                    break;
                case 2:
                    message = `Seu chamado já tem uma requisição de compra em andamento e estamos esperando a entrega do material. Até o momento, a previsão é para ${strDatePreview} 🚀`;
                    enviarDuvida = true;
                    break;
            }
            break;
        case "50": //Programada
            switch(tipoServ){
                case "05": //Corretiva planejada
                    message = `Uhuu! Seu chamado está programado para o dia ${dataPrev} 🥰`;
                    enviarDuvida = true;
                    break;
                case "06": //ZU
                    message = `Uhuu! Seu chamado está programado para o dia ${dataPrev} 🥰`;
                    enviarDuvida = true;
                    break;
                case "07": //Melhoria
                    message = `Uhuu! Sua melhoria está programada para o dia ${dataPrev} 🥰`;
                    enviarDuvida = true;
                    break;
                case "10": //Avaliação
                    message = `Uhuu! Seu chamado está programado para ser avaliado no dia ${dataPrev} 🥰`;
                    enviarDuvida = true;
                    break;
            }
            break;
        case "55": //Em execução
            message = `Seu chamado está em execução 🫡`;
            enviarDuvida = true;
            break;
        case "77": //Executada
            message = `Trago ótimas notícias, seu chamado foi executado 🤗`;
            enviarDuvida = true;
            break;
        case "95": //Não concluída
            message = `Seu chamado está aguardando atualização de status, favor consultar novamente dentro de algumas horas`;
            enviarDuvida = true;
            break;
        case "96": //Cancelada
            message = `Seu chamado foi cancelado 😞`;
            enviarDuvida = true;
            break;
        case "97": //Reaberta
            message = `Seu chamado está aguardando atualização de status, favor consultar novamente dentro de algumas horas`;
            enviarDuvida = true;
            break;
        case "99": //Encerrada
            message = `Eba!! Seu chamado foi resolvido 🤩`;
            enviarDuvida = true;
            break;
    }

    const outputDate = dateFormat();
    document.querySelector('#chat-messages')
    .innerHTML += `<div class="incoming-chat response">
                    <p class="incoming-message">${message}</p>
                    </div>`;
    document.querySelector('#chat-messages')
    .innerHTML += `<div class="incoming-chat"></div>
                    <div class="incoming-chat response">
                    <p class="incoming-message">A Manserv possui atualmente a seguinte quantidade de chamados abertos:
                    <br>Prioridade Alta: ${quantAlta}
                    <br>Prioridade Média: ${quantMedia}
                    <br>Prioridade Baixa: ${quantBaixa}
                    <br>Parada Programada: ${quantParada}</p>
                    </div>`;
    if(enviarDuvida){
        document.querySelector('#chat-messages')
        .innerHTML += `<div class="incoming-chat"></div>
                        <div class="incoming-chat response">
                        <p class="incoming-message">${duvida}</p>
                        <span class="time">${outputDate}</span>
                        </div>`;
    }else{
        document.querySelector('.response')
        .innerHTML += `<span class="time">${outputDate}</span>`;
    }
    document.querySelector('.response').classList.remove('response');
    document.getElementById('chat-messages').scrollTop = document
    .getElementById('chat-messages').scrollHeight;
}

function dateFormat(){
    const date = new Date();
    const stringDate = date.toString();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    var day = stringDate.substring(8, 10);
    var month = stringDate.substring(4, 7);
    return `${hour}:${minutes} | ${day}/${month}`;
}

function addPriorityDays(date, priority){
    const daysToAdd = priorityDays[priority] || 0;
    const result = new Date(date);
    result.setDate(result.getDate() + daysToAdd);
    return result;
}

function parseDate(dmyString){
    const [day, month, year] = dmyString.split('/');
    return new Date(year, month - 1, day);
}

function dateToString(date){
    const stringDay = String(date.getDate()).padStart(2, '0');
    const stringMonth = String(date.getMonth() + 1).padStart(2, '0');
    const stringYear = date.getFullYear();
    const formatDate = `${stringDay}/${stringMonth}/${stringYear}`;
    return formatDate;
}