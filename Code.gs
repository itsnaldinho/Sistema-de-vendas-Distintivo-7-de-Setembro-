// Substitua pela ID da pasta no seu Google Drive onde os comprovantes serão salvos
const FOLDER_ID = '1DTh0UXd2jqIAlIej7maZsvp0Of7DJsCu'; 
const ADMIN_EMAIL = "silva.patrickdasilva.patrick@gmail.com , patrick.silva@escoteiros.org.br ";

// Credenciais de acesso ao Painel Admin
const ADMIN_USER = 'patrick';
const ADMIN_PASS = '115tiradentes';

// Informações de contato exibidas no rodapé do painel admin
const CONTATO_NOME = 'Patrick Silva';
const CONTATO_TELEFONE = '38 9914-1153';
const CONTATO_DISTRITO = 'DNM - Distrito Norte Minas';

function doGet(e) {
  // Se o parâmetro "page" for "admin", abre o painel. Senão, abre o formulário padrão.
  if (e.parameter.page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('admin')
      .setTitle('Admin - Distintivos 07 de Setembro')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Pedido - Distintivo 07 de Setembro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Verifica login do painel admin (roda no servidor, senha nunca chega ao navegador)
function checkAdminLogin(user, pass) {
  return (user === ADMIN_USER && pass === ADMIN_PASS);
}

// Retorna as informações de contato para exibir no rodapé do admin
function getContatoInfo() {
  return {
    nome: CONTATO_NOME,
    telefone: CONTATO_TELEFONE,
    distrito: CONTATO_DISTRITO
  };
}


// Descobre a extensão correta do arquivo a partir do mimetype real
function getExtensionFromMime(mime) {
  const map = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
  };
  return map[mime] || 'dat';
}

// ===== TEMPLATES DE E-MAIL (HTML com estilo inline p/ compatibilidade com Gmail/Outlook) =====

const COR_AZUL = '#0033A0';
const COR_VERDE = '#00853F';
const COR_AMARELO = '#FFDF00';
const BADGE_IMG = 'https://i.postimg.cc/bJHhjD02/distintivo.jpg';

function emailWrapper(tituloTopo, conteudoInterno) {
  let html = '';
  html += '<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f4f8; padding: 24px 0;">';
  html += '  <div style="background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">';
  html += '    <div style="background: linear-gradient(135deg, ' + COR_AZUL + ', #0052cc); padding: 28px 24px; text-align: center;">';
  html += '      <img src="' + BADGE_IMG + '" alt="Distintivo 07 de Setembro" style="width: 110px; border-radius: 10px; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.25); margin-bottom: 12px;">';
  html += '      <div style="color: ' + COR_AMARELO + '; font-size: 20px; font-weight: 700;">' + tituloTopo + '</div>';
  html += '    </div>';
  html += '    <div style="padding: 28px 26px; color: #333333; font-size: 14px; line-height: 1.6;">';
  html +=        conteudoInterno;
  html += '    </div>';
  html += '    <div style="background-color: #f7f9fc; padding: 20px 26px; text-align: center;">';
  html += '      <div style="font-size: 12px; color: #888888; margin-bottom: 14px;">DNM &bull; Distrito Norte Minas &bull; Desfile Cívico 07 de Setembro</div>';
  html += '      <div style="border-top: 1px solid #e2e6ec; padding-top: 14px;">';
  html += '        <div style="font-size: 13px; font-weight: 700; color: #333333;">Patrick Silva</div>';
  html += '        <div style="font-size: 12px; color: #666666; margin-top: 2px;">patrick.silva@escoteiros.org.br</div>';
  html += '        <div style="font-size: 12px; color: #666666; margin-top: 2px;">38 9914-1153</div>';
  html += '      </div>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';
  return html;
}

function linhaResumo(label, valor) {
  return '<tr>' +
    '<td style="padding: 8px 0; color: #666666; font-size: 13px; width: 45%;">' + label + '</td>' +
    '<td style="padding: 8px 0; color: #222222; font-size: 14px; font-weight: 600;">' + valor + '</td>' +
    '</tr>';
}

function buildUserEmailHtml(data, enderecoResumo) {
  let conteudo = '';
  conteudo += '<p style="font-size: 16px; margin: 0 0 4px 0;">Olá, <strong>' + data.nome + '</strong>! Sempre Alerta! 🏕️</p>';
  conteudo += '<p style="margin: 0 0 20px 0;">Recebemos o seu pedido do Distintivo do Desfile Cívico de 07 de Setembro.</p>';

  conteudo += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafc; border-radius: 10px; padding: 16px 18px; margin-bottom: 18px;">';
  conteudo += linhaResumo('Quantidade', data.quantidade + ' distintivo(s)');
  conteudo += linhaResumo('Valor Total Pago', 'R$ ' + data.valorTotal.toFixed(2).replace('.', ','));
  conteudo += linhaResumo('Forma de Entrega', data.entrega === 'correios' ? 'Correios' : 'Retirada');
  conteudo += linhaResumo('Endereço', enderecoResumo);
  conteudo += '</table>';

  conteudo += '<div style="background-color: #fdfbf7; border: 1px dashed ' + COR_AMARELO + '; border-radius: 10px; padding: 14px 16px; margin-bottom: 18px;">';
  conteudo += '  <strong style="color: ' + COR_VERDE + ';">📦 Prazos de Envio</strong><br>';
  conteudo += '  <span style="font-size: 13px;">• Pedidos até <strong>15/08</strong> → envio em <strong>31/08</strong><br>';
  conteudo += '  • Pedidos até <strong>01/09</strong> → envio em <strong>15/09</strong></span>';
  conteudo += '</div>';

  conteudo += '<p style="margin: 0;">Obrigado por fortalecer o nosso Distrito! 💙💚</p>';

  return emailWrapper('Pedido Confirmado', conteudo);
}

function buildAdminEmailHtml(data, fileUrl, enderecoResumo, adminUrl) {
  let conteudo = '';
  conteudo += '<p style="margin: 0 0 16px 0;">Um novo pedido foi realizado. <strong>Verifique se o valor do PIX confere com o pedido.</strong></p>';

  conteudo += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafc; border-radius: 10px; padding: 16px 18px; margin-bottom: 18px;">';
  conteudo += linhaResumo('Nome', data.nome);
  conteudo += linhaResumo('E-mail', data.email);
  conteudo += linhaResumo('Telefone', data.telefone);
  conteudo += linhaResumo('Distrito', data.distrito);
  conteudo += linhaResumo('Grupo', data.grupo);
  conteudo += linhaResumo('Cidade', data.cidade || 'Montes Claros (Retirada)');
  conteudo += linhaResumo('Quantidade', data.quantidade);
  conteudo += linhaResumo('Valor Declarado', 'R$ ' + data.valorTotal.toFixed(2).replace('.', ','));
  conteudo += linhaResumo('Entrega', data.entrega === 'correios' ? 'Correios' : 'Retirada');
  conteudo += linhaResumo('Endereço', enderecoResumo);
  conteudo += '</table>';

  conteudo += '<div style="text-align: center; margin: 20px 0;">';
  conteudo += '  <a href="' + fileUrl + '" style="display: inline-block; background-color: ' + COR_AZUL + '; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; margin: 4px;">📎 Ver Comprovante</a>';
  conteudo += '  <a href="' + adminUrl + '" style="display: inline-block; background-color: ' + COR_VERDE + '; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; margin: 4px;">📋 Abrir Painel Admin</a>';
  conteudo += '</div>';

  return emailWrapper('Novo Pedido Recebido', conteudo);
}

// ===== FIM DOS TEMPLATES =====

function processForm(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Processa o arquivo do comprovante (agora com a extensão correta)
    const ext = getExtensionFromMime(data.fileMimeType);
    const fileBlob = Utilities.newBlob(
      Utilities.base64Decode(data.fileData), 
      data.fileMimeType, 
      "Comprovante_" + data.nome + "_" + data.telefone + "." + ext
    );
    const file = folder.createFile(fileBlob);
    const fileUrl = file.getUrl();

    // Registra na Planilha
    // Colunas: A Data | B Nome | C Email | D Telefone | E Distrito | F Grupo | G Entrega
    // H CEP | I Endereco | J Numero | K Complemento | L Bairro | M Cidade | N Estado
    // O Quantidade | P ValorTotal | Q Comprovante | R Status
    const rowData = [
      new Date(), // Carimbo de tempo
      data.nome,
      data.email,
      data.telefone,
      data.distrito,
      data.grupo,
      data.entrega,
      data.cep || '-',
      data.endereco || '-',
      data.numero || '-',
      data.complemento || '-',
      data.bairro || '-',
      data.cidade || '-',
      data.estado || '-',
      data.quantidade,
      data.valorTotal,
      fileUrl,
      "Pendente" // Status inicial para o Admin
    ];
    sheet.appendRow(rowData);

    // Monta o resumo do endereço
    const enderecoResumo = data.entrega === 'correios'
      ? (data.endereco + ', ' + data.numero + ' - ' + data.bairro + ', ' + data.cidade + '/' + data.estado + ' - CEP ' + data.cep)
      : 'Retirada: Rua Geraldinho Machado, 1245 - Santos Reis, Montes Claros/MG';

    // URL do painel admin, gerada automaticamente a partir do deploy atual
    const adminUrl = ScriptApp.getService().getUrl() + '?page=admin';

    // E-mail para o Solicitante
    MailApp.sendEmail({
      to: data.email,
      subject: "Confirmação de Pedido - Distintivo 07 de Setembro",
      htmlBody: buildUserEmailHtml(data, enderecoResumo),
      attachments: [fileBlob]
    });

    // E-mail para o Admin
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: "Novo Pedido: " + data.nome + " - R$ " + data.valorTotal.toFixed(2),
      htmlBody: buildAdminEmailHtml(data, fileUrl, enderecoResumo, adminUrl),
      attachments: [fileBlob]
    });

    return "Sucesso";
  } catch (error) {
    return "Erro: " + error.toString();
  }
}

// Função para buscar dados para a página do Admin
function getAdminData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // remove o cabeçalho sem alterar 'data'

  return rows.map((row, i) => ({
    rowIndex: i + 2, // número real da linha na planilha (linha 1 é cabeçalho)
    data: Utilities.formatDate(row[0], Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
    nome: row[1],
    email: row[2],
    telefone: row[3],
    distrito: row[4],
    grupo: row[5],
    entrega: row[6],
    cidade: row[12] !== '-' ? row[12] : 'Montes Claros (Retirada)',
    quantidade: row[14],
    valor: row[15],
    comprovante: row[16],
    status: row[17]
  }));
}

// Atualiza o status de um pedido (usado pelo botão "Confirmar Pix" no Admin)
function updateStatus(rowIndex, novoStatus) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange(rowIndex, 18).setValue(novoStatus); // coluna R = status
    return "OK";
  } catch (error) {
    return "Erro: " + error.toString();
  }
}
