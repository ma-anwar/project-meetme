#/bin/bash
sudo docker build -t manwar01/meetme-backend:latest . -f Dockerfile.prod
if [ $? -eq 0 ]; then
    sudo docker push manwar01/meetme-backend:latest
    curl -H "Authorization: Bearer SecretSecretIGottaKeepIt" https://manwar.dev/v1/update
else
    echo Build failed
fi
