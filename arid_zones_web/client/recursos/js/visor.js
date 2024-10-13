var servidorGeoServer = "localhost:8082";
var servidorMapServer = "localhost:8081";
var servidorMapServerDir = "C:/mapbender/";


const proj_32613 = 'EPSG:32613';
var arregloBusquedas = [];
var datoConsultaPadron = {datos: null};
var datoInspeccionarPadron ={datos: null};
var estaHerramientaActiva = false;

var tablaContenido = [
  {
    categoria: 'Mapa Base', 
    id: 'pageSubMenuMapaBaseSinaloa', 
    elementos: [
      {
        nombre: 'Mapa Base OSM', 
        id_collapse: 'collapseosm', 
        capa: 'osm', 
        id_opacidad: 'osm|Opacidad', 
        visible: true, 
        url: '',
        url_simbologia: ''
      },
      {
        nombre: 'Mapa Base Terrain', 
        id_collapse: 'collapseterrain', 
        capa: 'terrain', 
        id_opacidad: 'terrain|Opacidad', 
        visible: false, 
        url: '',
        url_simbologia: ''
      },
      {
        nombre: 'Límite Estatal Sinaloa', 
        id_collapse: 'collapseLimitesMunicipales', 
        capa: 'limites_municipales', 
        id_opacidad: 'limites_municipales|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:limites_municipales&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:limites_municipales&STYLE=C_limites_municipales'
      }
    ]
  },

  {
    categoria: 'Ortofotos', 
    id: 'pageSubMenuOrtofotos', 
    elementos: [
      {
        nombre: 'Ortofotos 2020', 
        id_collapse: 'collapseortoWMS', 
        capa: 'ortoWMS', 
        id_opacidad: 'ortoWMS|Opacidad', 
        visible: false, 
        url: 'http://localhost:8081/cgi-bin/mapserv.exe?map=C:/visualizador/servers/mapserver/ortofotos.map&REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&LAYERS=ortofotos&FORMAT=image/png&STYLES=&SRS=EPSG:6368&BBOX=245089,2734170,264848,2754943&WIDTH=768&HEIGHT=768',
		//crossOrigin : "Anonymous",
		url_simbologia: ''
      },
      {
        nombre: 'Ortofotos ICES 2019', 
        id_collapse: 'collapseortoICES2019', 
        capa: 'ortoICES2019', 
        id_opacidad: 'ortoICES2019|Opacidad', 
        visible: false, 
        //url: 'http://geoservervte.sinaloa.gob.mx:80/geoserver/ices/wms?service=WMS&layers=ices:Culiacan2019&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        //url_simbologia: 'http://geoservervte.sinaloa.gob.mx/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=ices:Ortofotos2019&'
      }
    ]
  },



  {
    categoria: 'Catastro Urbano', 
    id: 'pageSubMenuCatastroUrbano', 
    elementos: [
      {
        nombre: 'Municipio Culiacán', 
        id_collapse: 'collapseculiacan', 
        capa: 'culiacan', 
        id_opacidad: 'culiacan|Opacidad', 
        visible: true, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:culiacan&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:culiacan&STYLE=C_culiacan'
      },
      {
        nombre: 'Perímetro Urbano', 
        id_collapse: 'collapseurbano', 
        capa: 'urbano', 
        id_opacidad: 'urbano|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:urbano&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:urbano&STYLE=C_urbano'
      },
      {
        nombre: 'Cuarteles', 
        id_collapse: 'collapsecuarteles', 
        capa: 'cuarteles', 
        id_opacidad: 'cuarteles|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:cuarteles&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:cuarteles&STYLE=C_cuarteles'
      },
      {
        nombre: 'Manzanas', 
        id_collapse: 'collapsemanzanas', 
        capa: 'manzanas', 
        id_opacidad: 'manzanas|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:manzanas&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:manzanas&STYLE=C_manzanas'
      },
      {
        nombre: 'Predios', 
        id_collapse: 'collapsePredio', 
        capa: 'Culiacan_Join', 
        id_opacidad: 'Culiacan_Join|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:Culiacan_Join&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:Culiacan_Join&STYLE=C_culiacan_join'
      },
      {
        nombre: 'Construcciones', 
        id_collapse: 'collapseConstrucciones', 
        capa: 'construccion', 
        id_opacidad: 'construccion|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:construccion&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:construccion&STYLE=C_construcciones'
      },
      {
        nombre: 'Usos de Suelo', 
        id_collapse: 'collapseUsosSuelo', 
        capa: 'usos_suelo', 
        id_opacidad: 'usos_suelo|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:usos_suelo&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:usos_suelo&STYLE=C_usos_suelo'
      },
      {
        nombre: 'Predio Valor Catastral', 
        id_collapse: 'collapseValorCatastral', 
        capa: 'valor_catastral', 
        id_opacidad: 'valor_catastral|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:valor_catastral&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:valor_catastral&STYLE=C_valor_catastral'
      }
    ]
  },


  {
    categoria: 'Información Catastral', 
    id: 'pageSubMenuMunicipioCuliacan', 
    elementos: [
      {
        nombre: 'Zona Valor', 
        id_collapse: 'collapsezonaValor', 
        capa: 'zona_valor', 
        id_opacidad: 'zona_valor|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:zona_valor&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:zona_valor&STYLE=C_zona_valor'
      },
      {
        nombre: 'Laboratorio de Valores', 
        id_collapse: 'collapseLaboratorioValores', 
        capa: 'laboratorio_valores', 
        id_opacidad: 'laboratorio_valores|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:laboratorio_valores&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:laboratorio_valores&STYLE=C_laboratorio_valores'
      },
      {
        nombre: 'Tramos', 
        id_collapse: 'collapsezonaTramos', 
        capa: 'tramos', 
        id_opacidad: 'tramos|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:tramos&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: ''
      }

    ]
  },


  {
    categoria: 'INEGI', 
    id: 'pageSubMenuINEGI', 
    elementos: [
      {
        nombre: 'Vías de Comunicación', 
        id_collapse: 'collapseViasComunicacion', 
        capa: 'vias_comunicacion', 
        id_opacidad: 'vias_comunicacion|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:vias_comunicacion&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:vias_comunicacion&STYLE=C_vias_comunicacion'
      },
      {
        nombre: 'Hidrografía', 
        id_collapse: 'collapsehidrografia', 
        capa: 'hidrografia', 
        id_opacidad: 'hidrografia|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:hidrografia&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:hidrografia&STYLE=C_hidrografia'
      },
      {
        nombre: 'Uso de Suelo y Vegetación', 
        id_collapse: 'collapseUsoSueloVegetacion', 
        capa: 'uso_suelo_vegetacion', 
        id_opacidad: 'uso_suelo_vegetacion|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:uso_suelo_vegetacion&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:uso_suelo_vegetacion&STYLE=C_uso_suelo_vegetacion'
      },
      {
        nombre: 'Relieve', 
        id_collapse: 'collapseRelieve', 
        capa: 'relieve', 
        id_opacidad: 'relieve|Opacidad', 
        visible: false, 
        url: 'http://'+servidorGeoServer+'/geoserver/catastro/ows?service=WMS&layers=catastro:relieve&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
        url_simbologia: 'http://'+servidorGeoServer+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=catastro:relieve&STYLE=C_relieve'
      },
      {
        nombre: 'DENUE', 
        id_collapse: 'collapseDENUE', 
        capa: 'denue', 
        id_opacidad: 'denue|Opacidad', 
        visible: false, 
        url: 'http://geoservervte.sinaloa.gob.mx/geoserver/ices/wms?service=WMS&version=1.1.0&request=GetMap&layers=ices:Denue2019&srs=EPSG:6372&format=image/png',
        url_simbologia: 'http://geoservervte.sinaloa.gob.mx/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=ices:Denue2019&'
      }
    ]
  },

];

var attribution = new ol.control.Attribution({

  collapsible: true,
});


proj4.defs(proj_32613, '+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs');
ol.proj.proj4.register(proj4);

var mapObject = new ol.Map({
  target: 'mapa',
  controls: ol.control.defaults({attribution: false}).extend([attribution]),
  view: new ol.View({
    projection: proj_32613,
    center: [257927.5481, 2744915.3498], 
    zoom: 10
  })
});  

generarHtmlTablaContenido(mapObject, tablaContenido);


//layer para mostrar las busquedas
var sourceBusquedas = new ol.source.Vector();
 //Vector Layer
var vectorBusquedas = new ol.layer.Vector({
  source: sourceBusquedas,
  style: new ol.style.Style({
      fill: new ol.style.Fill({
          color: 'rgba(153, 135, 18, .3)'
      }),
      stroke: new ol.style.Stroke({
          color: 'orange',
          width: 2
      })
  })
});
mapObject.addLayer(vectorBusquedas);




