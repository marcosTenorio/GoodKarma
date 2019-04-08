export the following:
    
    export DATABASE_USER=admin
    export DATABASE_PASSWORD=admin
    export DATABASE_HOST=localhost
    export DATABASE_PORT=5432
    export DATABASE_DB=gkarmaDB
    export AUTH_SECRET=secret


    sudo docker run --name GoodKarma -p "$DATABASE_PORT":"$DATABASE_PORT" -e POSTGRES_PASSWORD="$DATABASE_PASSWORD" -e POSTGRES_USER="$DATABASE_USER" -e POSTGRES_DB="$DATABASE_DB" -d postgres:9.5




teste RegianeLinda