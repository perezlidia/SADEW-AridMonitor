import sys, os
import shutil


if __name__ == '__main__':
	mapa = sys.argv[1]
	path = sys.argv[2]
	pathConnectGeoServer = sys.argv[3]
	pathMappingGeoServer = sys.argv[4]
	prYearActual = sys.argv[5]

	dirPrincipal = path + "/src/data/subir_geoserver/"+ prYearActual + "/"
	inputConfig = mapa + ".xml"	

	if not os.path.exists(dirPrincipal):
		os.mkdir(dirPrincipal)

	if not os.path.exists(dirPrincipal + inputConfig):
		file = open(dirPrincipal + inputConfig, "w")
		file.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
		file.write('<!DOCTYPE ImageMosaicJDBCConfig [\n')
		file.write('	<!ENTITY mapping PUBLIC "mapping"  "'+pathMappingGeoServer+'">\n')
		file.write('	<!ENTITY connect PUBLIC "connect"  "'+pathConnectGeoServer+'">\n')
		file.write(']>\n')
		file.write('\n')
		file.write('<config version="1.0">\n')
		file.write('	<coverageName name="'+mapa+'"/>\n')
		file.write('	<coordsys name="EPSG:4326"/>\n')
		file.write('	<scaleop  interpolation="1"/>\n')
		file.write('	<axisOrder ignore="false"/>\n')
		file.write('		&mapping;\n')
		file.write('		&connect;\n')
		file.write('</config>\n')		
		file.close()