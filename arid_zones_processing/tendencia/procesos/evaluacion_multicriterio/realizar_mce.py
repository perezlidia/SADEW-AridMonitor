import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	factores = sys.argv[1]
	factore_pesos = sys.argv[2]
	prYearActual = sys.argv[3]
	path = sys.argv[4]
	directorioAREARst = sys.argv[5]

	arrayFactores = factores.split(',')
	arrayPesos = factore_pesos.split(',')

	if  not os.path.exists(path + "/tendencia/data/evaluacion_multicriterio/"):
		os.mkdir(path + "/tendencia/data/evaluacion_multicriterio/")

	if  not os.path.exists(path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual ):
		os.mkdir(path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual)


	dirPrincipal = path + "\\tendencia\\data\\evaluacion_multicriterio\\"+ prYearActual + "\\"

	inputConfig = "conf_mce_" + prYearActual + ".dsf"	
	outputImageName = "mce_" + prYearActual + ".rst"
	outputImageNce =dirPrincipal + outputImageName


	print(outputImageNce)
	if not os.path.exists(outputImageNce):

		if not os.path.exists(dirPrincipal + inputConfig):
			file = open(dirPrincipal + inputConfig, "w")
			file.write("1\n")
			file.write("7\n")
			file.write(directorioAREARst + "\n")
			for i in range(0,len(arrayFactores)):
				file.write(arrayFactores[i] + "\n")
				file.write(arrayPesos[i] + "\n")
			file.close()

		IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
		IdrApi.SetWorkingDir(dirPrincipal)

		IdrApi.RunModule('MCE', ''+outputImageNce+'*'+dirPrincipal + inputConfig+'*', 1, '', '', '', '', 1)
		