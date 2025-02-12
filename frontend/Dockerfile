# # build stage
# FROM node:22.8.0-alpine3.20 AS build-stage
# WORKDIR /app
# COPY package*.json .
# RUN npm install 
# COPY . .
# RUN npm run build

# Serve the build files with Nginx
FROM nginx:1.26.2-alpine3.20-otel

# Copy the build files to the Nginx directory
COPY dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a non-root user and group called app_user and app_group
RUN addgroup app_group && adduser -G app_group -S app_user
# -S: Creates a system user (non-login user).
# -G: Specifies the group name or number of the user's initial login group.

# Create cache directories and set permissions to app_user and app_group
RUN mkdir -p /var/cache/nginx /var/run && \
    chown -R app_user:app_group /var/cache/nginx /var/run /usr/share/nginx/html && \
    chmod 777 /var/cache/nginx /var/run /usr/share/nginx/html
# -R: Recursively change the ownership of the directories.
# -p: ensures no error is raised if the directory already exists.
# chmod: stands for change mode, and it controls who can read, write, or execute the file.
# chmod 777: gives read, write, and execute permissions to all users.

# Switch to the non-root user
USER app_user

# Expose port
EXPOSE 80

# Start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
