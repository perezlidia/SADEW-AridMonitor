import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
	variable = sys.argv[1]
	prYearActual = sys.argv[2]
	path = sys.argv[3]
	directorioAREARst = sys.argv[4]
	directorioAREARdc = sys.argv[5]
	valorTendencia = sys.argv[6]

	dirPrincipal = path + "/src/data/variables/"+ variable + "/2020/"
	inputImageName = "var_" + variable + "_2020.rst"
	inputImageDir = dirPrincipal + inputImageName


	dirOutput = path + "/tendencia/data/factores/"+ variable + "/"+prYearActual+"/"
	outputImageNfName = "cal_" + variable + "_" + prYearActual + ".rst"
	outputImageNf = dirOutput + outputImageNfName

	print(outputImageNf)
	if not os.path.exists(outputImageNf):
		if os.path.exists(inputImageDir):			
			if variable != 'indiceDeVegetacion':   
				IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
				IdrApi.SetWorkingDir(dirOutput)

				#verificar si el numero es negativo 2 o positivo 1
				if float(valorTendencia) > 0:
					valor = 1
				else:
					valor = 2

				#realizar operacion para calcular la tendencia
				resultado = (int(prYearActual) - 2020) * float(valorTendencia)
				IdrApi.RunModule('SCALAR', inputImageDir +'*'+outputImageNf+'*'+str(valor)+'*'+str(abs(resultado))+'', 1, '', '', '', '', 1)
			else:
				valores = valorTendencia.split("_")

				#realizar operacion para calcular la tendencia
				minimoIDV = (int(prYearActual) - 2020) * float(valores[0])
				maximoIDV = (int(prYearActual) - 2020) * float(valores[1])

				dataset = gdal.Open(inputImageDir, gdal.GA_ReadOnly)
				band = dataset.GetRasterBand(1)
				minDato = band.GetMinimum()
				maxDato = band.GetMaximum()
				band = None

				minimo2030 = minDato - abs(minimoIDV)
				maximo2030 = maxDato - abs(maximoIDV)

				IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
				IdrApi.SetWorkingDir(dirOutput)

				IdrApi.RunModule('STRETCH', inputImageDir +'*'+outputImageNf+'*1*3*#*#*N*'+str(minimo2030)+'*'+str(maximo2030)+'', 1, '', '', '', '', 1)
