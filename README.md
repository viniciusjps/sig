# Projeto - SIG

## Grupo 1:  GeoParaná
<br>

### Integrantes
- Natan Ataide - 118110521
- Pablwo Mattheus - 118110246
- João Henrique - 118210761
- Vinicius Jorge - 116210568
- Eduardo Macedo - 117110912

### Camadas:

* Municipios

* Meso-regiões

* Rodovias

* Rios

* Policia rodoviária estadual

* Dados Universidades

* Usinas de Etanol

* OSM (Open Street Maps)
<br>


### Arquitetura:

        Openlayers (ou outro preferido) + Geoserver 
        PostGrees + PostGis
        JavaScrip + Html + Css


### Funcionalidades:

* Overlay de camadas

* Zooming e panning

* Information (tooltip)

<br>

### Consultas:

* 1 Usando buffer

* 3 consultas com operadores topológicos

* 1 consulta métrica

<br>

## Baixa o geoserver:
http://sourceforge.net/projects/geoserver/files/GeoServer/2.19.0/geoserver-2.19.0-bin.zip

## Descompacta os arquivos do geoserver:
Após isso, descompacta o arquivo cite.tar e coloca a pasta dentro do Geoserver, no caminho:

/data_dir/workspaces

## Inicia o geoserver:
./bin/startup.sh

## Baixar ShapeFiles:
https://drive.google.com/file/d/1xKsnDMj1EQEcDRV8hTE8lsrdYxAxiJk2/view

## Criar as Tabelas:
Existe duas opções para a criação das tabelas 
* Através do PostGis com arquivo .shp
* Através do PostGis com os arquivos .sql

## Queries:

- ### Municípios que não são vizinhos de X
```sql
SELECT m1.nome, m1.geom FROM "municipios" m1, "municipios" m2 WHERE st_disjoint(m1.geom::geometry, m2.geom::geometry) AND m2.nome = '%name%'
```
- ### Municípios que são banhados pelo rio X
```sql
SELECT DISTINCT on (m1.nome) h1.norio, m1.nome, m1.geom as mun FROM "hidrografia" h1, "municipios" m1 WHERE ST_intersects(h1.geom,m1.geom) and h1.norio = '%rio%'
```

- ### Sedes de polícia que estão a no máximo X metros da rodovia Y
```sql
SELECT DISTINCT on (po.municipio) po.municipio, r.nomerodovi as rodovia, ST_distance(po.geom,r.geom) as distância, po.geom
FROM policia po, rodovias r
WHERE ST_intersects(r.geom, ST_buffer(po.geom, %dist%)) AND r.nomerodovi = '%rod%'
```

- ### Comprimento da rodovia X
```sql
SELECT nomerodovi, SUM(st_length(geom)/1000) as comprimento_km, st_union(geom) FROM rodovias 
WHERE nomerodovi = '%rod%' GROUP BY nomerodovi
```

- ### Usinas de etanol localizadas na mesoregião X
```sql
SELECT us.nome, us.endereco, us.municipio, us.cnpj, us.geom FROM etanol us, mesoregioes me WHERE st_within(us.geom, me.geom) AND me.NM_MESO = '%meso%'
```

## Inicia o projeto:
* npm install
* npm start
