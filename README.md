# Projeto - SIG
## O que somos?
### Este repositório hospeda o código que pe capaz de :
### Camadas:

* Municipios

* Meso-regiões

* Rodovias

* Rios

* Policia rodoviária estadual

* Dados Universidades

* Usinas de Etanol

* OSM (Open Street Maps)

 

### Arquitetura:

        Openlayers (ou outro preferido) + Geoserver 
        PostGrees + PostGis
        JavaScrip + Html + Css


### Funcionalidades:

* Overlay de camadas

* Zooming e panning

* Information (tooltip)

 

### Consultas

* 1 Usando buffer

* 3 consultas com
* operadores topológicos

* 1 consulta métrica

# Tecnologias

* PgAdmin
* PostGrees + PostGis
* Geoserver
* JavaScrip + Html + Css
* npm


## Baixa o geoserver
http://sourceforge.net/projects/geoserver/files/GeoServer/2.19.0/geoserver-2.19.0-bin.zip

## Descompacta os arquivos do geoserver
Após isso, descompacta o arquivo cite.tar e coloca a pasta dentro do Geoserver, no caminho:

/data_dir/workspaces

## Inicia o geoserver
./bin/startup.sh

## Baixar ShapeFiles
https://drive.google.com/file/d/1xKsnDMj1EQEcDRV8hTE8lsrdYxAxiJk2/view

## Criar as Tabelas
Existe duas opções para a criação das tabelas 
1 - Atraves do Postgis com arquivo .shp
2-  Atraves do PostGist com os arquivos .sql

## Inicia o projeto
npm install
npm start


