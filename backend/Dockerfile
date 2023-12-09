FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

RUN mkdir /backend

WORKDIR /backend

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod a+x docker/*.sh

