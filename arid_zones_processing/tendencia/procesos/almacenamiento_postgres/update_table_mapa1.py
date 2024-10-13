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
 	sql = "ALTER TABLE tend_zonas_aridas_"+year+" ADD COLUMN tipo_region VARCHAR;"
	cmd = '"' + directorioPosgrest + 'psql"' +' -U '+db_user+' -d '+db_name+' -h '+db_host+' -p 5432 -c "'+sql+'"'

	subprocess.call(cmd, shell=True)

	
	
