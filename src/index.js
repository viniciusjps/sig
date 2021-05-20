import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import Overlay from 'ol/Overlay';
import { fromLonLat } from "ol/proj";

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var baseUrl = 'http://localhost:8080/geoserver/wms'

var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const selected = {
  municipios: false,
  mesorregioes: false,
  rodovias: false,
  hidrografia: false,
  policia_1: false,
  universidades: false,
  etanol: false,
}

// Base Layers

var municipios = new Image({
  title: 'Municípios Paraná',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': 'cite:municipios' },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 0.5
})

var mesorregioes = new Image({
  title: 'Mesorregioes Paraná',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': 'cite:mesoregioes' },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 0.5
})

var rodovias = new Image({
  title: 'Rodovias Unificadas',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': 'cite:rodovias' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var hidrografia = new Image({
  title: 'Hidrografia Generalizada',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': '	cite:hidrografia' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var policia_1 = new Image({
  title: 'Polícia Rodoviária Estadual',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': 'cite:policia' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var universidades = new Image({
  title: 'Universidades',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': 'cite:universidade' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var etanol = new Image({
  title: 'Usinas de Etanol',
  source: new ImageWMS({
    url: baseUrl,
    params: { 'LAYERS': 'cite:etanol' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

// Queries

const joinParams = function (params, params_names) {
  let result = ''
  for (let i = 0; i < params.length; i++) {
    result += `${params_names[i]}:${params[i]};`
  }
  result = result.slice(0,-1);
  console.log('joinParams result', result)
  return result
}

const queryMunicipios = function (params) {
  const params_names = ['name'];
  const view_params = joinParams(params, params_names);

  return new Image({
              title: 'Municipios que não são vizinhos de ...',
              source: new ImageWMS({
                      url: baseUrl,
                      params: { 'LAYERS': 'cite:mun_nao_vizinhos',
                                'viewparams': view_params },
                      ratio: 1,
                      serverType: 'geoserver'
              }),
              opacity:0.5
  })
}

const queryRios = function (params){
  const params_names = ['rio'];
  const view_params = joinParams(params, params_names);

  return new Image({
              title: 'Municípios que são banhados pelo rio ...',
              source: new ImageWMS({
                      url: baseUrl,
                      params: { 'LAYERS': 'cite:rio_mun',
                                'viewparams': view_params},
                      ratio: 1,
                      serverType: 'geoserver'
              }),
              opacity:0.5
  })
}

const queryPoliciaRodovia = function (params) {
  const params_names = ['rod','dist'];
  const view_params = joinParams(params, params_names);

  return new Image({
              title: 'Sedes de polícia estadual que estão a ... metros da rodovia ...',
              source: new ImageWMS({
                      url: baseUrl,
                      params: { 'LAYERS': 'cite:policia_rodovia',
                                'viewparams': view_params
                              },
                      ratio: 1,
                      serverType: 'geoserver'
              })
  })
}

const queryComprimentoRodovia = function (params) {
  const params_names = ['rod'];
  const view_params = joinParams(params, params_names);  

  return new Image({
              title: 'Comprimento de da rodovia ...',
              source: new ImageWMS({
                      url: baseUrl,
                      params: { 'LAYERS': 'cite:com_rod',
                                'viewparams': view_params
                              },
                      ratio: 1,
                      serverType: 'geoserver'
              })
  })
}

const queryEtanolMesorregiao = function (params) {
  const params_names = ['meso'];
  const view_params = joinParams(params, params_names);  

  return new Image({
              title: 'Usinas de etanol localizadas na mesoregião ...',
              source: new ImageWMS({
                      url: baseUrl,
                      params: { 'LAYERS': 'cite:etanol_meso',
                                'viewparams': view_params
                              },
                      ratio: 1,
                      serverType: 'geoserver'
              })
  })
}

const layers = {
  municipios: municipios,
  mesorregioes: mesorregioes,
  rodovias: rodovias,
  hidrografia: hidrografia,
  policia_1: policia_1,
  universidades: universidades,
  etanol: etanol,
}

var view = new View({
  center: fromLonLat([-51, -24.5]),
  zoom: 7
});

var viewProjection = view.getProjection();

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
  ],
  overlays: [overlay],
  view: view
});

document.getElementById('municipios').addEventListener('click', setLayer, false)
document.getElementById('mesorregioes').addEventListener('click', setLayer, false)
document.getElementById('rodovias').addEventListener('click', setLayer, false)
document.getElementById('hidrografia').addEventListener('click', setLayer, false)
document.getElementById('policia_1').addEventListener('click', setLayer, false)
document.getElementById('universidades').addEventListener('click', setLayer, false)
document.getElementById('etanol').addEventListener('click', setLayer, false)

function setLayer(value) {
  let layer = value.target.id;
  const checkbox = document.getElementsByName(layer)[0];
  let is_selected = selected[layer];
  if (!is_selected) {
    selected[layer] = true;
    map.addLayer(layers[layer]);
  } else {
    selected[layer] = false;
    map.removeLayer(layers[layer]);
  }
  if (checkbox) {
    checkbox.checked = !is_selected;
  }
}

map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;
  var viewResolution = /** @type {number} */ (view.getResolution());

  var urlMunicipios = municipios.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlMesorregioes = mesorregioes.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlRodovias = rodovias.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlHidrografia = hidrografia.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlPolicia = policia_1.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlUniversidades = universidades.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlEtanol = etanol.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlQueryMunicipios = (saved_queries.queryMunicipios) ? 
    (saved_queries.queryMunicipios.getSource().getFeatureInfoUrl(coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'})) : undefined

  var urlQueryRios = (saved_queries.queryRios) ? 
    (saved_queries.queryRios.getSource().getFeatureInfoUrl(coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'})) : undefined
  
  var urlQueryPoliciaRodovia = (saved_queries.queryPoliciaRodovia) ? 
    (saved_queries.queryPoliciaRodovia.getSource().getFeatureInfoUrl(coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'})) : undefined
  
  var urlQueryComprimentoRodovia = (saved_queries.queryComprimentoRodovia) ? 
  (saved_queries.queryComprimentoRodovia.getSource().getFeatureInfoUrl(coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'})) : undefined

  var urlQueryEtanolMesorregiao = (saved_queries.queryEtanolMesorregiao) ? 
  (saved_queries.queryEtanolMesorregiao.getSource().getFeatureInfoUrl(coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'})) : undefined

  var urls = new Map()
  urls.set('municipios', urlMunicipios)
  urls.set('mesorregioes', urlMesorregioes)
  urls.set('rodovias', urlRodovias)
  urls.set('hidrografia', urlHidrografia)
  urls.set('policia_1', urlPolicia)
  urls.set('universidades', urlUniversidades)
  urls.set('etanol', urlEtanol)
  urls.set('queryMunicipios', urlQueryMunicipios)
  urls.set('queryRios', urlQueryRios)
  urls.set('queryPoliciaRodovia', urlQueryPoliciaRodovia)
  urls.set('queryComprimentoRodovia', urlQueryComprimentoRodovia)
  urls.set('queryEtanolMesorregiao', urlQueryEtanolMesorregiao)

  for (const [key, value] of Object.entries(selected)) {
    if (value) {
      getAjaxResult(urls.get(key), coordinate)
    }
  }

  for (const [key, value] of Object.entries(selected_queries)) {
    if (value) {
      getAjaxResult(urls.get(key), coordinate)
    }
  }
})

function getAjaxResult(urlParam, coordinate) {
  if (urlParam) {
    $.ajax({
      url: urlParam,
      crossDomain: true,
      success: function (result) {
        handleResult(result, coordinate)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('erro: ' + errorThrown)
      }
    })
  }
}

function handleResult(result, coordinate) {
  var html = subStringBody(result);
  content.innerHTML = html;
  overlay.setPosition(coordinate);
}

function subStringBody(html) {
  var i = html.indexOf("<body>");
  var f = html.indexOf("</body>");
  if (i >= 0 && f >= 0) {
    i += 6.
    return html.substring(i, f);
  }
}

document.getElementById('btn_queryMunicipios').addEventListener('click', addQuery, false)
document.getElementById('btn_queryRios').addEventListener('click', addQuery, false)
document.getElementById('btn_queryPoliciaRodovia').addEventListener('click', addQuery, false)
document.getElementById('btn_queryComprimentoRodovia').addEventListener('click', addQuery, false)
document.getElementById('btn_queryEtanolMesorregiao').addEventListener('click', addQuery, false)

const selected_queries = {
  queryMunicipios: false,
  queryRios: false,
  queryPoliciaRodovia: false,
  queryComprimentoRodovia: false,
  queryEtanolMesorregiao: false
}

const queries = {
  queryMunicipios: queryMunicipios,
  queryRios: queryRios,
  queryPoliciaRodovia: queryPoliciaRodovia,
  queryComprimentoRodovia: queryComprimentoRodovia,
  queryEtanolMesorregiao: queryEtanolMesorregiao
}

const saved_queries = {
  queryMunicipios: undefined,
  queryRios: undefined,
  queryPoliciaRodovia: undefined,
  queryComprimentoRodovia: undefined,
  queryEtanolMesorregiao: undefined
}

function addQuery(value) {
  let id = value.target.id.split('btn_')[1];
  let params = Array.from(document.getElementsByClassName(`param_${id}`)).map(elem => elem.value);
  console.log(params);

  let is_selected = selected_queries[id];
  if (!is_selected) {
    selected_queries[id] = true;
    const button = document.getElementById(`btn_${id}`);
    button.innerText = 'Remover query';
    button.className = 'delete';
    
    let layer = queries[id](params);
    saved_queries[id] = layer

    map.addLayer(layer);

  } else {
    selected_queries[id] = false;
    const button = document.getElementById(`btn_${id}`);
    button.innerText = 'Adicionar query';
    button.className = '';
    
    map.removeLayer(saved_queries[id]);
  }
}