import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	prYearActual = sys.argv[1]
	path = sys.argv[2]

	dirPrincipal = path + "/src/data/evaluacion_multicriterio/"+ prYearActual + "/"

	inputImageName = "mce_" + prYearActual + ".rst"
	outputImageName = "stretch_" + prYearActual + ".rst"
	outputImageStretch =dirPrincipal + outputImageName

	print(outputImageStretch)
	if not os.path.exists(outputImageStretch):

		IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
		IdrApi.SetWorkingDir(dirPrincipal)

		IdrApi.RunModule('STRETCH', inputImageName+'*'+outputImageStretch+'*1*3*#*#*N*0*1', 1, '', '', '', '', 1)