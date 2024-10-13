import sys, os
from numpy import float64


Estados = {
	0: 'Hiperárido',
	1: 'Árido',
	2: 'Semiárido',
	3: 'Subhúmedo Seco',
	4: 'Húmedo',
	5: 'Total',
}
Categorias = {
	0: 'Categorias',
	1: 'Superficie km2',
	2: 'Total'
}


if __name__ == '__main__':
    prYearActual = sys.argv[1]
    path = sys.argv[2]

    dirPrincipal = path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual
    inputImage = 'ctab1.html'
    outFile = 'crosstab_indicador_aridez_'+prYearActual+'.html'
    inputImageCross =dirPrincipal + "/" + inputImage
    outputImageCross =dirPrincipal + "/" + outFile

    print(outputImageCross)
    if not os.path.exists(outputImageCross):

        fw = open(outputImageCross, "w",  encoding='utf-8')
	
        fw.write('<table class="table" border="1">\n')
        #imprimir las categorias
        rowCategorias = 0
        entroCategoria = False
        procesaRowCategoria = 1 #procesaRow = 2
        with open(inputImageCross, "r", encoding='utf-8') as f:
            for text in f.readlines():
                if text.find('<tr>')!=-1:                        
                   rowCategorias = rowCategorias+1  

                if rowCategorias == procesaRowCategoria:
                    entroCategoria = True 

                    if text.find('<tr>')!=-1:       
                        fw.write(text)

                    if text.find('</tr>')!=-1:
                        entroCategoria = False 
                        fw.write(text)

                    if entroCategoria:  
                        if text.find('<td>')!=-1:  
                            if text.find('document.write')!=-1:        
                                x = text.split('document.write("')								
                                y = x[1].split('")')
                                x = y[0].split('<td>')								
                                y = x[1].split('</td>')           
                                fw.write('<td><b>'+Categorias.get(int(y[0]))+'</b></td>')
                            else:       
                                if text.find('Category')!=-1: 
                                    fw.write('<td><b>'+Categorias.get(int(0))+'</b></td>')
                                else:
                                    fw.write('<td><b>'+Categorias.get(int(2))+'</b></td>')

        row = 0
        procesaRow = 2
        procesaRowMax = 7
        primerTdDelRow = True
        rowInteres = 0
        with open(inputImageCross, "r", encoding='utf-8') as f:
            for text in f.readlines():
                entro = False
                if text.find('<tr>')!=-1:
                    row = row+1
                    entro = True
                    primerTdDelRow = True
                    if row >= procesaRow and row <= procesaRowMax:
                        fw.write(text)
                
                if text.find('</tr>')!=-1:
                    entro = True
                    if row >= procesaRow and row <= procesaRowMax:
                        fw.write(text)
                
                if not entro:
                    if text.find('<td>')!=-1:
                        if row >= procesaRow and row <= procesaRowMax:
                            if primerTdDelRow: #categorias
                                fw.write('<td><b>'+Estados.get(rowInteres)+'</b></td>\n')
                                primerTdDelRow = False
                                rowInteres = rowInteres+1
                            else:
                                if text.find('document.write("')!=-1:
                                    x = text.split('document.write("')								
                                    y = x[1].split('")')
                                    x = y[0].split('<td>')								
                                    y = x[1].split('</td>')

                                    formula = float64(y[0]) * .250 *.250

                                    fw.write('<td>' + str(round(formula, 2)) + '</td>\n')
                                else:
                                    fw.write(text)

        fw.write('</table>')


        