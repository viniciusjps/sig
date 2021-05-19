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
  mesopb: false,
  queryMunicipios: false,
  queryRios: false,
  queryPoliciaRodovia: false
}

var municipios = new Image({
  title: 'municipios',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:municipios' },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 0.5
})

var mesorregioes = new Image({
  title: 'mesorregioes',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/cite/wms',
    params: { 'LAYERS': 'cite:mesoregioes' },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 0.5
})

var rodovias = new Image({
  title: 'Rodovias Unificadas (2013) [SEIL/DER]',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:rodovias' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var hidrografia = new Image({
  title: 'Hidrografia Generalizada [SEMA_AGUASPARANA]',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': '	cite:hidrografia' },
    ratio: 1,
    serverType: 'geoserver'
  })
})
    
var policia_1 = new Image({
  title: 'Polícia Rodoviária Estadual [SESP]',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:policia' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var universidades = new Image({
  title: 'Dados Universidades IEES [SETI]',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:universidade' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var etanol = new Image({
  title: 'Usinas de Etanol',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:etanol' },
    ratio: 1,
    serverType: 'geoserver'
  })
})

var queryMunicipios = new Image({
  title: 'Municipios que não são vizinhos de',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:mun_nao_vizinhos',
              'viewparams': 'name:Ponta Grossa' },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity:0.5
})

var queryRios = new Image({
  title: 'Municípios que são banhados pelo rio',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:rio_mun',
              'viewparams': 'rio:Iguaçu'},
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity:0.5
})

var queryPoliciaRodovia = new Image({
  title: 'Munícipios que estão a ... metros da rodovia ...',
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: { 'LAYERS': 'cite:policia_rodovia',
              'viewparams': 'rod:BR476;dist:10000'
            },
    ratio: 1,
    serverType: 'geoserver'
  })
})


const layers = {
  municipios: municipios,
  mesorregioes: mesorregioes,
  rodovias: rodovias,
  hidrografia: hidrografia,
  policia_1: policia_1,
  universidades: universidades,
  etanol: etanol,
  queryMunicipios: queryMunicipios,
  queryRios: queryRios,
  queryPoliciaRodovia: queryPoliciaRodovia
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
document.getElementById('queryMunicipios').addEventListener('click', setLayer, false)
document.getElementById('queryRios').addEventListener('click', setLayer, false)
document.getElementById('queryPoliciaRodovia').addEventListener('click', setLayer, false)



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

map.on('singleclick', function(evt){
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
  var urlQuery1 = queryMunicipios.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlQuery2 = queryRios.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  var urlQuery3 = queryPoliciaRodovia.getSource().getFeatureInfoUrl(
    coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'}
  )
  
  

  var urls = new Map()
  urls.set('municipios', urlMunicipios)
  urls.set('mesorregioes', urlMesorregioes)
  urls.set('rodovias', urlRodovias)
  urls.set('hidrografia', urlHidrografia)
  urls.set('policia_1', urlPolicia)
  urls.set('universidades', urlUniversidades)
  urls.set('etanol', urlEtanol)
  urls.set('queryMunicipios', urlQuery1)
  urls.set('queryRios', urlQuery2)
  urls.set('queryPoliciaRodovia', urlQuery3)
  
  
  for (const [key, value] of Object.entries(selected)) {
    if(value){
      getAjaxResult(urls.get(key), coordinate)
    }
  }
})

function getAjaxResult(urlParam, coordinate) {
  if(urlParam){
    $.ajax({
      url: urlParam,
      crossDomain: true,
      success: function(result){
        handleResult(result, coordinate)
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log('erro: '+ errorThrown)
      }
    })
  }
}

function handleResult(result, coordinate){
  var html = subStringBody(result);
  content.innerHTML = result;
  overlay.setPosition(coordinate);
}

function subStringBody(html){
  var i = html.indexOf("<body>");
  var f = html.indexOf("</body>");
  if(i>=0 && f>=0){
    i+=6.
    return html.substring(i, f);
  }
}