import sys, os
import glob
import shutil
import win32com.client


if __name__ == '__main__':
	factor = sys.argv[1]
	prYearActual = sys.argv[2]
	path = sys.argv[3]
	directorioAREARst = sys.argv[4]
	directorioAREARdc = sys.argv[5]


	dirPrincipal = path + "/tendencia/data/factores/"+ factor + "/"+prYearActual + "/"
	inputImage = 'cal_'+factor+'_'+prYearActual+'.rst'
	outputImage = path + "/tendencia/data/factores/"+ factor + "/"+prYearActual  + '/' + "tend_var_" + factor + "_" + prYearActual + ".rst"
	AREAImage = 'AREA.rst'


	print(outputImage)
	if not os.path.exists(outputImage):
		if glob.glob(dirPrincipal + inputImage):
			#copeamos los archivos AREA.rst AREA.RDC
			shutil.copy(directorioAREARst, path + "/tendencia/data/factores/"+ factor + "/"+prYearActual)
			shutil.copy(directorioAREARdc, path + "/tendencia/data/factores/"+ factor + "/"+prYearActual)						
			
			if glob.glob(dirPrincipal + AREAImage):	

				IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')

				IdrApi.SetWorkingDir(dirPrincipal)
				IdrApi.RunModule('OVERLAY', '3*'+ inputImage +'*'+ AREAImage +'*'+ outputImage +'', 1, '', '', '', '', 1)

	#eliminar AREA.rst AREA.RDC
	if os.path.exists(dirPrincipal + "AREA.rst"):
		os.remove(dirPrincipal + "AREA.rst")
	if os.path.exists(dirPrincipal + "AREA.RDC"):
		os.remove(dirPrincipal + "AREA.RDC")