//capa seleccionada por 15 segundos
const timeOut = 15000;
var sourceSeleccion = new ol.source.Vector();
 //Vector Layer
var vectorSeleccion = new ol.layer.Vector({
  source: sourceSeleccion,
  style: new ol.style.Style({
      fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0)'
      }),
      stroke: new ol.style.Stroke({
          color: 'black',
          width: 2
      })
  })
});
mapObject.addLayer(vectorSeleccion);




//layer para mostrar la ubicacion del usuario
var positionFeature = new ol.Feature();
positionFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC',
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
);
var vectorPosition = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [ 
      positionFeature
    ],
  }),
});
mapObject.addLayer(vectorPosition);

var geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: mapObject.getView().getProjection(),
});




//layer para mostrar la seccion de herramientas
var vectorHerramientas = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: '#000',
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: '#000',
      }),
    }),
  }),
});
mapObject.addLayer(vectorHerramientas);

var modifyFeatureHerramientas = new ol.interaction.Modify({source: vectorHerramientas.getSource()});
mapObject.addInteraction(modifyFeatureHerramientas);



//layer para mostrar la geometria del snap
var vectorSnap = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: '#263BF2',
      lineDash: [8],
      width: 1
    })
  }),
});
mapObject.addLayer(vectorSnap);




//////////
//sirve para poder tener la funcionalidad de snap
var herramientasInteracion = new ol.interaction.Snap({
  source: vectorHerramientas.getSource(),
});

var snapInteracion = new ol.interaction.Snap({
  source: vectorSnap.getSource(),
});








//busquedas
$('button#search').on('click', function () {
  if ($('.search').is(':visible')) {
    $('.search').hide();
    $('#tipo_busqueda').hide();
    
  } else {
      $('.search').show();      
      $('#tipo_busqueda').show();
      $('.search').focus();
  }
});

$('.search').on('keyup', function (e) {
  if (e.key === 'Enter' || e.keyCode === 13) {

    if ($('#tipo_busqueda').val() > 0) {

      if ($('.search').val().length > 0) {

        var listPromise2 = [];

        var promise = new Promise(function(resolve, reject) {

          jQuery.ajax({
            type:'GET',
            data: { buscar : $('.search').val(), tipo_busqueda: $('#tipo_busqueda').val()},
            cache:false,
            error:function(error){
                reject('error al consultar busqueda');
            },
            url: window.location.origin + window.location.pathname + "busquedas",
            success:function(result){
                if (result.code == 200) {                       
                    resolve(result.data);
                }else{
                    reject(result.menssage);
                }
            }
          });                   
             
        });
        listPromise2.push(promise);

        Promise.all(listPromise2).then(function(response){

          if (!arregloBusquedas[response[0].searchTerm]) {
            //no existe

            arregloBusquedas[response[0].searchTerm] = response[0];

            var oButton5  = document.createElement('button'); 
            oButton5.setAttribute("id", 'btnSearch');
            oButton5.setAttribute("type", 'button');
            oButton5.setAttribute("name", arregloBusquedas[response[0].searchTerm].searchTerm);
            oButton5.setAttribute("title", arregloBusquedas[response[0].searchTerm].searchTerm);
            oButton5.classList = "btn btn-info btn_menu";
            oButton5.style.backgroundColor = '#f0f0f0';
            oButton5.style.color = '#000';
            oButton5.style.width = '40px';
            oButton5.addEventListener("click", funcionButtonMenuClick);

            var oI2  = document.createElement('i'); 
            oI2.classList = "fas fa-search";
            oI2.setAttribute("aria-hidden", 'true');
            oButton5.appendChild(oI2);

            $('#ulOpcionesMenu').append(oButton5);

            generarHtmlBusqueda(arregloBusquedas[response[0].searchTerm].searchTerm);

          }else{
            generarHtmlBusqueda(arregloBusquedas[response[0].searchTerm].searchTerm);
          }

          $('.search').val('');
          $('.search').hide();
          $('#tipo_busqueda').hide();

        }).catch(function(e){ 
          console.info(e);
        }); 
      }else{
        alert("Proporcione el dato a buscar");
      }

    }else{
      alert("Seleccione el tipo de busqueda");
    }

  }  
});



var funcionExportarConsultaPadronClick = function () {
  var coordenadas = $(this).attr('name');
  //Crear la captura del mapa
  mapObject.once('rendercomplete', function () {

      html2canvas(document.querySelector('#mapa')).then(canvas => {
        
        var img = canvas.toDataURL('image/png');
        var url = window.location.origin + window.location.pathname + "generar_pdf_consulta_padron";    
        var name = 'consultaPadronPdf';
        var param = { 'mapa': img, 'coordenadas': coordenadas};

        imprimirPdf(url, name, param);      

      });






      /*var mapCanvas = document.createElement('canvas');
      var size = mapObject.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      var mapContext = mapCanvas.getContext('2d');

      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
            if (canvas.width > 0) {

              var opacity = canvas.parentNode.style.opacity;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
              var transform = canvas.style.transform;
              // Get the transform parameters from the style's transform matrix
              var matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(',')
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );

              mapContext.drawImage(canvas, 0, 0);
            }
        }
      );
      
      var img = mapCanvas.toDataURL('image/png');
      var url = window.location.origin + window.location.pathname + "generar_pdf_consulta_padron";    
      var name = 'consultaPadronPdf';
      var param = { 'mapa': img, 'coordenadas': coordenadas};

      imprimirPdf(url, name, param);*/

  });
  mapObject.renderSync();  
}

//generar pdf en la seccion de consulta a padron
$('button#btnExportarConsultaPadron').on('click', funcionExportarConsultaPadronClick);



//boton de exportar a pedf de la seccion de inspeccionar padron
var funcionExportarInspeccionarPadronClick = function () {
  var coordenadas = $(this).attr('name');
  //Crear la captura del mapa
  mapObject.once('rendercomplete', function () {

     html2canvas(document.querySelector('#mapa')).then(canvas => {
        
        var img = canvas.toDataURL('image/png');
        var url = window.location.origin + window.location.pathname + "generar_pdf_inspeccionar_padron";    
        var name = 'inspeccionarPadronPdf';
        var param = { 'mapa': img, 'coordenadas': coordenadas};

        imprimirPdf(url, name, param);        

      });


      /*var mapCanvas = document.createElement('canvas');
      var size = mapObject.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      var mapContext = mapCanvas.getContext('2d');

      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
            if (canvas.width > 0) {

              var opacity = canvas.parentNode.style.opacity;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
              var transform = canvas.style.transform;
              // Get the transform parameters from the style's transform matrix
              var matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(',')
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );

              mapContext.drawImage(canvas, 0, 0);
            }
        }
      );
      
      var img = mapCanvas.toDataURL('image/png');
      var url = window.location.origin + window.location.pathname + "generar_pdf_inspeccionar_padron";    
      var name = 'inspeccionarPadronPdf';
      var param = { 'mapa': img, 'coordenadas': coordenadas};

      imprimirPdf(url, name, param);*/

  });
  mapObject.renderSync();  
}

//generar pdf en la seccion de consulta a padron
$('button#btnExportarInspeccionarPadron').on('click', funcionExportarInspeccionarPadronClick);


//muestra la posicion del mouse
mapObject.addControl( new ol.control.MousePosition({
  coordinateFormat: function(coord) {
      return ol.coordinate.format(coord, 'X: {x}, Y: {y}', 4);
  },
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
}));


//muestra la barra de escala en el mapa
mapObject.addControl(new ol.control.ScaleLine({
  target: document.getElementById('scale-display'),
  units: 'metric',
  text: true,
  bar: true,
  steps: 4,
  minWidth: 140
}));


  
//este evento controla la visibilidad de las capas
$('input[type=checkbox]').on('change', function () {
  var layer = obtenerLayerAtName($(this).attr('id'));
  if (layer !== null) {
    layer.setVisible(!layer.getVisible());
  }
  
});

//este evento controla la opacidad de las capas
$('input[type=range]').on('change', function () {

  var valores = $(this).attr('id').split('|');
  var item = obtenerLayerAtName(valores[0]);
  item.setOpacity($(this).val() / 100);

});




//streetView
function streetview(evt){
  const coords = ol.proj.toLonLat(evt.coordinate);
  const url = "http://maps.google.com/?cbll="+coords[1]+","+coords[0]+"&cbp=12,90,0,0,5&layer=c";            
  window.open(url,'popup','width=800,height=600,scrollbars=no,resizable=no');
}

