#  creating a data volume at the path "/var/lib/mysql" inside the container. 
if [[ ! "$(docker ps -aq -f name=maria_vol)" ]]; then
    # Create the container if it doesn't exist
    docker create -it -v /var/lib/mysql --name maria_vol busybox
else
    echo "Container 'maria_vol' already exists..!! :)"
fi


if [[ ! "$(docker ps -aq -f name=mymariadb)" ]]; then
    # Create the container if it doesn't exist
    docker run --name mymariadb -d -p 3306:3306 --volumes-from maria_vol -v $(pwd)/sql:/docker-entrypoint-initdb.d --restart=always -e MYSQL_ROOT_PASSWORD=root mariadb
else
    echo "Container 'mymariadb' already exists."
fi

docker ps
