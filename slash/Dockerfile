FROM python:3.9
WORKDIR /opt/tritan-slash
COPY . .
RUN pip install -r requirements.txt --user --no-warn-script-location
CMD ["slash.py"]
ENTRYPOINT ["python3"]