function AbrirMenu(){
  if ($('#sidebar')[0].classList.contains('active')) {
     $("#sidebar").removeClass("active");
  }
}

var funcionResultadoBusquedaClick = function () {
  var valores = $(this).attr('id').split('|');
  if (valores) {
    if (arregloBusquedas[valores[0]]) {
      if (arregloBusquedas[valores[0]].data[valores[1]]) {

        var datos = arregloBusquedas[valores[0]].data[valores[1]];
        datoConsultaPadron = {datos: null};
        generarHtmlConsultaPadron(datoConsultaPadron);

        pintarPoligonoBusquedas(datos.geometry);
      }
    }  
  }
  
}

var funcionButtonMenuClick = function () {
  switch($(this).attr('id')){
      case 'sidebarCollapse1':
        if ($('#sidebar')[0].classList.contains('active')) {
           $("#sidebar").removeClass("active");
        }else{
          $("#sidebar").addClass("active");
        }
        break;

      case 'btnTablaContenido':
        estaHerramientaActiva = false;
        ExampleDraw.reset();
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        sourceBusquedas.clear();
        if ($('#sidebar')[0].classList.contains('active')) {
           $("#sidebar").removeClass("active");
        }
        $('.sidebar_seccion').hide();
        $('#seccion_tabla_contenido').show();      
        break;

      case 'btnConsultaPadron':
        estaHerramientaActiva = false;
        ExampleDraw.reset();
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        sourceBusquedas.clear();
        if ($('#sidebar')[0].classList.contains('active')) {
           $("#sidebar").removeClass("active");
        }
        $('.sidebar_seccion').hide();
        generarHtmlConsultaPadron(datoConsultaPadron);
        $('#seccion_consulta_padron').show();
        break;

      case 'btnInspeccionarPadron':
        estaHerramientaActiva = false;
        ExampleDraw.reset();
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        sourceBusquedas.clear();
        if ($('#sidebar')[0].classList.contains('active')) {
           $("#sidebar").removeClass("active");
        }
        $('.sidebar_seccion').hide();
        generarHtmlInspeccionarPadron(datoInspeccionarPadron);
        $('#seccion_inspeccionar_padron').show();

        break;

      case 'btnSearch':
        estaHerramientaActiva = false;
        ExampleDraw.reset();
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        sourceBusquedas.clear();
        if ($('#sidebar')[0].classList.contains('active')) {
           $("#sidebar").removeClass("active");
        }
        generarHtmlBusqueda($(this).attr('name'));
        break;

      case 'btnCerrarBusqueda':
        sourceBusquedas.clear();
        if (arregloBusquedas[$(this).attr('name')]) {
          delete arregloBusquedas[$(this).attr('name')];

          if ($("button#btnSearch[name='"+$(this).attr('name')+"']").length > 0) {
            $("button#btnSearch[name='"+$(this).attr('name')+"']")[0].remove();
            $('#seccion_busqueda')[0].innerHTML = '';

            $('.sidebar_seccion').hide();
            $('#seccion_tabla_contenido').show(); 
          }
        }
        break;
    
      case 'btnStreetView':
        estaHerramientaActiva = false;
        ExampleDraw.reset();
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        sourceBusquedas.clear();
        if ($('#sidebar')[0].classList.contains('active')) {
           $("#sidebar").removeClass("active");
        }
        $('.sidebar_seccion').hide();
        $('#seccion_street_view').show();
        break;
      
      case 'btnExportarPng':
        exportarMapaPng();
        break;

      case 'btnUbicacion':
        estaHerramientaActiva = false;
        ExampleDraw.reset();
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        const valor = !geolocation.getTracking();
        geolocation.setTracking(valor);
        if (valor) {
          positionFeature.setGeometry(null);
        }else{
          positionFeature.setGeometry(null);
        }
        break;  

        case 'btnHerramientas':
          if ($('#sidebar')[0].classList.contains('active')) {
             $("#sidebar").removeClass("active");
          }
          $('.sidebar_seccion').hide();
          $('#seccion_herramientas').show();
          break;

      default:
        break;

   }
  
}
//evento click para los butones del menu lateral
$('button.btn_menu').on('click', funcionButtonMenuClick);



//popup click map.
var container = document.getElementById('popup');
$('#popup').show();
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlayPopUp = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = function () {
  overlayPopUp.setPosition(undefined);
  closer.blur();
  return false;
};
mapObject.addOverlay(overlayPopUp);

mapObject.on('singleclick', function(evt) { 
  var coordenadas = evt.coordinate[0] + ' ' + evt.coordinate[1];

  //verirficamos si esta visible la seccion de consulta a padron 
  if ($('#seccion_consulta_padron').is(':visible')){
      $('#progressConsultaPadron').show();
      var listPromise2 = [];

      var promise = new Promise(function(resolve, reject) {

        jQuery.ajax({
          type:'GET',
          data: { p1 : coordenadas},
          cache:false,
          error:function(error){
              reject('error al consultar la información de la consulta a padrón.');
          },
          url: window.location.origin + window.location.pathname + "consulta_padron",
          success:function(result){
              if (result.code == 200) {                       
                  resolve(result.data);
              }else{
                  reject(result.menssage);
              }
          }
        });                   
           
      });
      listPromise2.push(promise);

      Promise.all(listPromise2).then(function(response){

          datoConsultaPadron = { 
            datos: response[0],
            coordenadas: coordenadas
          };
     
          generarHtmlConsultaPadron(datoConsultaPadron);  

      }).catch(function(e){ 
        $('#progressConsultaPadron').hide();
        console.info(e);
      }); 

    
  }else if($('#seccion_inspeccionar_padron').is(':visible')){

    if (!estaHerramientaActiva) {
      $('#progressInspeccionarPadron').show();
      var listPromise2 = [];

      var promise = new Promise(function(resolve, reject) {

        jQuery.ajax({
          type:'GET',
          data: { p1 : coordenadas},
          cache:false,
          error:function(error){
              reject('error al consultar la información de la inspección a padrón.');
          },
          url: window.location.origin + window.location.pathname + "inspeccionar_padron",
          success:function(result){
              if (result.code == 200) {                       
                  resolve(result.data);
              }else{
                  reject(result.menssage);
              }
          }
        });                   
           
      });
      listPromise2.push(promise);

      Promise.all(listPromise2).then(function(response){

          datoInspeccionarPadron = { 
            datos: response[0],
            coordenadas: coordenadas
          };
     
          generarHtmlInspeccionarPadron(datoInspeccionarPadron);  

      }).catch(function(e){ 
        $('#progressInspeccionarPadron').hide();
        console.info(e);
      }); 
    }
  }else if ($('#seccion_street_view').is(':visible')) {
    streetview(evt);
  }/*else if($('#seccion_herramientas').is(':visible') && estaHerramientaActiva){

  }*/else{
    //obtenemos las capas visibles
    const todoslayers = mapObject.getLayers().getArray();
    var layers = [];
    for (var i = 0; i < todoslayers.length; i++) {
      if (todoslayers[i].getProperties().name === 'osm' || 
        todoslayers[i].getProperties().name === 'terrain' ||
        todoslayers[i].getProperties().name === 'cartaINEGI' ||
        todoslayers[i].getProperties().name === 'ortoICES2019' ||
        todoslayers[i].getProperties().name === 'ortoWMS') {
        continue;
      }else{
        //capas que nos interesan consultar su informacion para mostrar el popup
        if (todoslayers[i].getVisible()) {
          layers.push(todoslayers[i].getProperties().name);
        }
      }
    }

    if (layers.length > 0) {

      var listPromise2 = [];

      var promise = new Promise(function(resolve, reject) {

        jQuery.ajax({
          type:'GET',
          data: { LAYERS : layers, p1 : coordenadas},
          cache:false,
          error:function(error){
              reject('error al consultar feature');
          },
          url: window.location.origin + window.location.pathname + "obtener_features",
          success:function(result){
              if (result.code == 200) {                       
                  resolve(result.data);
              }else{
                  reject(result.menssage);
              }
          }
        });                   
           
      });
      listPromise2.push(promise);

      Promise.all(listPromise2).then(function(response){

        var info = [];
        for (var z = 0; z < response[0].length; z++) {
          if (response[0][z].data !== null) {
            var info_capa = generarPopUp(response[0][z]);
            info.push(info_capa);
          }
        }

        content.innerHTML = info.join('') || '(Sin información.)';
        overlayPopUp.setPosition(evt.coordinate);


      }).catch(function(e){ 
        console.info(e);
      }); 


    }else{
      console.log("no hay informacion que mostrar.");
      //overlayPopUp.setPosition(evt.coordinate);
      //closer.blur();
    }
  }
});



