# Documentação do Projeto: Farmácia Central

Este projeto consiste em um ecossistema completo para uma farmácia, integrando uma plataforma web para cadastro de clientes, um aplicativo móvel para visualização de ofertas e um servidor backend que gerencia os dados.

## 1. Objetivo do Projeto
O sistema visa fidelizar clientes através de um modelo onde o usuário se cadastra via site para obter o status de "Cliente Fidelidade". Ao acessar o aplicativo móvel, esse cliente tem acesso a descontos exclusivos nos produtos da farmácia.

---

## 2. Arquitetura do Sistema

O projeto é dividido em quatro partes principais:

### A. Banco de Dados (MySQL)
Armazena as informações estruturadas do sistema.
- **Tabela `usuarios`**: Guarda nome, e-mail, senha (criptografada) e o status `recebe_promocao`.
- **Tabela `produtos`**: Guarda a lista de itens, descrições, preços normais e preços com desconto.

### B. Backend (Servidor Node.js)
Atua como a ponte entre o banco de dados e as interfaces (Web e App).
- **Tecnologias**: Express, MySQL2, CORS, BcryptJS.
- **Rotas**:
    - `POST /cadastrar`: Recebe os dados do site, criptografa a senha e salva o usuário com o benefício de promoção ativo.
    - `POST /login`: Valida as credenciais do usuário para acesso ao App.
    - `GET /produtos`: Retorna a lista de produtos cadastrados.

### C. Frontend Web (React)
Portal de entrada para novos clientes.
- **Tecnologia**: React + Vite.
- **Função**: Formulário de cadastro simples. Ao se cadastrar por aqui, o sistema automaticamente marca o usuário para receber descontos especiais.

### D. Mobile App (React Native / Expo)
Interface de uso do cliente no dia a dia.
- **Tecnologia**: React Native, Axios.
- **Função**:
    - Tela de Login para autenticação.
    - Vitrine de produtos que identifica se o usuário é "VIP" (Fidelidade).
    - Exibição dinâmica de preços: se o usuário for VIP, mostra o preço com desconto; caso contrário, mostra o preço normal.

---

## 3. Integração e Fluxo de Dados

O diagrama abaixo exemplifica como os componentes conversam:

```text
[ SITE (React) ]  ---(Cadastro)---> [ BACKEND (Node.js) ] <---> [ BANCO (MySQL) ]
                                            ^
                                            |
                                       (Login/Dados)
                                            |
                                    [ APP (React Native) ]
```

1. **Cadastro**: O cliente acessa o site (`webvers`) e realiza seu cadastro.
2. **Armazenamento**: O servidor (`servi`) recebe os dados, gera um hash da senha para segurança e insere no banco MySQL.
3. **Autenticação**: O cliente abre o aplicativo (`mobvers`) e faz login.
4. **Experiência Personalizada**: O App consulta o servidor, que retorna os dados do usuário e a lista de produtos. Se o campo `recebe_promocao` for verdadeiro, o App renderiza os componentes de "Preço VIP" na cor verde.

---

## 4. Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Linguagem** | JavaScript (Node.js / React) |
| **Banco de Dados** | MySQL (XAMPP/WAMP) |
| **Backend** | Express.js |
| **Frontend Web** | React.js |
| **Mobile** | React Native (Expo) |
| **Segurança** | Bcrypt (Criptografia de senhas) |

---

## 5. Como Executar o Projeto

### Pré-requisitos
- Node.js instalado.
- XAMPP ou MySQL Server rodando.
- Expo Go instalado no celular (para o App).

### Passo 1: Banco de Dados
1. Importe o arquivo `database.sql` no seu MySQL (via phpMyAdmin ou terminal).

### Passo 2: Servidor (Backend)
1. Entre na pasta `farm/servi`.
2. Execute `npm install` para instalar as dependências.
3. Execute `node index.js` para iniciar o servidor na porta 3000.

### Passo 3: Site (Web)
1. Entre na pasta `farm/webvers`.
2. Execute `npm install`.
3. Execute `npm run dev`.

### Passo 4: Aplicativo (Mobile)
1. Entre na pasta `farm/mobvers`.
2. Execute `npm install`.
3. Certifique-se de alterar o IP no arquivo `App.js` para o IP da sua máquina local.
4. Execute `npx expo start`.

---

**Desenvolvido para fins acadêmicos.**
