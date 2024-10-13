const path = require('path');
const config = require(path.join(__dirname, '/Config'));
const escapee = require('pg-escape');
const request = require("request-promise");
const { exec } = require("child_process");
const { spawn } = require("child_process");
let fs = require('fs');

const express = require('express');
const router = express.Router();


var jsreport = require('jsreport')({ 
	allowLocalFilesAccess: true,
	reportTimeout: 60000,
	extensions: {
	  base: {
	    url: config.getPathProyect()	 
	  } 
	},
	logger:{
		silent: true
	}
});
let jsReportInitialized = false;
//jsreport.init();

const postgres = require("pg");
const config_postgres = config.getConfigPostgres(); 


//obtener la fecha
const dateTime = require('node-datetime');	
const { strictEqual } = require('assert');

/*
	// crear un inddex en la tabla que contiene una columna de goemtria
	CREATE INDEX manzanas_geomx ON manzanas USING GIST ( geom );
	CREATE INDEX construccion_geomx ON construccion USING GIST ( geom );
	CREATE INDEX Culiacan_Join_geomx ON "Culiacan_Join" USING GIST ( geom );
	CREATE INDEX colonias_geomx ON colonias USING GIST ( geom );

	CREATE INDEX culiacan_geomx ON culiacan USING GIST ( geom );
	CREATE INDEX urbano_geomx ON urbano USING GIST ( geom );
	CREATE INDEX cuarteles_geomx ON cuarteles USING GIST ( geom );
	CREATE INDEX usos_suelo_geomx ON usos_suelo USING GIST ( geom );
	CREATE INDEX valor_catastral_geomx ON valor_catastral USING GIST ( geom );
	CREATE INDEX zona_valor_geomx ON zona_valor USING GIST ( geom );
	CREATE INDEX laboratorio_valores_geomx ON laboratorio_valores USING GIST ( geom );
	CREATE INDEX vias_comunicacion_geomx ON vias_comunicacion USING GIST ( geom );
	CREATE INDEX hidrografia_geomx ON hidrografia USING GIST ( geom );
	CREATE INDEX uso_suelo_vegetacion_geomx ON uso_suelo_vegetacion USING GIST ( geom );
	vacuum verbose;

	SELECT * FROM geometry_columns;
*/
//uglify-js

router.get('/',(req,res) => {
	req.session.id_usuario = null;
	req.session.permisoPdf = 0; 
	req.session.inicioSesion = false;
	req.session.save();

	var mensageError = '';
	if (req.query.error) {
		switch(req.query.error){
			case '0':
				mensageError = 'El Usuario no existe.';
				break;
			case '2':
				mensageError = 'La contraseña es incorrecta.';
				break;
			case '3':
				mensageError = 'Ocurrio un error al intentar iniciar sesión.';
				break;
			case '4':
				mensageError = 'Se necesita proporcionar correo y contraseña.';
				break;
		}
	}	
  	res.render('login', { error: mensageError});
}); 

router.post('/check',(req,res) => {

	(async () => {	//pdf-creator-node  pdfkit  jsreport
		if (req.body.correo && req.body.pass) {

			try {				

				var options = {
			        uri: "http://127.0.0.1/api/auth.php?user="+req.body.correo+"&password="+req.body.pass+"",
			        method: "GET"
			    }

				resultEncode = await request(options);

				var result = JSON.parse(resultEncode);				

				if (result) {
					if(result.status === 1){			
					
						req.session.id_usuario = result.data[0].id;
						req.session.permisoPdf = result.data[0].privilegio_visor; 
						req.session.inicioSesion = true;
						req.session.save();

						res.writeHead(302, {
						  'Location': '/visor'
						});
						res.end();

					}else{
						res.writeHead(302, {
						  'Location': '/?error=' + result.status
						});
						res.end();
					}
				}else{
					res.writeHead(302, {
					  'Location': '/?error=3'
					});
					res.end();					
				}										

			} catch(e) {
				res.json({"code" : 101, "menssage" : e.message});				
			}

		}else{
			res.writeHead(302, {
			  'Location': '/?error=4'
			});
			res.end();			
		}		
	})();	
});

router.get('/visor',(req,res) => {
	if (req.session.inicioSesion) {
		res.render('visor', {permisoExportPdf: req.session.permisoPdf});
	}else{
		res.writeHead(302, {
		  'Location': '/'
		});
		res.end();
	}
});

