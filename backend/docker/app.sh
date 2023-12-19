#!/bin/bash

alembic upgrade head

gunicorn app.main:app --log-level debug --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind=0.0.0.0:8000