//funcion para obtener una capa por su propiedad name
function obtenerLayerAtName(name){
  var mapLayers = mapObject.getLayers().getArray();
  var layer = null;
  mapLayers.forEach(function (layerItem, i) {
     if (layerItem.getProperties().name === name) {
        layer = layerItem;
     }
  });
  return layer;

}

//se utiliza para crear el html del popup con la informacion de las capas visibles
function generarPopUp(response){
  var info_capa = '';
  switch(response.capa){
    case 'culiacan':
      info_capa+= '<p class="m-0">Municipio '+response.data.nom_mun+'</p>';
      info_capa+= '<div class="container">'+
      '<div class="row"><div class="col">Municipio</div><div class="col">'+response.data.cve_mun+'</div></div>'+
      '<div class="row"><div class="col">Nombre</div><div class="col">'+response.data.nom_mun+'</div></div>'+
      '</div>'; 
      break;
    case 'manzanas':
      info_capa+= '<p class="m-0">Manzana '+response.data.dg_manz+'</p>';
      info_capa+= '<div class="container">'+
      '<div class="row"><div class="col">Municipio</div><div class="col">'+response.data.dg_mpio+'</div></div>'+
      '<div class="row"><div class="col">Población</div><div class="col">'+response.data.dg_pobl+'</div></div>'+
      '<div class="row"><div class="col">Cuartel</div><div class="col">'+response.data.dg_ctel+'</div></div>'+
      '<div class="row"><div class="col">Manzana</div><div class="col">'+response.data.dg_manz+'</div></div>'+
      '<div class="row"><div class="col">Zona</div><div class="col">'+response.data.dg_zona+'</div></div>'+
      '</div>';
      break;
    case 'cuarteles':
      info_capa+= '<p class="m-0">Cuartel '+response.data.dg_ctel+'</p>';
      info_capa+= '<div class="container">'+
      '<div class="row"><div class="col">Municipio</div><div class="col">'+response.data.dg_mpio+'</div></div>'+
      '<div class="row"><div class="col">Población</div><div class="col">'+response.data.dg_pobl+'</div></div>'+
      '<div class="row"><div class="col">Cuartel</div><div class="col">'+response.data.dg_ctel+'</div></div>'+
      '</div>';
      break;
    case 'Culiacan_Join':
      info_capa+= '<p class="m-0">Predio '+response.data.dg_ccat+'</p>';
      info_capa+= '<div class="container">'+
      '<div class="row"><div class="col">Municipio</div><div class="col">'+response.data.dg_mpio+'</div></div>'+
      '<div class="row"><div class="col">Población</div><div class="col">'+response.data.dg_pobl+'</div></div>'+
      '<div class="row"><div class="col">Cuartel</div><div class="col">'+response.data.dg_ctel+'</div></div>'+
      '<div class="row"><div class="col">Área</div><div class="col">'+response.data.area+'</div></div>'+
      '<div class="row"><div class="col">Valor Catastral</div><div class="col">'+response.data.val_catast+'</div></div>'+
      '<div class="row"><div class="col">Dirección</div><div class="col">'+response.data.dom_not+ ' ' + response.data.nom_col +'</div></div>'+
      '</div>';      
      break;
    default:
      break;
  }
  return info_capa;
}

function generarHtmlTablaContenido(map, datos){

  var oDivConte  = document.createElement('div');  
  oDivConte.classList = "row";
  oDivConte.style.margin = "10px";

  var oUlPrincipal  = document.createElement('ul');  
  oUlPrincipal.classList = "list-unstyled components w-100";
  oUlPrincipal.style.overflow = 'hidden';

  var oP  = document.createElement('p'); 
  oP.classList = "m-0";
  oP.style.fontWeight = 500;
  oP.style.color = 'rgba(0,0,0)';
  oP.style.fontSize = '21px';
  oP.style.padding = '10px';
  oP.innerHTML= 'Tabla de Contenidos';

  oDivConte.appendChild(oP);
  oDivConte.appendChild(oUlPrincipal);

  for (var i = 0; i < datos.length; i++) {

    var oLi1  = document.createElement('li');  

    var oA  = document.createElement('a'); 
    oA.setAttribute("href", '#' + datos[i].id);
    oA.setAttribute("data-toggle", 'collapse');
    oA.setAttribute("aria-expanded", 'false');
    oA.classList = "dropdown-toggle";
    oA.style.fontWeight = 500;
    oA.style.whiteSpace = 'normal';
    oA.innerHTML= datos[i].categoria;
    oLi1.appendChild(oA);


    var oUlSecundario  = document.createElement('ul');  
    oUlSecundario.classList = "collapse list-unstyled";
    oUlSecundario.setAttribute("id", datos[i].id);


    for (var y = 0; y < datos[i].elementos.length; y++) {

      var oLi2  = document.createElement('li');  

      var oDivContenedor  = document.createElement('div'); 
      oDivContenedor.classList = "row p-2 m-0";
      oDivContenedor.style.backgroundColor = 'white';

      var oDiv1  = document.createElement('div'); 
      oDiv1.classList = "col-2 col-md-2";

      var oButton  = document.createElement('button'); 
      oButton.classList = "btn btn-sm";
      oButton.setAttribute("data-toggle", 'collapse');
      oButton.setAttribute("href", '#' + datos[i].elementos[y].id_collapse);
      oButton.setAttribute("aria-expanded", 'false');
      oButton.style.backgroundColor = '#8e2919';


      var oI  = document.createElement('i'); 
      oI.classList = "fa fa-angle-down";
      oI.setAttribute("aria-hidden", 'true');
      oI.style.color = 'white';
      oButton.appendChild(oI);
      oDiv1.appendChild(oButton);
      oDivContenedor.appendChild(oDiv1);



      var oDiv2  = document.createElement('div'); 
      oDiv2.classList = "col-7 col-md-7 d-flex align-items-center";

      var oSpan  = document.createElement('span'); 
      oSpan.style.color = 'black'; 
      oSpan.style.fontWeight = 500;
      oSpan.innerHTML= datos[i].elementos[y].nombre;
      oDiv2.appendChild(oSpan);
      oDivContenedor.appendChild(oDiv2);



      var oDiv3  = document.createElement('div'); 
      oDiv3.classList = "col-3 col-md-3";


      var oInput  = document.createElement('input');
      oInput.setAttribute("id", datos[i].elementos[y].capa);
      oInput.setAttribute("type", 'checkbox');  
      oInput.setAttribute("data-toggle", 'toggle');
      oInput.setAttribute("data-onstyle", 'info');
      oInput.setAttribute("data-size", 'sm');
      oInput.setAttribute("data-on", '<i>');
      oInput.setAttribute("data-off", '<i>');

      if (datos[i].elementos[y].visible) {
        oInput.setAttribute("checked", 'true');
      }

      oDiv3.appendChild(oInput);
      oDivContenedor.appendChild(oDiv3);





      var oDiv4  = document.createElement('div'); 
      oDiv4.setAttribute("id", datos[i].elementos[y].id_collapse);
      oDiv4.classList = "container-fluid collapse";


      var oDiv5  = document.createElement('div'); 
      oDiv5.style.color = "black";
      //oDiv5.style.background = "lavender";
      oDiv5.style.marginTop = "15px";

      var oOpacidad  = document.createElement('span'); 
      oOpacidad.innerHTML= 'Opacidad';

      var oInput1  = document.createElement('input');
      oInput1.setAttribute("id", datos[i].elementos[y].capa + '|Opacidad');
      oInput1.setAttribute("type", 'range');  
      oInput1.setAttribute("min", '0');
      oInput1.setAttribute("max", '100');
      oInput1.setAttribute("value", '100');
      oInput1.style.width = '100%';
      oDiv5.appendChild(oOpacidad);
      oDiv5.appendChild(oInput1);




      var oSimbología  = document.createElement('span'); 
      oSimbología.innerHTML= 'Simbología';

      var oImg  = document.createElement('img');      
      oImg.style.margin = '5px 0';
      oImg.setAttribute("src", datos[i].elementos[y].url_simbologia);  
      oImg.style.display = 'block';
      oDiv5.appendChild(oSimbología);
      oDiv5.appendChild(oImg);


      oDiv4.appendChild(oDiv5);
      oDivContenedor.appendChild(oDiv4);

      oLi2.appendChild(oDivContenedor);
      oUlSecundario.appendChild(oLi2);


      //agregamos las capas al mapa principal
      if (datos[i].elementos[y].capa === 'osm' || datos[i].elementos[y].capa === 'terrain') {

        if (datos[i].elementos[y].capa === 'osm') {

          mapObject.addLayer(new ol.layer.Tile({
            visible: datos[i].elementos[y].visible,
            name: datos[i].elementos[y].capa,
            source: new ol.source.OSM()
          }));

        }else{

          mapObject.addLayer(new ol.layer.Tile({
            visible: datos[i].elementos[y].visible,
            name: datos[i].elementos[y].capa,
            source: new ol.source.Stamen({
              layer: datos[i].elementos[y].capa,
			  crossOrigin:'Anonymous'
            })
          }));

        }

      }else if (datos[i].elementos[y].capa === 'ortoWMS' ) {

        mapObject.addLayer(new ol.layer.Tile({
          visible: datos[i].elementos[y].visible,
          name: datos[i].elementos[y].capa,
          source: new ol.source.TileWMS({
            url: datos[i].elementos[y].url,
			crossOrigin:'Anonymous'
          })
        }));
        

      }else{
        mapObject.addLayer(new ol.layer.Tile({
          visible: datos[i].elementos[y].visible,
          name: datos[i].elementos[y].capa,
          source: new ol.source.TileWMS({
            url: datos[i].elementos[y].url,
            crossOrigin: 'anonymous'
          })
        }));
      }

    }

    oLi1.appendChild(oUlSecundario);
    oUlPrincipal.appendChild(oLi1);
  }

  $('#seccion_tabla_contenido').append(oDivConte);

}

