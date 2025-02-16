# 👨‍💻 CRUD de Usuários (com alto teor de tecnologia)

![NodeJS logo](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

![Jest logo](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

![Postgres logo](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)

![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

<img  src=".github/readme/thumbnail.png"  alt="Documentação da aplicação em Swagger">

> CRUD simples de usuários, porém com um alto teor de tecnologia. Empregando conhecimentos sobre Redis, buckets S3, testes unitários, Docker e outros.

## 💻 Pré-requisitos

Antes de começar, verifique se você atende aos seguintes requisitos:

- 🐋 Docker

- 🚪 Portas: 3000 (api), 3001 (web), 5450 (postgres),9000 e 9001 (minio), 1025 e 8025 (mailhog) disponíveis.

## 🚀 Instalando

### 🧰 Variáveis de ambiente

O formato das variáveis de ambiente encontra-se no arquivo `.env.copy`.

| Variável | Definição |

| --------------------- | --------------------------------------------------------------- |

| PORT | Porta a qual esta API ira rodar. |

| DATABASE_URL | URL de conexão com banco de dados Postgres. |

| SECRET | Segredo para o hash do token JWT. |

| SERVER_URL | URL onde esta API está sendo executada. |

| WEB_URL | URL onde o front-end que consome esta API esta sendo executado. |

| AWS_BUCKET_NAME | Bucket onde os arquivos de imagem serao salvos. |

| AWS_REGION | Regiao do S3. |

| AWS_ACCESS_KEY_ID | Chave de acesso ao bucket S3. |

| AWS_SECRET_ACCESS_KEY | Segredo de acesso ao bucket S3. |

| AWS_ENDPOINT | Local de acesso ao bucket S3. |

| AWS_ENDPOINT_S3 | Local de acesso ao bucket S3 (domínio interno do Docker). |

| MAIL_FROM | Dominio de e-mail da API que enviar'á demais e-mails. |

| MAIL_HOST | Host do provedor de envio de e-mails. |

| MAIL_PORT | Porta do provedor de envio de e-mails. |

| MAIL_USER | Usuario de acesso do provedor de e-mails. |

| MAIL_PASS | Senha de acesso do provedor de e-mails. |

| REDIS_URL | URL de conexao com banco de dados Redis |

Apesar de não ser uma boa prática deixar estas informações públicas, por tratar-se de uma API de desenvolvimento e que não envolve dados reais, fique livre para copiar o arquivo `.env` abaixo:

```
SECRET=secret
DATABASE_URL=postgres://postgres:postgres@localhost:5450/going2db
PORT=3000
SERVER_URL=http://localhost:3000
WEB_URL=http://localhost:3001

# Estou utilizando o MinIO como emulador do Bucket S3.
AWS_BUCKET_NAME=g2bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=going2minio
AWS_SECRET_ACCESS_KEY=going2minio
AWS_ENDPOINT=http://localhost:9000
AWS_ENDPOINT_S3=http://localhost:9000 # Variábel reescrita no docker-compose.yml

# Estou utilizando o MailHog como emulador de servidor de e-mails.
MAIL_FROM=logoipsum@no-reply.com
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=dummyUser # Padrão do MailHog
MAIL_PASS=dummyPass # Padrão do MailHog

REDIS_URL=localhost
```

### 🐳 Docker

Para começar é necessário inicializar todas as instâncias Docker da aplicação, para isso existe um atalho no `package.json`, então basta executar:

```

npm run docker:build

```

Ao executer este comando, os seguintes containers serão inicializados:

| Container | Definição |

| --------- | ---------------------------------------------------------- |

| API | Container da aplicação Node.JS (API). |

| Postgres | Container de banco de dados. |

| MinIO | Container emulador de bucket S3. |

| MinIO/MC | Container para utilizar o CLI do MinIO para criar buckets. |

| MailHog | Container emulador de servi'ço de e-mail. |

| Redis | Container de banco de dados (cache). |

⚠️ **Importante**: Em determinados momentos, a aplicação Node.JS fará upload de arquivos e envio de e-mails. Para não utilizar de serviços reais utilizei de serviços locais de emulação. **Sendo assim**, quando um e-mail for enviado, a caixa de entrada estará localizada no host `http://localhost:8025`, enquanto os arquivos no bucket s3 local `http://localhost:9001` (onde login e senha são o mesmo valor: going2minio).

### 🎲 Banco de Dados

#### 🌱 Seeds

Para facilitar a vida de todos nós, já criei uma `seed` que insere três usuários no banco de dados prontos para acesso no front-end.

Dessa forma, basta rodar o comando `npm run migration:seed` e ele irá gerar os três usuários no banco:

| E-mail          | Senha de acesso    | Permissão |
| --------------- | ------------------ | --------- |
| admin@admin.com | my-secret-password | ADMIN     |
| man@man.com     | my-secret-password | MANAGER   |
| std@std.com     | my-secret-password | STANDARD  |

#### ⚡️ Acesso

Para acessar o banco de dados você deve utilizar as seguintes credenciais:

| Credencial | Valor     |
| ---------- | --------- |
| Host       | localhost |
| Porta      | 5450      |
| Usuário    | postgres  |
| Senha      | postgres  |
| Banco      | going2db  |

Eu alterei a porta padrão do banco para 5450 para evitar conflitos locais com outros bancos de dados Postgres rodando.

## 📕 Documentação

Pode ficar tranquilo! Toda a documentação da aplicação foi feita utilizando o Swagger e estará disponível na rota `/docs` (`http://localhost:3000/docs`) e poderá ser importado ao seu Postman, Insomnia, Bruno ou outros.
