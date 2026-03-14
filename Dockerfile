# 1. Base da imagem - Node.js
FROM node:20-alpine

# 2. Criar diretório de trabalho
WORKDIR /usr/src/app

# 3. Copiar arquivos de dependências
# Copiamos o prisma/ para garantir que o cliente seja gerado no build
COPY package*.json ./
COPY ./prisma ./prisma/

# 4. Instalar dependências
RUN npm install

# 5. Copiar o restante do código
COPY . .

# 6. Gerar o Prisma Client (essencial para o TypeScript reconhecer o banco)
RUN npx prisma generate

# 7. Build do NestJS
RUN npm run build

# 8. Expor a porta que o NestJS usa (padrão 3000)
EXPOSE 3000

# 9. Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]