import sys, os
import shutil
import win32com.client
from osgeo import gdal


if __name__ == '__main__':
    prYearActual = sys.argv[1]
    path = sys.argv[2]

    dirPrincipal = path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual
    inputImageName1 = "rec_" + prYearActual + ".rst"
    inputImageCuencas = path + "/tendencia/utilerias/CUENCAS/cuencas.rst"
    inputImageArea = path + "/tendencia/utilerias/AREA/AREA.rst"

    outFile = 'crosstab_cuencas_'+prYearActual+'.html'
    outputImageCross =dirPrincipal + "/" + outFile

    if not os.path.exists(outputImageCross):

        IdrApi = win32com.client.Dispatch('idrisi32.IdrisiAPIServer')
        IdrApi.SetWorkingDir(dirPrincipal)

        IdrApi.RunModule('CROSSTAB', '1*'+inputImageName1+'*'+inputImageCuencas+'*NONE*'+ inputImageArea+'*2*none*N', 1, '', '', '', '', 1)