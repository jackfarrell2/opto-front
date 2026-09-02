#!/bin/bash
SERVER=optofront
set -e
if [[ -z "$SERVER" ]]
then
    echo "ERROR: No value set for SERVER."
    exit 1
fi

echo -e "\n>>> Copying files to the server."
ssh root@$SERVER "rm -rf /root/opto"
ssh root@$SERVER "mkdir opto"
scp -r build/* root@$SERVER:/root/opto
echo -e "\nCopied files to the server"


ssh root@$SERVER /bin/bash << EOF

echo -e "\n>>> Deleting old files"
rm -rf /app/opto

echo -e "\n>>> Copying new files"
cp -r /root/opto /app/opto


EOF


echo -e "\n>>> Finished installing React project on server."