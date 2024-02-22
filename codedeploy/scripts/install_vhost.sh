#!/bin/bash

FILENAME=cms.conf
SERVER_NAME=cms.staging.myskillmaster.com
SERVER_LOGS=cmsstaging

if [[ "$DEPLOYMENT_GROUP_NAME" == *-dev-asg ]]
then
    # this only executes when only in development asg
    SERVER_NAME=cms.myskillmaster.appetiserdev.tech
    SERVER_LOGS=cmsdevelopment
elif [[ "$DEPLOYMENT_GROUP_NAME" == *-prod-asg ]]
then
    # this only executes when only in production asg
    SERVER_NAME=cms.myskillmaster.com
    SERVER_LOGS=cmsproduction
fi


cp /var/www/cms/codedeploy/nginx/vhost.conf /etc/nginx/sites-available/$FILENAME

ln -sf /etc/nginx/sites-available/$FILENAME /etc/nginx/sites-enabled/$FILENAME

sed -i -e "s/{{SERVER_NAME}}/$SERVER_NAME/g" /etc/nginx/sites-available/$FILENAME

sed -i -e "s/{{SERVER_LOGS}}/$SERVER_LOGS/g" /etc/nginx/sites-available/$FILENAME

mkdir -p /var/log/nginx/${SERVER_LOGS}/
