import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
    prYearActual = sys.argv[1]
    path = sys.argv[2]

    dirPrincipal = path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual
    inputImageName1 = "rec_" + prYearActual + ".rst"
    inputImageEstados = path + "/tendencia/utilerias/ESTADOS/estados.rst"
    inputImageArea = path + "/tendencia/utilerias/AREA/AREA.rst"

    outFile = 'crosstab_indicador_aridez_'+prYearActual+'.html'
    outputImageCross =dirPrincipal + "/" + outFile

    if not os.path.exists(outputImageCross):

        IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
        IdrApi.SetWorkingDir(dirPrincipal)

        IdrApi.RunModule('CROSSTAB', '1*'+inputImageArea+'*'+inputImageName1+'*NONE*'+ inputImageArea+'*2*none*N', 1, '', '', '', '', 1)