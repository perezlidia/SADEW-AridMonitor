import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	prYearActual = sys.argv[1]
	path = sys.argv[2]
	mapa = sys.argv[3]

	dirPrincipal = path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual + "/"

	if(mapa == 'zonas_aridas'):

		inputImageName = "rec_" + prYearActual + ".rst"
		outputImageName = "zonas_aridas_" + prYearActual + ".vct"
	else:
		inputImageName = "cross_estados_" + prYearActual + ".rst"
		outputImageName = "zonas_aridas_estados_" + prYearActual + ".vct"


	outputImageNce =dirPrincipal + outputImageName

	print(outputImageNce)
	if not os.path.exists(outputImageNce):
		IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
		IdrApi.SetWorkingDir(dirPrincipal)

		IdrApi.RunModule('RASTERVECTOR', '2*3*'+inputImageName+'*1*'+outputImageNce+'*N', 1, '', '', '', '', 1)
		