router.get('/visor/obtener_features',(req,res) => { 
	(async () => {

		if (req.session.inicioSesion) {

			if (req.query.LAYERS && req.query.p1) {
				//instancia de la base de datos
				var db= new postgres.Pool(config_postgres);
				try {
					var client = await db.connect();
					var resultado = [];
					for (var i = 0; i < req.query.LAYERS.length; i++) {

						//si no existe la tabla en posgres no hacer la consulta.
						var query1 = escapee("SELECT to_regclass('"+req.query.LAYERS[i]+"');");
						var result1 = await client.query(query1);
						if (result1 !== null) {

							var query = null;
							switch(req.query.LAYERS[i]){
								case 'culiacan':
									query = escapee('SELECT dg_mpio, nom_mun FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'urbano':
									query = escapee('SELECT id FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'colonias':
									query = escapee('SELECT dg_mpio, nombre FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'cuarteles':
									query = escapee('SELECT dg_mpio, dg_pobl, dg_ctel FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'manzanas':
									query = escapee('SELECT dg_mpio, dg_pobl, dg_ctel, dg_manz, dg_zona FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'Culiacan_Join':
									query = escapee('SELECT dg_mpio, dg_pobl, dg_ctel, dg_manz, dg_pred, dg_unid, nom_comp_t, ubi_pred, nom_col FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'construccion':
									query = escapee('SELECT "construccion".dg_mpio, "construccion".dg_pobl, "construccion".dg_ctel, "construccion".dg_manz, "construccion".dg_pred, "construccion".dg_unid, "Culiacan_Join".nom_comp_t, "Culiacan_Join".ubi_pred, "Culiacan_Join".nom_col, "construccion".sc, "construccion".v_terr FROM "%s"'+
										' INNER JOIN "Culiacan_Join" ON "construccion".dg_ccat = "Culiacan_Join".dg_ccat '+
										' WHERE '+
										'	st_contains('+
										'		"construccion".geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'usos_suelo':
									query = escapee('SELECT dg_cat, cve_gpo_us, '+
										'CASE cve_gpo_us '+
										'WHEN \'A\' THEN \'Baldios\'   '+ 
										'WHEN \'B\' THEN \'Habitación\'   '+
										'WHEN \'C\' THEN \'Comercio\'   '+
										'WHEN \'D\' THEN \'Edificios Publicos\'  '+
										'WHEN \'E\' THEN \'Escuelas\'  '+
										'WHEN \'F\' THEN \'Parques y Deportes\'  '+
										'WHEN \'G\' THEN \'Industria\'  '+
										'WHEN \'H\' THEN \'Iglesias\' END uso '+
										'FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'valor_catastral':
									query = escapee('SELECT dg_cat, val_catast FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'zona_valor':
									query = escapee('SELECT dg_mpio, dg_pobl, dg_zona, desc_zona, valor FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'laboratorio_valores':
									query = escapee('SELECT dg_zona, desc_zona, valor FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								case 'uso_suelo_vegetacion':
									query = escapee('SELECT descripcio FROM "%s"'+
										' WHERE '+
										'	st_contains('+
										'		geom,'+
										'		ST_GeomFromText(\'POINT(%s)\',32613)'+
									')', req.query.LAYERS[i], req.query.p1);
									break;
								default:
									query = null;
									break;
							}

							if (query !== null) {

								var result = await client.query(query);

								if (result.rows.length > 0) {
									resultado.push({"capa" : req.query.LAYERS[i], "data" : result.rows[0]});
								}else{
									resultado.push({"capa" : req.query.LAYERS[i], "data" : null});
								}	
							}else{
								resultado.push({"capa" : req.query.LAYERS[i], "data" : null});
							}						
						}
						
					}

					res.json({"code" : 200, "data" : resultado});
				    client.release();

				} catch(e) {
					res.json({"code" : 101, "menssage" : e.message});	
					console.log(e.message)			
				}finally{
					if (db)	db.end();			
				}	
				//res.json({"code" : 200, "data" : []});
			}else{
				res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
			}	

		}else{
			/*res.writeHead(302, {
			  'Location': '/'
			});
			res.end();*/
			res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}	

	})();											
});

router.get('/visor/busquedas',(req,res) => { 
	(async () => {
		if (req.session.inicioSesion) {
		
			if (req.query.buscar && req.query.tipo_busqueda) {
				//instancia de la base de datos
				var db= new postgres.Pool(config_postgres);
				try {
					yearConvert = parseInt(req.query.buscar)
					if(Number.isInteger(yearConvert)){

						switch(req.query.tipo_busqueda){
							case "1": //Año							
								var client = await db.connect();

								var query = escapee("SELECT tablename, '"+req.query.buscar+"' AS clave, '"+req.query.buscar+"' AS visualizar FROM pg_catalog.pg_tables where tablename = 'zonas_aridas_" + req.query.buscar + "';");

								var result = await client.query(query);
								if (result.rows.length == 0) { //0
									var resultado = {"searchTerm": req.query.buscar, "total": result.rows.length, "type": 'AÑO', "data": result.rows};
									res.json({"code" : 200, "data" : resultado});

								}else{
									var resultado = {"searchTerm": req.query.buscar, "total": result.rows.length, "type": 'AÑO', "data": null};
									res.json({"code" : 200, "data" : resultado});
								}

								client.release();													
								break;
							default:
								res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
								break;

						}
					}else{
						var resultado = {"searchTerm": req.query.buscar, "total": 0, "type": 'AÑO', "data": null};
						res.json({"code" : 200, "data" : resultado});
					}

				} catch(e) {
					res.json({"code" : 101, "menssage" : e.message});				
				}finally{
					if (db)	db.end();			
				}	
			}else{
				res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
			}

		}else{
			res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}			
			

	})();											
});

router.get('/visor/tablaContenido',(req,res) => { 
	(async () => {
		if (req.session.inicioSesion) {
			var tablaContenido1 = [];
			
			//Mapa Base
			tablaContenido1.push({
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
				  }
				]
			});

			//instancia de la base de datos
			var db= new postgres.Pool(config_postgres);
			try {
				var client = await db.connect();
				var resultado = [];

				//si no existe la tabla en posgres no hacer la consulta.
				var query1 = escapee("SELECT tablename FROM pg_catalog.pg_tables where tablename like 'zonas_aridas_%';");
				var result1 = await client.query(query1);

				if (result1.rows.length > 0) {

					for (var i = 0; i < result1.rows.length; i++) {
						var table = result1.rows[i].tablename;						
   						var arrayDeCadenas = table.split('_');
						   var year = arrayDeCadenas[2];

						var object = {}
						object.categoria = year
						object.id = 'pageSubMenu' + year

						var SubCategoriasArray = [];

						for (var k = 0; k <= 6; k++) { //categorias siempre las mismas
							var categoria = {};
							var elementosArray = [];
							if(k == 0){
								categoria.name = 'SubMenuVulnerabilidad'
								categoria.subCategoria = 'Vulnerabilidad'
								categoria.id_sub_categoria = 'SubMenuVulnerabilidad' + year

								var item = {};
								item.nombre = 'Zonas Áridas ' + year
								item.id_collapse = 'collapse' + table
								item.capa = table
								item.id_opacidad = table + '|Opacidad'
								item.visible = false
								item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:'+table+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
								item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:'+table+'&STYLE=za_zonas_aridas'
								item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zonas_aridas:'+table+'&maxFeatures=50&outputFormat=SHAPE-ZIP'

								
								elementosArray.push(item);

							}else if(k == 1){ //5 variables


								categoria.name = 'SubMenuVariables'
								categoria.subCategoria = 'Variables'
								categoria.id_sub_categoria = 'SubMenuVariables' + year

								for (var j = 0; j < 5; j++) {
									var item = {};
									if(j == 0){
										item.nombre = 'Precipitación ' + year
										item.id_collapse = 'collapsevar_precipitacion_' + year
										item.capa = 'var_precipitacion_' + year
										item.id_opacidad = 'var_precipitacion_' + year + '|Opacidad'
										item.visible = false
										item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:var_precipitacion_'+year+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
										item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:var_precipitacion_'+year+'&STYLE=za_1precipitacion'
										item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zonas_aridas:var_precipitacion_'+year+'&maxFeatures=50&outputFormat=SHAPE-ZIP'
								
									}else if(j == 1){
										item.nombre = 'Evapotranspiración ' + year
										item.id_collapse = 'collapsevar_evapotranspiracion_' + year
										item.capa = 'var_evapotranspiracion_' + year
										item.id_opacidad = 'var_evapotranspiracion_' + year + '|Opacidad'
										item.visible = false
										item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:var_evapotranspiracion_'+year+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
										item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:var_evapotranspiracion_'+year+'&STYLE=za_4evapotranspiracion'
										item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zonas_aridas:var_evapotranspiracion_'+year+'&maxFeatures=50&outputFormat=SHAPE-ZIP'

									}else if(j == 2){
										item.nombre = 'Humedad ' + year
										item.id_collapse = 'collapsevar_humedad_' + year
										item.capa = 'var_humedad_' + year
										item.id_opacidad = 'var_humedad_' + year + '|Opacidad'
										item.visible = false
										item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:var_humedad_'+year+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
										item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:var_humedad_'+year+'&STYLE=za_5humedad'
										item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zonas_aridas:var_humedad_'+year+'&maxFeatures=50&outputFormat=SHAPE-ZIP'

									}else if(j == 3){
										item.nombre = 'Temperatura ' + year
										item.id_collapse = 'collapsevar_temperatura_' + year
										item.capa = 'var_temperatura_' + year
										item.id_opacidad = 'var_temperatura_' + year + '|Opacidad'
										item.visible = false
										item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:var_temperatura_'+year+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
										item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:var_temperatura_'+year+'&STYLE=za_2temperatura'
										item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zonas_aridas:var_temperatura_'+year+'&maxFeatures=50&outputFormat=SHAPE-ZIP'

									}else{
										item.nombre = 'Indice De Vegetación ' + year
										item.id_collapse = 'collapsevar_indiceDeVegetacion_' + year
										item.capa = 'var_indiceDeVegetacion_' + year
										item.id_opacidad = 'var_indiceDeVegetacion_' + year + '|Opacidad'
										item.visible = false
										item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:var_indicedevegetacion_'+year+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
										item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:var_indicedevegetacion_'+year+'&STYLE=za_3ndvi'
										item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zonas_aridas:var_indicedevegetacion_'+year+'&maxFeatures=50&outputFormat=SHAPE-ZIP'

									}
									elementosArray.push(item);
								}

							}else if(k == 2){
								categoria.name = 'SubMenuIndicadoresAridez'
								categoria.subCategoria = 'Indicadores de aridez'
								categoria.id_sub_categoria = 'SubMenuIndicadoresAridez' + year
							}else if(k == 3){
								categoria.name = 'SubMenuIndicadoresRegionesHidraulicas'
								categoria.subCategoria = 'Indicadores a nivel de regiones hidrológicas'
								categoria.id_sub_categoria = 'SubMenuIndicadoresRegionesHidraulicas' + year
							}else if(k == 4){
								categoria.name = 'SubMenuIndicadoresEstatal'
								categoria.subCategoria = 'Indicadores a nivel estatal'
								categoria.id_sub_categoria = 'SubMenuIndicadoresEstatal' + year
							}else if(k == 5){
								categoria.name = 'SubMenuIndicadoresMunicipal'
								categoria.subCategoria = 'Indicadores a nivel municipal'
								categoria.id_sub_categoria = 'SubMenuIndicadoresMunicipal' + year
								
							}else if(k == 6){						
								categoria.name = 'SubMenuIndicadoresUsyv'
								categoria.subCategoria = 'Indicadores a nivel uso suelo y vegetación'
								categoria.id_sub_categoria = 'SubMenuIndicadoresUsyv' + year
							}


							categoria.elementos = elementosArray	
							SubCategoriasArray.push(categoria)
						}
						object.subCategorias = SubCategoriasArray
						tablaContenido1.push(object)
					}
				}				
				client.release();

			} catch(e) {
				res.json({"code" : 101, "menssage" : e.message});	
				console.log(e.message)			
			}finally{
				if (db)	db.end();			
			}	

			
			//limites
			tablaContenido1.push({
				categoria: 'Límites', 
				id: 'pageSubMenuMapasBase', 
				elementos: [
				  {
					nombre: 'Límite Municipal', 
					id_collapse: 'collapseculiacan', 
					capa: 'limite_municipal', 
					id_opacidad: 'culiacan|Opacidad', 
					visible: false, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:b_municipios&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:b_municipios&STYLE=A_municipios'
				  
				  },
				  {
					nombre: 'Límite Estatal', 
					id_collapse: 'collapselimiteEstatal_geo', 
					capa: 'limiteEstatal_geo', 
					id_opacidad: 'limiteEstatal_geo|Opacidad', 
					visible: true, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:limiteEstatal_geo&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:limiteEstatal_geo&STYLE=za_limite_estatal'
				  
				  },
				  {
					nombre: 'Límite Estatal Noroeste', 
					id_collapse: 'collapselimiteEstatalNoroeste_geo', 
					capa: 'limiteEstatalNoroeste_geo', 
					id_opacidad: 'limiteEstatalNoroeste_geo|Opacidad', 
					visible: true, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:b_estados_noroeste&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:b_estados_noroeste&STYLE=za_limite_noroeste'
				  
				  },
				  {
					nombre: 'Regiones Hidrológico Administrativas', 
					id_collapse: 'collapsRegionesHidAdm', 
					capa: 'RegionesHidAdm', 
					id_opacidad: 'RegionesHidAdm|Opacidad', 
					visible: false, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:b_regionesHidAdm&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:b_regionesHidAdm&STYLE=za_cuencas'
				  
				  },
				]
			});

			//inegi
			tablaContenido1.push({
				categoria: 'INEGI', 
				id: 'pageSubMenuINEGI', 
				elementos: [
				  {
					nombre: 'Vías de Comunicación', 
					id_collapse: 'collapseViasComunicacion', 
					capa: 'vias_comunicacion', 
					id_opacidad: 'vias_comunicacion|Opacidad', 
					visible: false, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:vias_comunicacion&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:vias_comunicacion&STYLE=C_vias_comunicacion'
				  },
				  {
					nombre: 'Hidrografía', 
					id_collapse: 'collapsehidrografia', 
					capa: 'hidrografia', 
					id_opacidad: 'hidrografia|Opacidad', 
					visible: false, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=zonas_aridas:hidrografia&request=GetMap&version=1.1.0&srs=EPSG:32613&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:hidrografia&STYLE=C_hidrografia'
				  },
				  {
					nombre: 'Uso de Suelo y Vegetación', 
					id_collapse: 'collapseUsoSueloVegetacion', 
					capa: 'uso_suelo_vegetacion', 
					id_opacidad: 'uso_suelo_vegetacion|Opacidad', 
					visible: false, 
					url: 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/wms?service=WMS&layers=zonas_aridas:usyv7&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png',
					url_simbologia: 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=zonas_aridas:uso_suelo_vegetacion&STYLE=za_usyv'
				  }/*,
				  
				  {
					nombre: 'DENUE', 
					id_collapse: 'collapseDENUE', 
					capa: 'denue', 
					id_opacidad: 'denue|Opacidad', 
					visible: false, 
					url: 'http://geoservervte.sinaloa.gob.mx/geoserver/ices/wms?service=WMS&version=1.1.0&request=GetMap&layers=ices:Denue2019&srs=EPSG:6372&format=image/png',
					url_simbologia: 'http://geoservervte.sinaloa.gob.mx/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=ices:Denue2019&'
				  }*/
				]
			});


			//instancia de la base de datos tendencial
			var db2= new postgres.Pool(config_postgres);
			try {
				var client2 = await db2.connect();

				//si no existe la tabla en posgres no hacer la consulta.
				query1 = escapee("SELECT tablename FROM pg_catalog.pg_tables where tablename like 'tend_zonas_aridas_%';");
				result1 = await client2.query(query1);

				var object1 = {}
				object1.categoria = 'Mapas de tendencia'
				object1.id = 'pageSubMenuMapaTendencia'				
				var years = [];

				if (result1.rows.length > 0) {					

					for (var i = 0; i < result1.rows.length; i++) {
						table = result1.rows[i].tablename;						
						arrayDeCadenas = table.split('_');
						year = arrayDeCadenas[3];

						object = {}
						object.year = year
						object.id = 'tend_pageSubMenu' + year

						SubCategoriasArray = [];

						for (k = 0; k <= 6; k++) { //categorias siempre las mismas
							categoria = {};
							elementosArray = [];
							if(k == 0){
								categoria.name = 'SubMenuTendencia'
								categoria.subCategoria = 'Tendencia'
								categoria.id_sub_categoria = 'SubMenuTendencia' + year

								item = {};
								item.nombre = 'Zonas Áridas al ' + year
								item.id_collapse = 'collapse' + table
								item.capa = table
								item.id_opacidad = table + '|Opacidad'
								item.visible = false
								item.url = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WMS&layers=tend_zonas_aridas:'+table+'&request=GetMap&version=1.1.0&srs=EPSG:6372&format=image/png'
								item.url_simbologia = 'http://'+config.getServidorGeoserver()+'/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tend_zonas_aridas:'+table+'&STYLE=za_zonas_aridas'
								item.url_descarga = 'http://'+config.getServidorGeoserver()+'/geoserver/zonas_aridas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tend_zonas_aridas:'+table+'&maxFeatures=50&outputFormat=SHAPE-ZIP'


								elementosArray.push(item);

							}else if(k == 1){ //5 variables					

							}else if(k == 2){
								categoria.name = 'SubMenuIndicadoresAridezTendencia'
								categoria.subCategoria = 'Indicadores de aridez'
								categoria.id_sub_categoria = 'SubMenuIndicadoresAridezTendencia' + year
							}else if(k == 3){
								categoria.name = 'SubMenuIndicadoresRegionesHidraulicasTendencia'
								categoria.subCategoria = 'Indicadores a nivel de regiones hidrológicas'
								categoria.id_sub_categoria = 'SubMenuIndicadoresRegionesHidraulicasTendencia' + year
							}else if(k == 4){
								categoria.name = 'SubMenuIndicadoresEstatalTendencia'
								categoria.subCategoria = 'Indicadores a nivel estatal'
								categoria.id_sub_categoria = 'SubMenuIndicadoresEstatalTendencia' + year
							}else if(k == 5){
								categoria.name = 'SubMenuIndicadoresMunicipalTendencia'
								categoria.subCategoria = 'Indicadores a nivel municipal'
								categoria.id_sub_categoria = 'SubMenuIndicadoresMunicipalTendencia' + year
								
							}else if(k == 6){						
								categoria.name = 'SubMenuIndicadoresUsyvTendencia'
								categoria.subCategoria = 'Indicadores a nivel uso suelo y vegetación'
								categoria.id_sub_categoria = 'SubMenuIndicadoresUsyvTendencia' + year
							}


							categoria.elementos = elementosArray	
							SubCategoriasArray.push(categoria)
						}
						object.subCategorias = SubCategoriasArray
						years.push(object)
					}					
				}	
				object1.elementos = years
				tablaContenido1.push(object1)			
				client2.release();

			} catch(e) {
				res.json({"code" : 101, "menssage" : e.message});	
				console.log(e.message)			
			}finally{
				if (db2)	db2.end();			
			}	

			
			res.json({"code" : 200, "data" : tablaContenido1});
		   
		}else{
			res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}			
			

	})();											
});

router.post('/visor/iniciarProcesamiento',(req,res) => { 
	(async () => {
		if (req.session.inicioSesion) {

			if (req.body.year) {
				
				try {
					yearConvert = parseInt(req.body.year)
					if(Number.isInteger(yearConvert)){

						//instancia de la base de datos
						var db= new postgres.Pool(config_postgres);
						var client = await db.connect();

						//si no existe la tabla en posgres no hacer la consulta.
						var query1 = escapee("SELECT tablename, '"+req.body.year+"' AS clave, '"+req.body.year+"' AS visualizar FROM pg_catalog.pg_tables where tablename = 'zonas_aridas_" + String(yearConvert) + "';");
						var result1 = await client.query(query1);

						if (result1.rows.length == 0) { //0

							const ls = spawn(''+config.getPathProyectPython()+'config.bat &&' + ' python '+config.getPathProyectPython()+'main.py', [String(yearConvert)], {shell: true});
							
							ls.stdout.on("data", data => {
								console.log(`stdout: ${data}`);
							});							
							
							res.json({"code" : 200, "data" : "El año se esta procesado...."});	
							
						}else{
							res.json({"code" : 200, "data" : "El año ya esta procesado."});
						}				
						client.release();
						
					}else{
						res.json({"code" : 101, "menssage" : "Error los parametros no son correctos."});
					}

					} catch(e) {
						res.json({"code" : 101, "menssage" : e.message});	
						console.log(e.message)			
					}finally{
						if (db)	db.end();			
					}	
			}else{
				res.json({"code" : 101, "menssage" : "Error los parametros no son correctos."});
			}
		   
		}else{
			res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}			
			

	})();											
});

router.post('/visor/iniciarMapaTendencial',(req,res) => { 
	(async () => {
		if (req.session.inicioSesion) {

			if (req.body.year) {
				
				try {
					yearConvert = parseInt(req.body.year)
					if(Number.isInteger(yearConvert)){

						//instancia de la base de datos
						var db= new postgres.Pool(config_postgres);
						var client = await db.connect();

						//si no existe la tabla en posgres no hacer la consulta.
						var query1 = escapee("SELECT tablename, '"+req.body.year+"' AS clave, '"+req.body.year+"' AS visualizar FROM pg_catalog.pg_tables where tablename = 'tend_zonas_aridas_" + String(yearConvert) + "';");
						var result1 = await client.query(query1);

						if (result1.rows.length == 0) { //0

							const ls = spawn(''+config.getPathProyectPython()+'config.bat &&' + ' python '+config.getPathProyectPython()+'tendencia.py', [String(yearConvert)], {shell: true});
							
							ls.stdout.on("data", data => {
								console.log(`stdout: ${data}`);
							});
							
							res.json({"code" : 200, "data" : "El año se esta procesado...."});	
							
						}else{
							res.json({"code" : 200, "data" : "El año ya esta procesado."});
						}				
						client.release();
						
					}else{
						res.json({"code" : 101, "menssage" : "Error los parametros no son correctos."});
					}

					} catch(e) {
						res.json({"code" : 101, "menssage" : e.message});	
						console.log(e.message)			
					}finally{
						if (db)	db.end();			
					}	
			}else{
				res.json({"code" : 101, "menssage" : "Error los parametros no son correctos."});
			}
		   
		}else{
			res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}			
			

	})();											
});

router.post('/visor/generar_pdf_indicadores_nivel_estatal', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								REGIONES ÁRIDAS A NIVEL ESTATAL
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'src/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_estados_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresnivelestatal.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_aridez', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
					`<div id="encabezado">
							<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
							<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
				
					<p class="text-center">
								<strong>
								SISTEMA DE APOYO A LA TOMA <BR>
								DE DECISIONES ESPACIAL WEB<BR>
								</strong>
							</p>  
							<p class="text-center">
								<strong>
								MONITOREO DE ZONAS ÁRIDAS
								</strong>
							</p>
							
							<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
							<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
							
						</div>
						<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								REGIONES ÁRIDAS NOROESTE DE MÉXICO
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'src/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_indicador_aridez_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresaridez.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_regiones_hidrologicas', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								REGIONES ÁRIDAS A NIVEL REGION HIDROLÓGICO ADMINISTRATIVO
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'src/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_cuencas_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresregioneshidraulicas.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_municipal', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								REGIONES ÁRIDAS A NIVEL MUNICIPAL
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'src/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_municipios_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ A NIVEL MUNICIPAL (SUPERFICIES EN km2)
								
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresmunicipal.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_usyv', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								REGIONES ÁRIDAS A NIVEL USO DE SUELO Y VEGETACIÓN
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'src/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_usyv_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE USOS DE SUELO Y VEGETACIÓN (SUPERFICIES EN KM2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresusyv.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

//tendencia pdfs
router.post('/visor/generar_pdf_indicadores_nivel_estatal_tendencia', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								MAPA DE TENDENCIA DE REGIONES ÁRIDAS A NIVEL ESTATAL AL AÑO `+req.body.year+`
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'tendencia/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_estados_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresnivelestataltendencia.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_aridez_tendencia', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
					`<div id="encabezado">
							<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
							<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
				
					<p class="text-center">
								<strong>
								SISTEMA DE APOYO A LA TOMA <BR>
								DE DECISIONES ESPACIAL WEB<BR>
								</strong>
							</p>  
							<p class="text-center">
								<strong>
								MONITOREO DE ZONAS ÁRIDAS
								</strong>
							</p>
							
							<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
							<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
							
						</div>
						<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								MAPA DE TENDENCIA DE REGIONES ÁRIDAS NOROESTE DE MÉXICO AL AÑO `+req.body.year+`
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'tendencia/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_indicador_aridez_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresarideztendencia.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_regiones_hidrologicas_tendencia', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								MAPA DE TENDENCIA DE REGIONES ÁRIDAS A NIVEL REGION HIDROLÓGICO ADMINISTRATIVO AL AÑO `+req.body.year+`
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'tendencia/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_cuencas_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresregioneshidraulicastendencia.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_municipal_tendencia', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								MAPA DE TENDENCIA DE REGIONES ÁRIDAS A NIVEL MUNICIPAL AL AÑO `+req.body.year+`
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'tendencia/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_municipios_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE ARIDEZ A NIVEL MUNICIPAL (SUPERFICIES EN km2)
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresmunicipaltendencia.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

router.post('/visor/generar_pdf_indicadores_usyv_tendencia', (req,res) => { 
	(async () => {  //pdf-creator-node  pdfkit  jsreport

		if (req.session.inicioSesion) {

		if (req.body.mapa && req.body.year) {

			var content_pdf = `
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<link rel="stylesheet" type="text/css" href="servidor/css/bootstrap.css">                  
						<style>

							body{
							font-family: "Times New Roman", Times, serif;
							}

							p{
							font-size: 12px;
							}

							strong{
							font-size: 12px;
							}

							#encabezado p{
							font-size: 15px;
							}

							#encabezado strong{
							font-size: 15px;
							}

							#predio p{
							font-size: 15px;
							}

							#predio strong{
							font-size: 15px;
							}

						.table td, .table th {
							border-top: none!important;
							padding: 0!important;
						}

						.table caption {
						text-align: left;
						background: #000;
						}
						</style>
						</head>
						<body>`;

			content_pdf += 
						`<div id="encabezado">
								<img height="95px" width="75px" src="client/recursos/img/logo_v.png" style="position: absolute; top: 0;">
								<img height="60px" width="85px" src="client/recursos/img/uas.png" style="position: absolute; top: 10px; left: 80px;">
					
						<p class="text-center">
									<strong>
									SISTEMA DE APOYO A LA TOMA <BR>
									DE DECISIONES ESPACIAL WEB<BR>
									</strong>
								</p>  
								<p class="text-center">
									<strong>
									MONITOREO DE ZONAS ÁRIDAS
									</strong>
								</p>
								
								<img height="70px" width="85px" src="client/recursos/img/fact.png" style="position: absolute; top: 0; right: 10px;">
								<img height="70px" width="70px" src="client/recursos/img/facite.png" style="position: absolute; top: 0; right: 90px;">
								
							</div>
							<hr>`;


			//MAPA <div style="page-break-before: always;"></div>
			content_pdf +=`
					<div id="mapa">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								MAPA DE TENDENCIA DE REGIONES ÁRIDAS A NIVEL USO DE SUELO Y VEGETACIÓN AL AÑO `+req.body.year+`
								</strong>
							</p>

							<div class="text-center">    
							<img src="`+req.body.mapa+`" >
							</div>
						</div>`;

			let archivo = fs.readFileSync(config.getPathProyectPython()+'tendencia/data/evaluacion_multicriterio/'+req.body.year+'/crosstab_usyv_'+req.body.year+'.html', 'utf-8');

			content_pdf +=`
					<div id="table">
							<p class="text-center" style="margin: 10px 0 10px 0;">
								<strong>
								INDICADORES CUANTITATIVOS DE USOS DE SUELO Y VEGETACIÓN (SUPERFICIES EN KM2)
								
								</strong>
							</p>

							<div class="text-center">    
								`+archivo+`
							</div>
						</div>`;
						
			content_pdf +=`
						</body>
					</html>`;


			checkIfJsReportIsInit().then(() => {
				jsreport.render({
					template: {
						content: content_pdf,              
						engine: 'handlebars',
						recipe: 'chrome-pdf', //html  chrone-pdf
						chrome: {
						scale: 1,
						displayHeaderFooter: true,
							format: 'Letter', //Letter
							printBackground: true,
							marginTop: '8mm',
							marginRight: '8mm',
							marginBottom: '4mm',
							marginLeft: '8mm'
						}
					}
				}).then((out)  => {
					var filename = "indicadoresusyvtendencia.pdf";          
					res.setHeader('Content-Disposition', 'inline; filename=' + filename); ////attachment
					res.setHeader('Content-type', 'application/pdf');
					out.stream.pipe(res);
				});
			});     
					
		}else{
			res.json({"code" : 101, "menssage" : "LOS PARAMETROS NO SON CORRECTOS."});
		} 

		}else{
		//res.redirect('/login');  
		res.json({"code" : 101, "menssage" : "Se necesita iniciar sesión."});
		}
	})(); 
});

async function checkIfJsReportIsInit() {
	if( !jsReportInitialized ) {
		jsReportInitialized = true;
		return await jsreport.init();
	}
	return Promise.resolve();
}

module.exports = router;