function generarHtmlBusqueda(busqueda){

  if (arregloBusquedas[busqueda]) {
    $('#seccion_busqueda').empty();

    var oDiv1  = document.createElement('div');  
    oDiv1.classList = "row";
    oDiv1.style.margin = "10px";

    var oP1  = document.createElement('p'); 
    oP1.classList = "m-0";
    oP1.style.fontWeight = 500;
    oP1.style.color = 'rgba(0,0,0)';
    oP1.style.fontSize = '21px';
    oP1.style.padding = '10px';
    oP1.innerHTML= 'Resultados de la Búsqueda';
    oDiv1.appendChild(oP1);


    var oDiv2  = document.createElement('div');  
    oDiv2.classList = "row";
    oDiv2.style.margin = "10px";
    oDiv2.style.backgroundColor = 'white';

    var oP2  = document.createElement('p'); 
    oP2.classList = "m-0";
    oP2.style.fontWeight = 400;
    oP2.style.color = 'rgba(0,0,0)';
    oP2.style.fontSize = '16px';
    oP2.style.padding = '10px';
    oP2.innerHTML= 'Resultados: ' + arregloBusquedas[busqueda].total;
    oDiv2.appendChild(oP2);

    var oUlPrincipal  = document.createElement('ul');  
    oUlPrincipal.classList = "list-unstyled components w-100";
    oUlPrincipal.style.margin = "10px";

    if (arregloBusquedas[busqueda].data !== null) {

      for (var i = 0; i < arregloBusquedas[busqueda].data.length; i++) {

        var oLi1  = document.createElement('li');  
        oLi1.setAttribute("id", busqueda + '|' + i);
        oLi1.classList = 'mb-1';
        oLi1.style.paddingLeft = "10px";
        oLi1.style.paddingRight = "10px";
        oLi1.style.backgroundColor = "white";
        oLi1.style.cursor = "pointer";

        var oDiv3  = document.createElement('div');  
        oDiv3.classList = "row m-0 p-0";

        var oSpan1  = document.createElement('span'); 
        oSpan1.style.color = "black";
        oSpan1.style.fontSize = "12px";
        oSpan1.innerHTML= arregloBusquedas[busqueda].type;

        oDiv3.appendChild(oSpan1);
        
        if (arregloBusquedas[busqueda].data[i].municipio !== undefined) {
          var oSpan2  = document.createElement('span'); 
          oSpan2.style.color = "black";
          oSpan2.style.fontSize = "12px";
          oSpan2.style.position = "absolute";
          oSpan2.style.right = "10px";
          oSpan2.innerHTML= arregloBusquedas[busqueda].data[i].municipio;
          oDiv3.appendChild(oSpan2);
        }

        var oDiv4  = document.createElement('div');  
        oDiv4.classList = "row m-0 p-0";
        oDiv4.style.backgroundColor = "white";

        var dato;
        if (arregloBusquedas[busqueda].data[i].visualizar.indexOf('_') > -1){
           var dato1 = arregloBusquedas[busqueda].data[i].visualizar.split('_');
           dato = 'Cve. ' + dato1[1];
        }else{
          if (arregloBusquedas[busqueda].type === 'COLONIA') {
            dato = arregloBusquedas[busqueda].data[i].visualizar;
          }else{
            dato = 'Cve. ' + arregloBusquedas[busqueda].data[i].visualizar;
          }
        }

        var oP5  = document.createElement('p'); 
        oP5.classList = "m-0 p-0";
        oP5.style.fontWeight = 400;
        oP5.style.color = 'rgba(0,0,0)';
        oP5.style.fontSize = '16px';
        oP5.innerHTML= dato;
        oDiv4.appendChild(oP5);   

        oLi1.appendChild(oDiv3);
        oLi1.appendChild(oDiv4);
        oLi1.addEventListener("click", funcionResultadoBusquedaClick);
        oUlPrincipal.appendChild(oLi1);

      }

    }

    var oButton1  = document.createElement('button'); 
    oButton1.setAttribute("id", 'btnCerrarBusqueda');
    oButton1.setAttribute("type", 'button');
    oButton1.setAttribute("name", arregloBusquedas[busqueda].searchTerm);
    oButton1.classList = "btn btn-info btn_menu";
    oButton1.style.backgroundColor = '#f0f0f0';
    oButton1.style.color = '#000';
    oButton1.style.marginLeft = '10px';
    oButton1.style.marginTop = '10px';
    oButton1.style.marginBottom = '10px';
    oButton1.innerHTML= 'Cerrar';
    oButton1.addEventListener("click", funcionButtonMenuClick);


    $('#seccion_busqueda').append(oDiv1);
    $('#seccion_busqueda').append(oDiv2);
    $('#seccion_busqueda').append(oUlPrincipal);
    $('#seccion_busqueda').append(oButton1);

    AbrirMenu();
    $('.sidebar_seccion').hide();
    $('#seccion_busqueda').show();

  }
}

function imprimirPdf(url, name, params){

  var form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", url);
  form.setAttribute("target", name);


  for (var i in params) {
    if (params.hasOwnProperty(i)) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = i;
        input.value = params[i];
        form.appendChild(input);
    }
  }

  document.body.appendChild(form);
  window.open("", name);  
  form.submit();        
  document.body.removeChild(form);  

}


