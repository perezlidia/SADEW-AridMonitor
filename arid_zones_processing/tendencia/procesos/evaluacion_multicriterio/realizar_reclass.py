import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	prYearActual = sys.argv[1]
	path = sys.argv[2]

	dirPrincipal = path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual + "/"

	inputImageName = "mce_" + prYearActual + ".rst"
	inputConfig = "config_reclass_" + prYearActual + ".rcl"	
	outputImageName = "rec_" + prYearActual + ".rst"
	outputImageNce =dirPrincipal + outputImageName

	print(outputImageNce)
	if not os.path.exists(outputImageNce):

		if not os.path.exists(dirPrincipal + inputConfig):
			file = open(dirPrincipal + inputConfig, "w")
			file.write("0 0 0.001\n")
			file.write("1 0.001 0.06\n")
			file.write("2 0.06 0.3\n")
			file.write("3 0.3 0.6\n")
			file.write("4 0.6 0.66\n")
			file.write("5 0.66 1\n")
			file.write("-9999\n")
			file.close()

		IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
		IdrApi.SetWorkingDir(dirPrincipal)

		IdrApi.RunModule('RECLASS', 'I*'+inputImageName+'*'+outputImageNce+'*3*' + inputConfig + '*1', 1, '', '', '', '', 1)