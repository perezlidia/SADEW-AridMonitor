# SADEW-AridMonitor
> [!NOTE]
> SADEW (for its acronym in Spanish: Sistema de Apoyo a la toma de Decisiones Espacial Web).
>
> SADEW is a geotechnical web platform to support spatial decision-making for the monitoring of arid zones in Northwest Mexico, which can show the retrospective, actual, and prospective behavior of these regions, applying a series of computational tools and data integration methods, which can be scalable at regional, national and global levels.
> 
Aridity, a climatic phenomenon, affects both the environment and society by causing water scarcity and hindering the development of vegetation through the lack of moisture in the soil and air.
The aridity index is the most common method for classifying arid regions, which calculates the relationship between precipitation and evapotranspiration. As the index decreases, the region becomes more arid, and we can classify them as:
>
● **Hyper-arid:** These regions have an annual precipitation of less than 100 mm. They are the driest regions on the planet, with little or no vegetation and extreme water scarcity.

● **Arid:** Their annual precipitation is between 100 and 250 mm. They have very little vegetation, and their climate is dry during most of the year.

● **Semi-arid:** They receive an annual rainfall between 250 and 500 mm. These regions receive more rain than arid areas, allowing limited vegetation, such as grasslands and shrubs. 

● **Dry sub-humid:** They receive an annual precipitation between 500 and 700 mm. These regions have a more humid climate than semi-arid areas but still experience periodic droughts. 

● **Humid:** These are regions that receive more than 700 mm annual precipitation, where there is greater humidity. Therefore, the soil types are suitable for denser and more diverse vegetation.

In Mexico, more than half of the territory is covered by arid and semi-arid regions and these conditions result from various environmental factors (low precipitation, high temperatures and evaporation, climate change, soil degradation, extreme weather phenomena) and human actions (deforestation, overexploitation of water resources, intensive agriculture and poor agricultural practices, urban sprawl, fuel burning, water and soil pollution).

We developed a Web Spatial Decision Support System (SADEW) that focuses on monitoring arid regions of Northwest Mexico at the Administrative Hydrological level. The aim of this system is to evaluate, observe, and analyze the environmental conditions of arid and semi-arid zones, providing detailed and timely data on the state of aridity. This tool is key to supporting the sustainable management of these ecosystems, providing valuable information that facilitates decision-making and strategic planning in the conservation and management of natural resources. 

This project is an integral part of an Environmental Monitoring Program that is being developed in collaboration with researchers from the [Universidad Autónoma de Sinaloa](www.uas.edu.mx).

The development of SADEW required the integration of a series of computational and technical tools to identify arid regions in the past, present, and future through a web geoportal such as a web server, map server, database server, programming language, geographic information systems libraries, and web development tools, based mainly on client-server technology. Besides requiring an external data source, such as satellite images from remote sensors.

This project contains the data necessary to reproduce the Geo visualizer. The project implements the Geo visualizer in Python. The input datasets for processing are Temperature, which is obtained from [USGS Earth Explorer](https://earthexplorer.usgs.gov/), Precipitation, Potential Evapotranspiration, Humidity from [TerraClimate](https://app.climateengine.org/climateEngine), Slopes, Aspect generated from digital elevation model by [SRTM](https://srtm.csi.cgiar.org) 

>To develop this project, [specialized software](https://github.com/perezlidia/SADEW-AridMonitor?tab=readme-ov-file#software-requirement) was necessary.

## Software requirement
> [!WARNING]
> It may be necessary to have the exact same version stipulated in the description.
> 
Hardware required for full system installation: Windows PC; Software requirements: [QGIS 2.8](https://qgis.org/download/) or higher, [Postgres10](https://www.postgresql.org/download/), . [Python 2](https://www.python.org/downloads/release/python-272/), [Python 3](https://www.python.org/downloads/), [Terrset](https://clarklabs.org/download/),  [ArcGIS 9.3](https://arcgis.software.informer.com/9.3/) or higher, [Geoserver](https://geoserver.org/download/); Complements: Extension de [Seleniun IDE](https://chromewebstore.google.com/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd?hl=es), [NodeJS](https://nodejs.org/en/download/package-manager), [PostGIS 2.5](https://postgis.net/2018/09/PostGIS-2.5.0/), [ArcPy](https://pro.arcgis.com/es/pro-app/latest/arcpy/get-started/installing-arcpy.htm), [PyQGIS](https://qgis.org/pyqgis/master/), [GDAL](https://gdal.org/en/latest/download.html), [Idrisi32](https://idrisi32.software.informer.com), [Apache](https://httpd.apache.org/download.cgi), [Geoserver-rest](https://docs.geoserver.org/stable/en/user/rest/), [Redis](https://redis.io/downloads/)), JavaScript, [Bower](https://bower.io/), [Bootstrap](https://getbootstrap.com/)

Scripts can be found in the scripts directory.

## Installing packages

**Create the main folder of the project**

The first thing to do is to create a main folder in the root directory, which will contain all the project files
>
**Essential npm Commands**

**Installing all dependencies**
> 
In the folder that was created, npm should be executed. 
**npm** manages downloads of dependencies of project. If a project has a package.json file, by running it will install everything the project needs, in the node_modules folder, creating it if it's not existing already
> 
```
npm install
```
To uninstall npm packages use the following command:
```
Uninstalling npm
```

The init command is used to initialize a project. When you run this command, it creates a package.json file. When you run npm init, you will be asked to provide the project name, license type, version, and other data.
```
npm start
```
To update an npm ar package to its latest version use the following command
```
npm update
```
When you want to stop and restart a project the following command is used:
```
npm restart
```
When you want to start a package when needed use:
```
npm start
```
When you want to stop a package from running use:
```
npm stop
```
When you want to see the current version of npm installed on your computer run:
```
npm version
```


**Updating packages**

Updating is also made easy, by running. npm will check all packages for a newer version
```
npm update
```
**Running Tasks**
The package.json file supports a format for specifying command line tasks that can be run

```
npm run dev
```
**npm Managing Applications**
```
pm2 stop     
pm2 restart  
pm2 delete
```

**Production process manager**
Managing apps is straightforward:
pm2 is a tool that manages processes for Node.js applications. Its main function is to ensure that applications are always active, reload them without interrupting their operation, and help with common system administration tasks.
```
npm install -g pm2
```

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

**Replace project folder**

Once the main folder is created, the next step is to replace all the files in the arid_zones_web folder that are available in this repository and the arid_zones_processing folder is in the same path as the arid_zones_web folder

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

