import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Image from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

const selected = {
  municipios: false,
  rodovias: false,
  hidrografia: false,
  policia_1: false,
  universidades: false,
  etanol: false
}

const layers = {
  municipios: {
    image: new Image({
      title: 'municipios',
      source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'cite:municipios_pr_pol_p31982_e50_a2014' },
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  },
  rodovias: {
    image: new Image({
      title: 'Rodovias Unificadas (2013) [SEIL/DER]',
      source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'cite:rodovias_unificadas_lin_p29192_a2013' },
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  },
  hidrografia: {
    image: new Image({
      title: 'Hidrografia Generalizada [SEMA_AGUASPARANA]',
      source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'cite:hidrografia_generalizada_lin_p31982_e50_a2011_v002' },
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  },
  policia_1: {
    image: new Image({
      title: 'Polícia Rodoviária Estadual [SESP]',
      source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'cite:policia_rodoviaria_estadual_pto_p4674' },
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  },
  universidades: {
    image: new Image({
      title: 'Dados Universidades IEES [SETI]',
      source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'cite:dado_universidade_iees_pto_p29192' },
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  },
  etanol: {
    image: new Image({
      title: 'Usinas de Etanol',
      source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: { 'LAYERS': 'cite:usinas_etanol_pto_p4674' },
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  }
}

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    // new Image({
    //   title: 'Municípios do Paraná 2014 - Escala 1:50.000 [ITCG]',
    //   source: new ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: { 'LAYERS': 'cite:municipios_pr_pol_p31982_e50_a2014' },
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // }),
    // new Image({
    //   title: 'Rodovias Unificadas (2013) [SEIL/DER]',
    //   source: new ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: { 'LAYERS': 'cite:rodovias_unificadas_lin_p29192_a2013' },
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // }),
    // new Image({
    //   title: 'Hidrografia Generalizada [SEMA_AGUASPARANA]',
    //   source: new ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: { 'LAYERS': 'cite:hidrografia_generalizada_lin_p31982_e50_a2011_v002' },
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // }),
    // new Image({
    //   title: 'Polícia Rodoviária Estadual [SESP]',
    //   source: new ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: { 'LAYERS': 'cite:policia_rodoviaria_estadual_pto_p4674' },
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // }),
    // new Image({
    //   title: 'Dados Universidades IEES [SETI]',
    //   source: new ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: { 'LAYERS': 'cite:dado_universidade_iees_pto_p29192' },
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // }),
    // new Image({
    //   title: 'Usinas de Etanol',
    //   source: new ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: { 'LAYERS': 'cite:usinas_etanol_pto_p4674' },
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // })
  ],
  view: new View({
    center: [0, 0],
    zoom: 0
  })
});

document.getElementById('municipios').addEventListener('click', setLayer, false)
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
    map.addLayer(layers[layer].image);
  } else {
    selected[layer] = false;
    map.removeLayer(layers[layer].image);
  }
  if (checkbox) {
    checkbox.checked = !is_selected;
  }
}