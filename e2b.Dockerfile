FROM e2bdev/base:latest

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /home/user/project

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "run", "dev"]