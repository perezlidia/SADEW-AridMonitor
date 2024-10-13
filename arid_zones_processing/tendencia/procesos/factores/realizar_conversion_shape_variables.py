import sys, os
import shutil
from numpy import var
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	prYearActual = sys.argv[1]
	path = sys.argv[2]
	variable = sys.argv[3]

	dirPrincipal = path + "\\tendencia\\data\\factores\\"+ variable + "\\"+prYearActual + "\\"

	inputImageName = "tend_var_" + variable + "_" + prYearActual + ".vct"
	outputImageName = "tend_var_" + variable + "_" + prYearActual + ".shp"

	outputImageNce =dirPrincipal + outputImageName

	print(outputImageNce)
	if not os.path.exists(outputImageNce):
		IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
		IdrApi.SetWorkingDir(dirPrincipal)

		IdrApi.RunModule('SHAPEIDR', '2*2*'+inputImageName+'*'+outputImageNce, 1, '', '', '', '', 1)