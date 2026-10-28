# Etapa 1: Construcción de la App
FROM node:20-alpine as build
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos la carpeta dist
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx ultra ligero
FROM nginx:alpine
# Borramos la web por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos la carpeta dist que se acaba de generar en la "Etapa 1"
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos la configuración del proxy/caché
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
