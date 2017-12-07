export AZURE_STORAGE_ACCOUNT=<account_name>
export AZURE_STORAGE_SHARE=<share-name>
export AZURE_STORAGE_LOCATION=<location>
export AZURE_STORAGE_RESOURCE_GROUP=<resource-group-name>

az storage account create \ 
  --location $AZURE_STORAGE_LOCATION \
  --name $AZURE_STORAGE_ACCOUNT \
  --resource-group $AZURE_STORAGE_RESOURCE_GROUP \ 
  --sku Standard_RAGRS

export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string --name $AZURE_STORAGE_ACCOUNT --resource-group $AZURE_STORAGE_RESOURCE_GROUP`

az storage share create --name $AZURE_STORAGE_SHARE
az storage file upload --share-name $AZURE_STORAGE_SHARE --source ./volume/status.txt

echo done!