function generarHtmlConsultaPadron(datos){
  AbrirMenu();
  $('#seccion_consulta_padron').empty();
  if (datos.datos !== null) {

    var oContainer1  = document.createElement('div');  
    oContainer1.classList = "container";

    var oDiv1  = document.createElement('div');  
    oDiv1.classList = "row m-0 pt-3 pb-2";

    var oP1  = document.createElement('p'); 
    oP1.classList = "m-0";
    oP1.style.fontWeight = 500;
    oP1.style.color = 'rgba(0,0,0)';
    oP1.style.fontSize = '21px';
    oP1.innerHTML= 'Consulta a Padrón';
    oDiv1.appendChild(oP1);


    var oDiv3  = document.createElement('div'); 
    oDiv3.setAttribute("id", 'progressConsultaPadron'); 
    oDiv3.classList = "progress";
    oDiv3.style.display = 'none';

    var oDiv4  = document.createElement('div'); 
    oDiv4.setAttribute("role", 'progressbar');
    oDiv4.setAttribute("aria-valuenow", '75');   
    oDiv4.setAttribute("aria-valuemin", '0');
    oDiv4.setAttribute("aria-valuemax", '100');
    oDiv4.classList = "progress-bar progress-bar-striped progress-bar-animated";
    oDiv4.style.width = '100%';
    oDiv4.style.height = '8px';
    oDiv3.appendChild(oDiv4);
    oContainer1.appendChild(oDiv1);
    oContainer1.appendChild(oDiv3);


    //de aqui va el contenido de la seccion
    var oDiv2  = document.createElement('div');  
    oDiv2.classList = "row m-0 pt-2 pb-2";

    var oDivAccordion  = document.createElement('div');  
    oDivAccordion.setAttribute("id", 'accordion');
    oDivAccordion.style.width = '100%';

    //aqui empezaremos a recorrer los datos
    Object.entries(datos.datos).forEach( function (element){
      
      if (element[0] !== 'Geometry' ) {

        //aqui va ubicacion
        var oDivCard  = document.createElement('div');  
        oDivCard.classList = "card";
        oDivCard.style.cursor = 'pointer';

        const valor = element[0].toString().replace(/ /g, "");

        var oDiv20 = document.createElement('div');  
        oDiv20.classList = "card-header d-flex justify-content-between";
        oDiv20.setAttribute("id", valor + 'Card');
        oDiv20.setAttribute("data-toggle", 'collapse');
        oDiv20.setAttribute("data-target", '#collapse' + valor);
        oDiv20.setAttribute("aria-expanded", 'false');
        oDiv20.setAttribute("aria-controls", 'collapse' + valor);
        //oDiv20.style.cursor = 'pointer';

        var oSpan21 = document.createElement('span'); 
        oSpan21.classList = "text-left";
        oSpan21.style.color = '#000';
        oSpan21.innerHTML= element[0];


        var oI22 = document.createElement('i'); 
        oI22.classList = "fas fa-angle-down d-flex align-items-center";
        oI22.style.color = '#000';
        oI22.setAttribute("aria-hidden", 'true');
        oDiv20.appendChild(oSpan21);
        oDiv20.appendChild(oI22);
        oDivCard.appendChild(oDiv20);

        var oDiv23 = document.createElement('div');  
        oDiv23.classList = "collapse";
        oDiv23.setAttribute("id", 'collapse' + valor);
        oDiv23.setAttribute("aria-labelledby", valor + 'Card');
        oDiv23.setAttribute("data-parent", '#accordion');

        var oDiv24 = document.createElement('div');  
        oDiv24.classList = "card-body";
        oDiv24.style.color = '#000';


        var oTable25 = document.createElement('table'); 
        oTable25.classList = "table";
        oTable25.style.fontSize = '14px';

        var oTbody26 = document.createElement('tbody'); 

        if (element[1] !== null) {

          Object.entries(element[1]).forEach( function (element2){

            if (element[0] === 'Servicios') {
              var oTr = document.createElement('tr'); 

              var oTh = document.createElement('th'); 
              oTh.setAttribute("scope", 'row');
              oTh.style.borderTop = '3px solid #dee2e6';
              oTh.innerHTML= 'Grupo Servicio';

              var oTd = document.createElement('td'); 
              oTd.style.borderTop = '3px solid #dee2e6';
              oTd.innerHTML= element2[1].des_gpo_serv;

              oTr.appendChild(oTh);
              oTr.appendChild(oTd);


              var oTr2 = document.createElement('tr'); 

              var oTh2 = document.createElement('th'); 
              oTh2.setAttribute("scope", 'row');
              oTh2.style.borderTop = 'none';
              oTh2.style.padding = '0 0.75rem 0.75rem 0.75rem';
              oTh2.innerHTML= 'Tipo Servicio';

              var oTd2 = document.createElement('td'); 
              oTd2.style.borderTop = 'none';
              oTd2.style.padding = '0 0.75rem 0.75rem 0.75rem';
              oTd2.innerHTML= element2[1].des_serv;

              oTr2.appendChild(oTh2);
              oTr2.appendChild(oTd2);


              oTbody26.appendChild(oTr); 
              oTbody26.appendChild(oTr2); 

            }else if(element[0] === 'Construcciones'){

              Object.entries(element2[1]).forEach( function (element22){

                var oTr = document.createElement('tr'); 

                var oTh = document.createElement('th'); 
                oTh.setAttribute("scope", 'row');
                oTh.style.borderTop = 'none'; 
                oTh.style.padding = '0.45rem 0.75rem 0.45rem 0.75rem';
                oTh.innerHTML= element22[0];

                var oTd = document.createElement('td'); 
                oTd.style.borderTop = 'none';
                oTd.style.padding = '0.45rem 0.75rem 0.45rem 0.75rem';
                oTd.innerHTML= element22[1];

                oTr.appendChild(oTh);
                oTr.appendChild(oTd);

                oTbody26.appendChild(oTr); 


              });

              var oTr6 = document.createElement('tr'); 

              var oTh6 = document.createElement('th'); 
              oTh6.setAttribute("colspan", '2');
              oTh6.style.borderTop = 'none'; 

              var ohr = document.createElement('hr'); 
              ohr.style.borderTop = '4px solid rgba(0,0,0,.1)';
              oTh6.appendChild(ohr);
              oTr6.appendChild(oTh6);
              oTbody26.appendChild(oTr6);           

            }else{
           
              var oTr = document.createElement('tr'); 

              var oTh = document.createElement('th'); 
              oTh.setAttribute("scope", 'row');
              oTh.innerHTML= element2[0];

              var oTd = document.createElement('td'); 
              oTd.innerHTML= element2[1];

              oTr.appendChild(oTh);
              oTr.appendChild(oTd);


              oTbody26.appendChild(oTr);  
            }
          });            

        }else{

            var oTr = document.createElement('tr'); 
            var oTd = document.createElement('td'); 
            oTd.innerHTML= 'NO SE ENCONTRO INFORMACIÓN.';

            oTr.appendChild(oTd);
            oTbody26.appendChild(oTr);    
        }

        oTable25.appendChild(oTbody26);
        oDiv24.appendChild(oTable25);
        oDiv23.appendChild(oDiv24);
        oDivCard.appendChild(oDiv23);
        oDivAccordion.appendChild(oDivCard);
      }

    });

    oContainer1.appendChild(oDivAccordion);

    //aqui va lo del boton de exportar a pdf
    var oButton1  = document.createElement('button'); 
    oButton1.setAttribute("id", 'btnExportarConsultaPadron');
    oButton1.setAttribute("name", datos.coordenadas);
    oButton1.classList = "btn btn-sm btn-info";
    oButton1.innerHTML= 'Exportar a PDF';
    oButton1.addEventListener("click", funcionExportarConsultaPadronClick);
    oDiv2.appendChild(oButton1);
    oContainer1.appendChild(oDiv2);


    //aqui es lo del boton cerrar
    var oDiv6  = document.createElement('div');  
    oDiv6.classList = "row m-0 pt-2 pb-2";

    var oButton2  = document.createElement('button'); 
    oButton2.setAttribute("id", 'btnCloseConsultaPadron');
    oButton2.classList = "btn btn-sm btn-info";
    oButton2.innerHTML= 'Borrar Selección';
    oButton2.addEventListener("click", function (){
      datoConsultaPadron = {datos: null};
      sourceBusquedas.clear();
      generarHtmlConsultaPadron(datoConsultaPadron);
    });
    oDiv6.appendChild(oButton2);
    oContainer1.appendChild(oDiv6);

    $('#seccion_consulta_padron').append(oContainer1);
    pintarPoligonoPadron(datos.datos.Geometry);
  }else{

    var oContainer1  = document.createElement('div');  
    oContainer1.classList = "container";

    var oDiv1  = document.createElement('div');  
    oDiv1.classList = "row m-0 pt-3 pb-2";

    var oP1  = document.createElement('p'); 
    oP1.classList = "m-0";
    oP1.style.fontWeight = 500;
    oP1.style.color = 'rgba(0,0,0)';
    oP1.style.fontSize = '21px';
    oP1.innerHTML= 'Consulta a Padrón';
    oDiv1.appendChild(oP1);


    var oDiv3  = document.createElement('div'); 
    oDiv3.setAttribute("id", 'progressConsultaPadron'); 
    oDiv3.classList = "progress";
    oDiv3.style.display = 'none';

    var oDiv4  = document.createElement('div'); 
    oDiv4.setAttribute("role", 'progressbar');
    oDiv4.setAttribute("aria-valuenow", '75');   
    oDiv4.setAttribute("aria-valuemin", '0');
    oDiv4.setAttribute("aria-valuemax", '100');
    oDiv4.classList = "progress-bar progress-bar-striped progress-bar-animated";
    oDiv4.style.width = '100%';
    oDiv4.style.height = '8px';
    oDiv3.appendChild(oDiv4);



    var oDiv2  = document.createElement('div');  
    oDiv2.classList = "row m-0 pt-2 pb-2";

    var oP2  = document.createElement('p'); 
    oP2.classList = "m-0";
    oP2.style.fontWeight = 400;
    oP2.style.color = 'rgba(0,0,0)';
    oP2.style.fontSize = '18px';
    oP2.innerHTML= 'Seleccione un predio para obtener información...';
    oDiv2.appendChild(oP2);

    oContainer1.appendChild(oDiv1);
    oContainer1.appendChild(oDiv3);
    oContainer1.appendChild(oDiv2);

    $('#seccion_consulta_padron').append(oContainer1);
    sourceBusquedas.clear();
  }

}

