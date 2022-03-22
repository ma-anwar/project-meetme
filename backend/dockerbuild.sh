#/bin/bash
sudo docker build -t manwar01/meetme-backend:latest . -f Dockerfile.prod
if [ $? -eq 0 ]; then
    sudo docker push manwar01/meetme-backend:latest
else
    echo Build failed
fi
