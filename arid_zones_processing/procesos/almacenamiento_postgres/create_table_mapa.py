import os
import subprocess
import sys

if __name__ == '__main__':
	tipo = sys.argv[1]
	db_name = sys.argv[2]
	db_host = sys.argv[3]
	db_user = sys.argv[4]
	db_password = sys.argv[5]
	dir_image = sys.argv[6]
	year = sys.argv[7]
	directorioPosgrest = sys.argv[8]

	# Set pg password environment variable - others can be included in the statement
	os.environ['PGPASSWORD'] = db_password 

	if tipo == "evaluacion_multicriterio":
		#cmd = '"C:/Program Files/PostgreSQL/10/bin/shp2pgsql" -I -s 4326 {} zonas_aridas_{} | "C:/Program Files/PostgreSQL/10/bin/psql" -U {} -d {} -h {}'.format(dir_image, year, db_user,db_name,db_host)
		cmd = '"' + directorioPosgrest + 'shp2pgsql"' + ' -I -s 4326 '+dir_image+' tend_zonas_aridas_'+year+' | "' + directorioPosgrest + 'psql"' +' -U '+db_user+' -d '+db_name+' -h '+db_host+''
	elif tipo == "ESTADOS":	
		#cmd = '"C:/Program Files/PostgreSQL/10/bin/shp2pgsql" -I -s 4326 {} zonas_aridas_estados_{} | "C:/Program Files/PostgreSQL/10/bin/psql" -U {} -d {} -h {}'.format(dir_image, year, db_user,db_name,db_host)
		cmd = '"' + directorioPosgrest + 'shp2pgsql"' + ' -I -s 4326 '+dir_image+' tend_zonas_aridas_estados_'+year+' | "' + directorioPosgrest + 'psql"' +' -U '+db_user+' -d '+db_name+' -h '+db_host+''
	else:
		# Build command string
		#cmd = '"C:/Program Files/PostgreSQL/10/bin/raster2pgsql" -I -s 4326 {} var_{}_{} | "C:/Program Files/PostgreSQL/10/bin/psql" -U {} -d {} -h {}'.format(dir_image,tipo,year, db_user,db_name,db_host)
		#cmd = '"C:/Program Files/PostgreSQL/10/bin/shp2pgsql" -I -s 4326 {} var_{}_{} | "C:/Program Files/PostgreSQL/10/bin/psql" -U {} -d {} -h {}'.format(dir_image,tipo,year, db_user,db_name,db_host)
		cmd = '"' + directorioPosgrest + 'shp2pgsql"' + ' -I -s 4326 '+dir_image+' tend_var_'+tipo+'_'+year+' | "' + directorioPosgrest + 'psql"' +' -U '+db_user+' -d '+db_name+' -h '+db_host+''
	subprocess.call(cmd, shell=True)
	