function generarHtmlInspeccionarPadron(datos){
  AbrirMenu();
  $('#inspeccionar_padron').empty();
  if (datos.datos !== null) {

    /*var oContainer1  = document.createElement('div');  
    oContainer1.classList = "container";*/

    var oDiv1  = document.createElement('div');  
    oDiv1.classList = "row m-0 pt-3 pb-2";

    var oP1  = document.createElement('p'); 
    oP1.classList = "m-0";
    oP1.style.fontWeight = 500;
    oP1.style.color = 'rgba(0,0,0)';
    oP1.style.fontSize = '21px';
    oP1.innerHTML= 'Inspección a Padrón';
    oDiv1.appendChild(oP1);


    var oDiv3  = document.createElement('div'); 
    oDiv3.setAttribute("id", 'progressInspeccionarPadron'); 
    oDiv3.classList = "progress";
    oDiv3.style.display = 'none';

    var oDiv4  = document.createElement('div'); 
    oDiv4.setAttribute("role", 'progressbar');
    oDiv4.setAttribute("aria-valuenow", '75');   
    oDiv4.setAttribute("aria-valuemin", '0');
    oDiv4.setAttribute("aria-valuemax", '100');
    oDiv4.classList = "progress-bar progress-bar-striped progress-bar-animated";
    oDiv4.style.width = '100%';
    oDiv4.style.height = '8px';
    oDiv3.appendChild(oDiv4);
    /*oContainer1.appendChild(oDiv1);
    oContainer1.appendChild(oDiv3);*/
    $('#inspeccionar_padron').append(oDiv1);
    $('#inspeccionar_padron').append(oDiv3);




    //de aqui va el contenido de la seccion
    var oDiv2  = document.createElement('div');  
    oDiv2.classList = "row m-0 pt-2 pb-2";


    //aqui va lo del boton de exportar a pdf
    var oButton1  = document.createElement('button'); 
    oButton1.setAttribute("id", 'btnExportarInspeccionarPadron');
    oButton1.setAttribute("name", datos.coordenadas);
    oButton1.classList = "btn btn-sm btn-info";
    oButton1.innerHTML= 'Exportar a PDF';
    oButton1.addEventListener("click", funcionExportarInspeccionarPadronClick);
    oDiv2.appendChild(oButton1);
    /*oContainer1.appendChild(oDiv2);*/
    $('#inspeccionar_padron').append(oDiv2);


    //aqui es lo del boton cerrar
    var oDiv6  = document.createElement('div');  
    oDiv6.classList = "row m-0 pt-2 pb-2 d-flex justify-content-center";

    var oButton2  = document.createElement('button'); 
    oButton2.setAttribute("id", 'btnCloseInspeccionarPadron');
    oButton2.classList = "btn btn-sm btn-info d-flex justify-content-center";
    oButton2.innerHTML= 'Borrar Selección';
    oButton2.addEventListener("click", function (){
      datoInspeccionarPadron = {datos: null};
      sourceBusquedas.clear();
      generarHtmlInspeccionarPadron(datoInspeccionarPadron);
    });
    oDiv6.appendChild(oButton2);
    /*oContainer1.appendChild(oDiv6);*/
    $('#inspeccionar_padron').append(oDiv6);

    /*$('#inspeccionar_padron').append(oContainer1);*/
    pintarPoligonoPadron(datos.datos.geometry);
  }else{

    /*var oContainer1  = document.createElement('div');  
    oContainer1.classList = "container";*/

    var oDiv1  = document.createElement('div');  
    oDiv1.classList = "row m-0 pt-3 pb-2";

    var oP1  = document.createElement('p'); 
    oP1.classList = "m-0";
    oP1.style.fontWeight = 500;
    oP1.style.color = 'rgba(0,0,0)';
    oP1.style.fontSize = '21px';
    oP1.innerHTML= 'Inspección a Padrón';
    oDiv1.appendChild(oP1);


    var oDiv3  = document.createElement('div'); 
    oDiv3.setAttribute("id", 'progressInspeccionarPadron'); 
    oDiv3.classList = "progress";
    oDiv3.style.display = 'none';

    var oDiv4  = document.createElement('div'); 
    oDiv4.setAttribute("role", 'progressbar');
    oDiv4.setAttribute("aria-valuenow", '75');   
    oDiv4.setAttribute("aria-valuemin", '0');
    oDiv4.setAttribute("aria-valuemax", '100');
    oDiv4.classList = "progress-bar progress-bar-striped progress-bar-animated";
    oDiv4.style.width = '100%';
    oDiv4.style.height = '8px';
    oDiv3.appendChild(oDiv4);



    var oDiv2  = document.createElement('div');  
    oDiv2.classList = "row m-0 pt-2 pb-2";

    var oP2  = document.createElement('p'); 
    oP2.classList = "m-0";
    oP2.style.fontWeight = 400;
    oP2.style.color = 'rgba(0,0,0)';
    oP2.style.fontSize = '18px';
    oP2.innerHTML= 'Seleccione un predio para realizar la inspección...';
    oDiv2.appendChild(oP2);

    /*oContainer1.appendChild(oDiv1);
    oContainer1.appendChild(oDiv3);
    oContainer1.appendChild(oDiv2);

    $('#inspeccionar_padron').append(oContainer1); */

    $('#inspeccionar_padron').append(oDiv1);
    $('#inspeccionar_padron').append(oDiv3);
    $('#inspeccionar_padron').append(oDiv2);
    sourceBusquedas.clear();
  }

}


function pintarPoligonoBusquedas(geometria){

  sourceBusquedas.clear();

  var geometria = JSON.parse(geometria);//007020001040012001    007020001040

  var feature = new ol.Feature({
      geometry: new ol.geom.MultiPolygon(geometria.coordinates)
  });

  sourceBusquedas.addFeature(feature); 
  sourceSeleccion.addFeature(feature); 

  //acercar la pantalla hacia la geometria
  mapObject.getView().fit(feature.getGeometry().getExtent(), {padding: [170, 170, 170, 170]});

  /*mapObject.getView().animate({zoom: 19, duration: 250})  
  mapObject.getView().fit(feature.getGeometry().getExtent(), { duration: 1000});
  mapObject.getView().setZoom(19);*/


  setTimeout(function(){ 
    sourceSeleccion.removeFeature(feature);
  }, timeOut);

}

function pintarPoligonoPadron(geometria){

  sourceBusquedas.clear();

  var geometria = JSON.parse(geometria);//007020001040012001    007020001040

  var feature = new ol.Feature({
      geometry: new ol.geom.MultiPolygon(geometria.coordinates)
  });

  sourceBusquedas.addFeature(feature); 

  //acercar la pantalla hacia la geometria
  mapObject.getView().fit(feature.getGeometry().getExtent(), {padding: [170, 170, 170, 170]});
}

function exportarMapaPng(){

  //Crear la captura del mapa
  mapObject.once('rendercomplete', function () {

     html2canvas(document.querySelector('#mapa')).then(canvas => {
        if (navigator.msSaveBlob) {
          // link download attribuute does not work on MS browsers
          navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
        } else {
          var link = document.getElementById('image-download');
          link.href = canvas.toDataURL();
          link.click();
        }

      });
    
  });
  mapObject.renderSync(); 


  /*//Crear la captura del mapa
  mapObject.once('rendercomplete', function () {
    var mapCanvas = document.createElement('canvas');
    var size = mapObject.getSize();
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    var mapContext = mapCanvas.getContext('2d');

    Array.prototype.forEach.call(
      document.querySelectorAll('.ol-layer canvas'),
      function (canvas) {
          if (canvas.width > 0) {

            var opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            var transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            var matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );

            mapContext.drawImage(canvas, 0, 0);
          }
      }
    );

    if (navigator.msSaveBlob) {
      // link download attribuute does not work on MS browsers
      navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
    } else {
      var link = document.getElementById('image-download');
      link.href = mapCanvas.toDataURL();
      link.click();
    }
  });
  mapObject.renderSync();  */ 
}

//saber la posicion del usuario
geolocation.on('change', function () {
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
  mapObject.getView().setCenter(coordinates);
  mapObject.getView().animate({zoom: 19, duration: 250})  
});


geolocation.on('error', function (error) {
  console.log(error.message);
});



//herramientas de dibujo y medida
$('input:checkbox#checkSnap').change(
  function(){
    if ($(this).is(':checked')) {
      mapObject.addInteraction(herramientasInteracion);  
      mapObject.addInteraction(snapInteracion);  
      obtenerFituresSnap();

    }else{
      mapObject.removeInteraction(herramientasInteracion); 
      mapObject.removeInteraction(snapInteracion);  
      if (xhrObtenerFituresSnap !== null) {
        if (xhrObtenerFituresSnap.readyState !== 4) {//completado
          xhrObtenerFituresSnap.abort();
        }
      }
      vectorSnap.getSource().clear();
    }
  }
);

