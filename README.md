# Wedding Planner API

Backend de uma aplicação de planejamento de casamentos, desenvolvido com [NestJS](https://nestjs.com/) e TypeScript.

## Sobre o projeto

Esta API fornece os recursos necessários para gerenciar todas as etapas do planejamento de um casamento. O sistema foi pensado para oferecer uma experiência centralizada, permitindo que os noivos organizem e acompanhem cada detalhe do grande dia.

### Funcionalidades

- **Casamento** — cadastro e gerenciamento das informações gerais do evento
- **Convidados** — controle da lista de convidados e confirmações de presença
- **Fornecedores** — cadastro e acompanhamento de prestadores de serviço
- **Presentes** — lista de presentes com suporte a contribuições
- **Orçamento** — controle financeiro por categorias e itens de despesa
- **Checklist** — tarefas organizadas por período para não perder nenhum prazo
- **Lua de mel** — planejamento da viagem pós-casamento
- **Mídia** — upload e gerenciamento de arquivos e imagens

## Tecnologias

- [NestJS](https://nestjs.com/) — framework Node.js para aplicações server-side
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- Autenticação via JWT

## Instalação

```bash
npm install
```

## Executando o projeto

```bash
# modo desenvolvimento
npm run start:dev

# modo produção
npm run start:prod
```

## Testes

```bash
# testes unitários
npm run test

# cobertura de testes
npm run test:cov
```

## Licença

Projeto de uso privado.
