#/bin/bash
sudo docker build -t manwar01/meetme-frontend:latest .
if [ $? -eq 0 ]; then
    sudo docker push manwar01/meetme-frontend:latest
    curl -H "Authorization: Bearer SecretSecretIGottaKeepIt" https://manwar.dev/v1/update
else
    echo Build failed
fi