var funcionButtonHerramientasClick = function () {
  ExampleDraw.reset();
  switch($(this).attr('id')){
      //dibujo
      case 'btnPunto': //selectedHerramienta
        if( $(this).hasClass('selectedHerramienta')){
           $('button.btn_herramientas').removeClass('selectedHerramienta');
           estaHerramientaActiva = false;
        }else{
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          $(this).addClass('selectedHerramienta');
          ExampleDraw.setActive('Point');
          estaHerramientaActiva = true;
        }
        break;
      case 'btnCirculo':
        if( $(this).hasClass('selectedHerramienta')){
           $('button.btn_herramientas').removeClass('selectedHerramienta');
           estaHerramientaActiva = false;
        }else{
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          $(this).addClass('selectedHerramienta');
          ExampleDraw.setActive('Circle');
          estaHerramientaActiva = true;
        }
        break;
      case 'btnLinea':
        if( $(this).hasClass('selectedHerramienta')){
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          estaHerramientaActiva = false;
        }else{
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          $(this).addClass('selectedHerramienta');
          ExampleDraw.setActive('LineString');
          estaHerramientaActiva = true;
        }
        break;
      case 'btnPoligono':
        if( $(this).hasClass('selectedHerramienta')){
            $('button.btn_herramientas').removeClass('selectedHerramienta');
            estaHerramientaActiva = false;
        }else{
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          $(this).addClass('selectedHerramienta');
          ExampleDraw.setActive('Polygon');
          estaHerramientaActiva = true;
        }
        break;
      //medida
      case 'btnLongitud':
        if( $(this).hasClass('selectedHerramienta')){
           $('button.btn_herramientas').removeClass('selectedHerramienta');
           estaHerramientaActiva = false;
        }else{
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          $(this).addClass('selectedHerramienta');
          ExampleDraw.setActive('Longitud');
          estaHerramientaActiva = true;
        }
        break;
      case 'btnArea':
        if( $(this).hasClass('selectedHerramienta')){
           $('button.btn_herramientas').removeClass('selectedHerramienta');
           estaHerramientaActiva = false;
        }else{
          $('button.btn_herramientas').removeClass('selectedHerramienta');
          $(this).addClass('selectedHerramienta');
          ExampleDraw.setActive('Area');
          estaHerramientaActiva = true;
        }
        break;
      //otras
      case 'btnLimpiarCapaDibujo':
        $('button.btn_herramientas').removeClass('selectedHerramienta');
        estaHerramientaActiva = false;
        mapObject.getOverlays().clear()
        mapObject.addOverlay(overlayPopUp);        
        vectorHerramientas.getSource().clear();
        break;
      default:
        break;

   }
  
}
//evento click para los butones del menu lateral
$('button.btn_herramientas').on('click', funcionButtonHerramientasClick);




//herramientas de dibujo
var drawActual = null;
$(document).on('keyup', function (e) {
  if ($('#seccion_inspeccionar_padron').is(':visible')){
    
    if (e.key === 'Delete' || e.keyCode === 46) {
      if (drawActual !== null) {
        drawActual.removeLastPoint();
      }
    }  

  } 
});
var ExampleDraw = {
  init: function () {
    mapObject.addInteraction(this.Point);
    this.Point.setActive(false);
    mapObject.addInteraction(this.LineString);
    this.LineString.setActive(false);
    mapObject.addInteraction(this.Polygon);
    this.Polygon.setActive(false);
    mapObject.addInteraction(this.Circle);
    this.Circle.setActive(false);
    mapObject.addInteraction(this.Longitud);
    this.Longitud.setActive(false);
    mapObject.addInteraction(this.Area);
    this.Area.setActive(false);
  },
  reset: function (){
    this.Point.setActive(false);
    this.LineString.setActive(false);
    this.Polygon.setActive(false);
    this.Circle.setActive(false);
    this.Longitud.setActive(false);
    this.Area.setActive(false);
    drawActual = null;
  },
  Point: new ol.interaction.Draw({
    source: vectorHerramientas.getSource(),
    type: 'Point',
  }),
  LineString: new ol.interaction.Draw({
    source: vectorHerramientas.getSource(),
    type: 'LineString',
  }),
  Polygon: new ol.interaction.Draw({
    source: vectorHerramientas.getSource(),
    type: 'Polygon',
  }),
  Circle: new ol.interaction.Draw({
    source: vectorHerramientas.getSource(),
    type: 'Circle',
  }),
  Longitud: new ol.interaction.Draw({
    source: vectorHerramientas.getSource(),
    type: 'LineString',
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(125, 125, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    }),
  }),
  Area: new ol.interaction.Draw({
    source: vectorHerramientas.getSource(),
    type: 'Polygon',
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(125, 125, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    }),
  }),
  setActive: function (type) {
    if (type === 'Longitud' || type === 'Area') {
      createMeasureTooltip();

      var listener;
      this[type].on('drawstart', function (evt) {
        sketch = evt.feature;

        var tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt) {
          var geom = evt.target;
          var output;
          if (geom instanceof ol.geom.Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof ol.geom.LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          measureTooltipElement.innerHTML = output;
          measureTooltip.setPosition(tooltipCoord);
        });
      });

      this[type].on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
      });
    }
    this[type].setActive(true); //Point  LineString Polygon Circle
    drawActual = this[type];
    this.activeType = type;  
    
  },

};
ExampleDraw.init();


//herramientas de medida
var sketch;
var measureTooltipElement;
var measureTooltip;

var formatLength = function (line) {
  var length = ol.sphere.getLength(line);
  var output;
  /*if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {*/
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  //}
  return output;
};

var formatArea = function (polygon) {
  var area = ol.sphere.getArea(polygon);
  var output;
  /*if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {*/
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
  //}
  return output;
};


function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  mapObject.addOverlay(measureTooltip);
}




//funcionalidad de snap
var xhrObtenerFituresSnap = null;
mapObject.on('moveend', function(e) {
  if (xhrObtenerFituresSnap !== null) {
    if (xhrObtenerFituresSnap.readyState !== 4) {//completado
      xhrObtenerFituresSnap.abort();
    }
  }
  obtenerFituresSnap();
});

function  obtenerFituresSnap(){

  if ($('input:checkbox#checkSnap').is(':checked')) {

    $('#progressHerramientas').show();

    const scale = 96 * mapObject.getView().getResolution() / 2.54 * 100;
    const limites_ventana = mapObject.getView().calculateExtent(mapObject.getSize());


    const e = limites_ventana[0], nn = limites_ventana[1], ii = limites_ventana[2], rr = limites_ventana[3];
    const x = [e, nn, e, rr, ii, rr, ii, nn, e, nn];

    const poligon = new ol.geom.Polygon(x, 'XY', [x.length]);
    var geojson = new ol.format.GeoJSON().writeGeometryObject(poligon, {
        dataProjection: proj_32613
    });

    geojson.crs = {
        type: "name",
        properties: {
            name: proj_32613
        }
    }

    var listPromise2 = [];
    var promise = new Promise(function(resolve, reject) {

      xhrObtenerFituresSnap = jQuery.ajax({
        type:'POST',
        data: { geometry: JSON.stringify(geojson), scale: scale},
        cache:false,
        error:function(error){
            reject(error);
        },
        url: window.location.origin + window.location.pathname + "obtener_features_snap",
        success:function(result){
            if (result.code == 200) {                       
                resolve(result.data);
            }else{
                reject(result.menssage);
            }
        }
      });                   
         
    });
    listPromise2.push(promise);

    Promise.all(listPromise2).then(function(response){
        const datos = response[0];
        vectorSnap.getSource().clear();

        for (var i = 0; i < datos.length; i++) {

          if (datos[i].data !== null) {
            for (var y = 0; y < datos[i].data.length; y++) {
             
              var geometria = JSON.parse(JSON.stringify(datos[i].data[y].geometry));

              var geometria3 = JSON.parse(geometria);

              var feature = new ol.Feature({
                  geometry: new ol.geom.MultiPolygon(geometria3.coordinates)
              });

              vectorSnap.getSource().addFeature(feature); 

            }
          }         
        } 
        $('#progressHerramientas').hide();
    }).catch(function(e){ 
      if (e.statusText) {
        if (e.statusText === 'abort') {

        }else{
          vectorSnap.getSource().clear();
          $('#progressHerramientas').hide();
        }
      }else{
        vectorSnap.getSource().clear();
        $('#progressHerramientas').hide();
      }
    }); 
  }else{
    $('#progressHerramientas').hide();
  }
}

