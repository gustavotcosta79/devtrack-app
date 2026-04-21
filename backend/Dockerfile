# usa a "image" oficial do Python, com o python 3.12 como a base da "image"
FROM python:3.12-slim

# definir a pasta de trabalho dentro do container
WORKDIR /app

# copiar o ficheiro de requirements.txt do diretório local
COPY requirements.txt .

# Instalar as dependências do python especificadas no nosso ficheiro requirements.txt
# no-cache-dir -> é para não guardarmos as depedências instaladas na memória cache, obrigando assim a fazer download das depedências
# sempre que se corre o container
RUN pip install --no-cache-dir -r requirements.txt

# copia o diretório do backend inteiro do diretório local para o /app do container
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app","--host", "0.0.0.0", "--port","8000"]
