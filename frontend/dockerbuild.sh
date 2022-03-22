#/bin/bash
sudo docker build -t manwar01/meetme-frontend:latest .
if [ $? -eq 0 ]; then
    sudo docker push manwar01/meetme-frontend:latest
else
    echo Build failed
fi
