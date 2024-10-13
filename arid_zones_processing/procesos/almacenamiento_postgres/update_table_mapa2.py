import os
import subprocess
import sys

if __name__ == '__main__':
	db_name = sys.argv[1]
	db_host = sys.argv[2]
	db_user = sys.argv[3]
	db_password = sys.argv[4]
	year = sys.argv[5]
	directorioPosgrest = sys.argv[6]

	# Set pg password environment variable - others can be included in the statement
	#psql.exe -d zonas_aridas -U postgres -w postgres -c 
	os.environ['PGPASSWORD'] = db_password 

	sql1 = "UPDATE tend_zonas_aridas_"+year+" SET tipo_region = 'Fondo' WHERE rec_num = 1;UPDATE tend_zonas_aridas_"+year+" SET tipo_region = 'Hiperarido' WHERE rec_num = 2;UPDATE tend_zonas_aridas_"+year+" SET tipo_region = 'Arido' WHERE rec_num = 3;UPDATE tend_zonas_aridas_"+year+" SET tipo_region = 'Semiarido' WHERE rec_num = 4;UPDATE tend_zonas_aridas_"+year+" SET tipo_region = 'Sub Humedo Seco' WHERE rec_num = 5;UPDATE tend_zonas_aridas_"+year+" SET tipo_region = 'Humedo' WHERE rec_num = 6;"
	cmd1 = '"' + directorioPosgrest + 'psql"' +' -U '+db_user+' -d '+db_name+' -h '+db_host+' -p 5432 -c "'+sql1+'"'

	subprocess.call(cmd1, shell=True)

	
	
