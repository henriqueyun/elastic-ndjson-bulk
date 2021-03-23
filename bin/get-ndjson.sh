if [[ $1 == "" ]]
then
  echo "Insira o nome do arquivo!"
  exit
fi
cat $1.json | jq -c '.[]' > $1.ndjson
