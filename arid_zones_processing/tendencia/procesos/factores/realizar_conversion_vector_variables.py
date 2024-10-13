import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	prYearActual = sys.argv[1]
	path = sys.argv[2]
	variable = sys.argv[3]

	dirPrincipal = path + "/tendencia/data/factores/"+ variable + "/"+prYearActual + "/"

	inputImageName = "tend_var_"+ variable + "_" + prYearActual + ".rst"
	outputImageName = "tend_var_"+ variable + "_" + prYearActual + ".vct"

	outputImageNce =dirPrincipal + outputImageName

	print(outputImageNce)
	if not os.path.exists(outputImageNce):
		IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
		IdrApi.SetWorkingDir(dirPrincipal)

		IdrApi.RunModule('RASTERVECTOR', '2*3*'+inputImageName+'*1*'+outputImageNce+'*N', 1, '', '', '', '', 1)
		