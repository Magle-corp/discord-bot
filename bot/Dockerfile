FROM node:16-alpine

# Set working directory.
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH.
ENV PATH /app/node_modules/.bin:$PATH

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Docker wait and build app.
CMD /wait && npm i && npx sequelize db:migrate && node index.js