# SADEW-AridMonitor
> [!NOTE]
> SADEW (for its acronym in Spanish: Sistema de Apoyo a la toma de Decisiones Espacial Web).
> 
Aridity, a climatic phenomenon, affects both the environment and society by causing water scarcity and hindering the development of vegetation through the lack of moisture in the soil and air.
The aridity index is the most common method for classifying arid regions, which calculates the relationship between precipitation and evapotranspiration. As the index decreases, the region becomes more arid, and we can classify them as:
>
● Hyper-arid: These regions have an annual precipitation of less than 100 mm. They are the driest regions on the planet, with little or no vegetation and extreme water scarcity.

● Arid: Their annual precipitation is between 100 and 250 mm. They have very little vegetation, and their climate is dry during most of the year.

● Semi-arid: They receive an annual rainfall between 250 and 500 mm. These regions receive more rain than arid areas, allowing limited vegetation, such as grasslands and shrubs. 

● Dry sub-humid: They receive an annual precipitation between 500 and 700 mm. These regions have a more humid climate than semi-arid areas but still experience periodic droughts. 

● Humid: These are regions that receive more than 700 mm annual precipitation, where there is greater humidity. Therefore, the soil types are suitable for denser and more diverse vegetation.

In Mexico, more than half of the territory is covered by arid and semi-arid regions and these conditions result from various environmental factors (low precipitation, high temperatures and evaporation, climate change, soil degradation, extreme weather phenomena) and human actions (deforestation, overexploitation of water resources, intensive agriculture and poor agricultural practices, urban sprawl, fuel burning, water and soil pollution).

We developed a Web Spatial Decision Support System (SADEW) that focuses on monitoring arid regions of Northwest Mexico at the Administrative Hydrological level. The aim of this system is to evaluate, observe, and analyze the environmental conditions of arid and semi-arid zones, providing detailed and timely data on the state of aridity. This tool is key to supporting the sustainable management of these ecosystems, providing valuable information that facilitates decision-making and strategic planning in the conservation and management of natural resources. 

This project is an integral part of an Environmental Monitoring Program that is being developed in collaboration with researchers from the Universidad Autónoma de Sinaloa with support from the Consejo Nacional de Humanidades, Ciencias y Tecnologías (CONAHCYT).

The development of SADEW required the integration of a series of computational and technical tools to identify arid regions in the past, present, and future through a web geoportal such as a web server, map server, database server, programming language, geographic information systems libraries, and web development tools, based mainly on client-server technology. Besides requiring an external data source, such as satellite images from remote sensors.

This project contains the data necessary to reproduce the Geo visualizer. The project implements the Geo visualizer in Python. The input datasets for processing are Temperature, which is obtained from USGS Earth Explorer (https://earthexplorer.usgs.gov/), Precipitation, Potential Evapotranspiration, Humidity from TerraClimate (https://app.climateengine.org/climateEngine), Slopes, Aspect generated from digital elevation model by SRTM (https://srtm.csi.cgiar.org). 

>To develop this project, [specialized software](https://github.com/perezlidia/SADEW-AridMonitor?tab=readme-ov-file#software-requirement) was necessary.

## Software requirement

Hardware required for full system installation: Windows PC; Software requirements: [QGIS 2.8]((https://qgis.org/download/)) or higher, [Postgres10]((https://www.postgresql.org/download/)) , Python 2., Python 3, Terrset, ArcGIS 9.3 or higher, Geoserver; Complements: Extension de Seleniun IDE, NodeJS,  PostGIS 2.5, ArcPy, PyQGIS, GDAL, Idrisi32, Apache, Geoserver-rest, Nodejs, Redis, JavaScript, Bower, Bootstrap

> [!WARNING]
> It may be necessary to have the exact same version stipulated in the description.

QGIS:
[Download](https://qgis.org/download/). Postgres10 [Download](https://www.postgresql.org/download/). Python 2 [Download](https://www.python.org/downloads/release/python-272/). Python 3 [Download](https://www.python.org/downloads/).

Terrset
[Download](https://clarklabs.org/download/).

ArcGIS 9.3
[Download](https://arcgis.software.informer.com/9.3/).

Geoserver
[Download](https://geoserver.org/download/).

Seleniun IDE
[Download](https://chromewebstore.google.com/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd?hl=es).

NodeJS
[Download](https://nodejs.org/en/download/package-manager).

PostGIS 2.5
[Download](https://postgis.net/2018/09/PostGIS-2.5.0/).

ArcPy
[Download](https://pro.arcgis.com/es/pro-app/latest/arcpy/get-started/installing-arcpy.htm).

PyQGIS
[Download](https://qgis.org/pyqgis/master/).

GDAL
[Download](https://gdal.org/en/latest/download.html).

Idrisi32
[Download](https://idrisi32.software.informer.com).

Apache
[Download](https://httpd.apache.org/download.cgi).

Nodejs
[Download](https://nodejs.org/en/download/package-manager).

Redis
[Download](https://redis.io/downloads/).


> [!WARNING]
> Project Dependencies.

Instalar PM2 globalmente en el sistema.

```
npm install -g pm2
```

Dentro de la consola del del proyecto.

```
npm init
```

```
npm install ol
```

```
npm install --save-dev parcel-bundler
```

```
npm run build
```

Para Excell

```
python -m pip install xlrd==2.0.1 #excel
```

```
python -m pip install xlwt==1.3.0 #excel
```

```
python -m pip install selenium==3.141.0
```

## Page Visualization

![img3](https://github.com/user-attachments/assets/c492bd7c-0070-405b-8938-9c624403d28d)

## Standardized Variable Samples

Among the options, we will be able to analyze the mapping of the diverse standardized variables that are used for modeling and generating arid zones.

![img4](https://github.com/user-attachments/assets/2b52c1f3-dce6-486c-8b6b-64325818cab3)

SADEW is a geotechnical web platform to support spatial decision-making for the monitoring of arid zones in Northwest Mexico, which can show the retrospective, actual, and prospective behavior of these regions, applying a series of computational tools and data integration methods, which can be scalable at regional, national and global levels.
## Contributors

Lidia Yadira Perez Aguilar.
lidiaperez@uas.edu.mx

Ramon Fernando Lopez Osorio.
ferrlop@uas.edu.mx 

Wenseslao Plata Rocha.
wenses@uas.edu.mx 

Sergio Alberto Monjadin Armenta.
sa.monjardin12@info.uas.edu.mx 

## Contact me

Hello! I'm Lidia Yadira Perez Aguilar, Developer at SADEW. You can contact me through the following means:

email: [lidiaperez@uas.edu.mx](lidiaperez@uas.edu.mx)

