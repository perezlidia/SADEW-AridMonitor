import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	factor = sys.argv[1]
	prYearActual = sys.argv[2]
	path = sys.argv[3]
	directorioAREARst = sys.argv[4]
	directorioAREARdc = sys.argv[5]

	dirPrincipal = path + "/tendencia/data/factores/"+ factor + "/"+prYearActual + "/"
	inputImageName = "tend_var_" + factor + "_" + prYearActual + ".rst"	
	outputImageNfName = "varn_" + factor + "_" + prYearActual + ".rst"

	inputImageDir = dirPrincipal + inputImageName

	outputImageNf = dirPrincipal + outputImageNfName

	outputImageFuzzyName = "fu_" + factor + "_" + prYearActual + ".rst"
	outputImageFuzzyDir = path + "/tendencia/data/factores/"+ factor + "/"+prYearActual  + '/' + outputImageFuzzyName
	
	print(outputImageFuzzyDir)
	if not os.path.exists(outputImageFuzzyDir):
		if os.path.exists(inputImageDir):

			IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
			IdrApi.SetWorkingDir(dirPrincipal)

			#print(outputImageNf)
			#if not os.path.exists(outputImageNf):
			#	IdrApi.RunModule('NANFIX', '2*'+ inputImageDir +'*'+outputImageNf+'*0', 1, '', '', '', '', 1)
	  
			dataset = gdal.Open(inputImageDir, gdal.GA_ReadOnly)
			band = dataset.GetRasterBand(1)
			minDato = band.GetMinimum()
			maxDato = band.GetMaximum()
			band = None

			
			if(factor == 'temperatura' or factor == 'evapotranspiracion'): #decreciente
				IdrApi.RunModule('FUZZY', '3*'+inputImageName+'*1*'+outputImageFuzzyDir+'*'+str(minDato)+'*'+str(minDato)+'*'+str(minDato)+'*'+str(maxDato)+'', 1, '', '', '', '', 1)
			else:			
				IdrApi.RunModule('FUZZY', '3*'+inputImageName+'*1*'+outputImageFuzzyDir+'*'+str(minDato)+'*'+str(maxDato)+'*'+str(maxDato)+'*'+str(maxDato)+'', 1, '', '', '', '', 1)

