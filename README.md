# Sistema de Vendas Nacional (E-commerce via Google Apps Script)

Um sistema completo, leve e gratuito desenvolvido em Google Apps Script (HTML, CSS, JS e Google Sheets) para a venda de itens em larga escala (nível nacional), como camisas, distintivos, lenços, etc[cite: 3]. 

O sistema conta com um frontend de pedidos para o cliente final e um painel administrativo seguro para a diretoria gerenciar o status das vendas, baixar comprovantes de pagamento e visualizar métricas de arrecadação[cite: 3].

## 🌟 Detalhes e Benefícios

* **Custo Zero de Hospedagem:** Todo o sistema roda na infraestrutura do Google (Sheets, Drive e Apps Script), dispensando servidores pagos[cite: 3].
* **Painel Administrativo com Login:** Gestão centralizada dos pedidos (`?page=admin`) protegida por usuário e senha, permitindo aprovar ou cancelar envios, visualizar comprovantes PIX e acompanhar métricas (total vendido, arrecadado, pendentes)[cite: 3].
* **Cálculo de Frete e ViaCEP:** O formulário calcula automaticamente o valor total com base na quantidade e na opção de entrega (Retirada grátis ou Correios). O endereço é preenchido automaticamente ao digitar o CEP[cite: 3].
* **Upload Direto para o Drive:** Os comprovantes de pagamento anexados pelos compradores são salvos organizadamente em uma pasta específica do Google Drive com o nome do cliente[cite: 3].
* **Notificações Automatizadas:** O sistema envia e-mails transacionais (com design em HTML) tanto para o comprador (recibo do pedido) quanto para a diretoria (aviso de nova venda)[cite: 3].

---

## 🚀 Pré-work (Como colocar o código em funcionamento)

Para ativar este sistema do zero, siga os passos abaixo no seu ambiente Google:

### 1. Criar a Pasta de Comprovantes (Google Drive)
1. Crie uma pasta no seu Google Drive onde os comprovantes de PIX serão armazenados.
2. Compartilhe a pasta com a permissão "Qualquer pessoa com o link pode editar" (necessário para o script salvar arquivos lá).
3. Copie o **ID da pasta** (o código alfanumérico que aparece na URL após `/folders/`).

### 2. Criar o Banco de Dados (Google Sheets)
1. Crie uma nova Planilha no Google Sheets.
2. Na aba principal (Página 1), crie o seguinte cabeçalho (linha 1), coluna por coluna (de A a R):
   `Data`, `Nome`, `Email`, `Telefone`, `Distrito`, `Grupo`, `Entrega`, `CEP`, `Endereco`, `Numero`, `Complemento`, `Bairro`, `Cidade`, `Estado`, `Quantidade`, `ValorTotal`, `Comprovante`, `Status`[cite: 3].

### 3. Configurar o Google Apps Script
1. Na sua planilha, vá em **Extensões > Apps Script**.
2. Crie três arquivos no editor:
   * `Code.gs` (Arquivo de Script)[cite: 3]
   * `Index.html` (Arquivo HTML do formulário)[cite: 3]
   * `admin.html` (Arquivo HTML do painel da diretoria)[cite: 3]
3. Cole os respectivos códigos fornecidos no repositório.

### 4. Deploy (Implantação)
1. Clique em **Implantar > Nova implantação**.
2. Selecione o tipo **App da Web** (ícone de engrenagem).
3. Defina "Executar como: **Eu**" e "Quem pode acessar: **Qualquer pessoa**"[cite: 3].
4. Autorize as permissões do Google. Copie a URL do Web App gerada.

---

## 🛠️ Customização: Implementando em um Novo Ambiente

Para usar o sistema para vender outros itens (ex: Camisas) em outro contexto, você precisa modificar os seguintes parâmetros no código:

### No arquivo `Code.gs` (Backend):
* **Configurações Iniciais:**
  * `FOLDER_ID`: Substitua pelo ID da nova pasta do Google Drive[cite: 3].
  * `ADMIN_EMAIL`: Coloque o e-mail (ou e-mails separados por vírgula) de quem receberá as notificações de novas vendas[cite: 3].
  * `ADMIN_USER` e `ADMIN_PASS`: Defina o login e senha de acesso ao painel admin[cite: 3].
  * `CONTATO_NOME`, `CONTATO_TELEFONE`, `CONTATO_DISTRITO`: Atualize com os dados do responsável pela nova venda (aparece no rodapé dos e-mails e painel)[cite: 3].
* **Identidade Visual (E-mails):**
  * Atualize as cores nas variáveis `COR_AZUL`, `COR_VERDE`, `COR_AMARELO`[cite: 3].
  * Substitua o link da imagem em `BADGE_IMG` pela foto do novo produto[cite: 3].
* **Textos de E-mail:** Modifique o assunto e o corpo dos e-mails nas funções `buildUserEmailHtml` e `buildAdminEmailHtml` (ex: prazos de envio, mensagem de agradecimento)[cite: 3].

### No arquivo `Index.html` (Frontend / Loja):
* **Identidade Visual:** Altere as variáveis de cor no bloco `:root` no CSS (`--azul-escoteiro`, etc) e substitua a logo do produto na tag `<img src="..." alt="Distintivo 07 de Setembro" class="badge-img">`[cite: 3].
* **Informações do Produto e Valores:** 
  * Procure pelas tags de título `<h2>` e textos de prazos no HTML e altere para as informações do novo item[cite: 3].
  * **MUITO IMPORTANTE:** No Javascript, encontre a função `calculateTotal()`. Altere a lógica matemática de preços. Atualmente, multiplica a quantidade por `5.00` e soma `23.00` se a entrega for "correios"[cite: 3].
* **Dados de Pagamento (PIX):** Atualize o bloco `<div class="pix-area">`. Troque o link da imagem do QR Code (`<img src="..." class="qr-code">`) e o texto da "Chave PIX (UUID)"[cite: 3].
* **Local de Retirada:** Atualize o endereço de retirada no bloco `<div id="retiradaInfo"...>`[cite: 3].

### Como acessar o Painel Admin:
Basta pegar a URL pública do seu Web App (gerada no momento do Deploy) e adicionar `?page=admin` no final do link[cite: 3]. Exemplo: `https://script.google.com/macros/s/SEU_ID_AQUI/exec?page=admin`
