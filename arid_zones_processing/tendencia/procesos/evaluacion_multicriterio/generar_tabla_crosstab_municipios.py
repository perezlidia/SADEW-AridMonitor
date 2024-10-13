import sys, os
from numpy import float64


Estados = {
	0: 'Baja California',
	1: 'Baja California',
	2: 'Baja California',
	3: 'Baja California',
	4: 'Baja California',
	5: 'Baja California',
	6: 'Baja California Sur',
	7: 'Baja California Sur',
	8: 'Baja California Sur',
	9: 'Baja California Sur',
	10: 'Baja California Sur',
	11: 'Chihuahua',
	12: 'Chihuahua',
	13: 'Chihuahua',
	14: 'Chihuahua',
	15: 'Chihuahua',
	16: 'Chihuahua',
	17: 'Chihuahua',
	18: 'Chihuahua',
	19: 'Chihuahua',
	20: 'Chihuahua',
	21: 'Chihuahua',
	22: 'Chihuahua',
	23: 'Chihuahua',
	24: 'Chihuahua',
	25: 'Chihuahua',
	26: 'Durango',
	27: 'Durango',
	28: 'Durango',
	29: 'Durango',
	30: 'Durango',
	31: 'Durango',
	32: 'Durango',
	33: 'Durango',
	34: 'Durango',
	35: 'Durango',
	36: 'Durango',
	37: 'Durango',
	38: 'Durango',
	39: 'Durango',
	40: 'Durango',
	41: 'Durango',
	42: 'Nayarit',
	43: 'Nayarit',
	44: 'Nayarit',
	45: 'Nayarit',
	46: 'Nayarit',
	47: 'Nayarit',
	48: 'Nayarit',
	49: 'Sinaloa',
	50: 'Sinaloa',
	51: 'Sinaloa',
	52: 'Sinaloa',
	53: 'Sinaloa',
	54: 'Sinaloa',
	55: 'Sinaloa',
	56: 'Sinaloa',
	57: 'Sinaloa',
	58: 'Sinaloa',
	59: 'Sinaloa',
	60: 'Sinaloa',
	61: 'Sinaloa',
	62: 'Sinaloa',
	63: 'Sinaloa',
	64: 'Sinaloa',
	65: 'Sinaloa',
	66: 'Sinaloa',
	67: 'Sonora',
	68: 'Sonora',
	69: 'Sonora',
	70: 'Sonora',
	71: 'Sonora',
	72: 'Sonora',
	73: 'Sonora',
	74: 'Sonora',
	75: 'Sonora',
	76: 'Sonora',
	77: 'Sonora',
	78: 'Sonora',
	79: 'Sonora',
	80: 'Sonora',
	81: 'Sonora',
	82: 'Sonora',
	83: 'Sonora',
	84: 'Sonora',
	85: 'Sonora',
	86: 'Sonora',
	87: 'Sonora',
	88: 'Sonora',
	89: 'Sonora',
	90: 'Sonora',
	91: 'Sonora',
	92: 'Sonora',
	93: 'Sonora',
	94: 'Sonora',
	95: 'Sonora',
	96: 'Sonora',
	97: 'Sonora',
	98: 'Sonora',
	99: 'Sonora',
	100: 'Sonora',
	101: 'Sonora',
	102: 'Sonora',
	103: 'Sonora',
	104: 'Sonora',
	105: 'Sonora',
	106: 'Sonora',
	107: 'Sonora',
	108: 'Sonora',
	109: 'Sonora',
	110: 'Sonora',
	111: 'Sonora',
	112: 'Sonora',
	113: 'Sonora',
	114: 'Sonora',
	115: 'Sonora',
	116: 'Sonora',
	117: 'Sonora',
	118: 'Sonora',
	119: 'Sonora',
	120: 'Sonora',
	121: 'Sonora',
	122: 'Sonora',
	123: 'Sonora',
	124: 'Sonora',
	125: 'Sonora',
	126: 'Sonora',
	127: 'Sonora',
	128: 'Sonora',
	129: 'Sonora',
	130: 'Sonora',
	131: 'Sonora',
	132: 'Sonora',
	133: 'Sonora',
	134: 'Sonora',
	135: 'Sonora',
	136: 'Sonora',
	137: 'Sonora',
	138: 'Sonora',
	139: 'Zacatecas',
	140: 'Zacatecas',
	141: 'Total'   
}

Municipios = {
	0: 'Ensenada',
	1: 'Mexicali',
	2: 'Tecate',
	3: 'Tijuana',
	4: 'Playas de Rosarito',
	5: 'San Quintín',
	6: 'Comondú',
	7: 'Mulegé',
	8: 'La Paz',
	9: 'Los Cabos',
	10: 'Loreto',
	11: 'Batopilas de Manuel Gómez Morín',
	12: 'Chínipas',
	13: 'Guachochi',
	14: 'Guadalupe y Calvo',
	15: 'Guazapares',
	16: 'Guerrero',
	17: 'Madera',
	18: 'Maguarichi',
	19: 'Matachí',
	20: 'Morelos',
	21: 'Moris',
	22: 'Ocampo',
	23: 'Temósachic',
	24: 'Urique',
	25: 'Uruachi',
	26: 'Canatlán',
	27: 'Canelas',
	28: 'Durango',
	29: 'Guadalupe Victoria',
	30: 'Mezquital',
	31: 'Nombre de Dios',
	32: 'Otáez',
	33: 'Pánuco de Coronado',
	34: 'Poanas',
	35: 'Pueblo Nuevo',
	36: 'San Dimas',
	37: 'Súchil',
	38: 'Tamazula',
	39: 'Topia',
	40: 'Vicente Guerrero',
	41: 'Nuevo Ideal',
	42: 'Acaponeta',
	43: 'Huajicori',
	44: 'Rosamorada',
	45: 'Ruíz',
	46: 'Santiago Ixcuintla',
	47: 'Tecuala',
	48: 'Tuxpan',
	49: 'Ahome',
	50: 'Angostura',
	51: 'Badiraguato',
	52: 'Concordia',
	53: 'Cosalá',
	54: 'Culiacán',
	55: 'Choix',
	56: 'Elota',
	57: 'Escuinapa',
	58: 'El Fuerte',
	59: 'Guasave',
	60: 'Mazatlán',
	61: 'Mocorito',
	62: 'Rosario',
	63: 'Salvador Alvarado',
	64: 'San Ignacio',
	65: 'Sinaloa',
	66: 'Navolato',
	67: 'Aconchi',
	68: 'Agua Prieta',
	69: 'Álamos',
	70: 'Altar',
	71: 'Arivechi',
	72: 'Arizpe',
	73: 'Atil',
	74: 'Bacadéhuachi',
	75: 'Bacanora',
	76: 'Bacerac',
	77: 'Bacoachi',
	78: 'Bácum',
	79: 'Banámichi',
	80: 'Baviácora',
	81: 'Bavispe',
	82: 'Benjamín Hill',
	83: 'Caborca',
	84: 'Cajeme',
	85: 'Cananea',
	86: 'Cumpas',
	87: 'Divisaderos',
	88: 'Empalme',
	89: 'Etchojoa',
	90: 'Carbó',
	91: 'Puerto Peñasco',
	92: 'Quiriego',
	93: 'La Colorada',
	94: 'Cucurpe',
	95: 'Fronteras',
	96: 'Granados',
	97: 'Guaymas',
	98: 'Hermosillo',
	99: 'Huachinera',
	100: 'Huásabas',
	101: 'Huatabampo',
	102: 'Huépac',
	103: 'Imuris',
	104: 'Magdalena',
	105: 'Mazatán',
	106: 'Moctezuma',
	107: 'Naco',
	108: 'Nácori Chico',
	109: 'Nacozari de García',
	110: 'Navojoa',
	111: 'Nogales',
	112: 'Ónavas',
	113: 'Opodepe',
	114: 'Oquitoa',
	115: 'Pitiquito',
	116: 'Rayón',
	117: 'Rosario',
	118: 'Sahuaripa',
	119: 'San Felipe de Jesús',
	120: 'San Javier',
	121: 'San Luis Río Colorado',
	122: 'Soyopa',
	123: 'Suaqui Grande',
	124: 'San Miguel de Horcasitas',
	125: 'Tepache',
	126: 'Trincheras',
	127: 'San Pedro de la Cueva',
	128: 'Santa Ana',
	129: 'Santa Cruz',
	130: 'Sáric',
	131: 'Tubutama',
	132: 'Ures',
	133: 'Villa Hidalgo',
	134: 'Villa Pesqueira',
	135: 'Yécora',
	136: 'General Plutarco Elías Calles',
	137: 'Benito Juárez',
	138: 'San Ignacio Río Muerto',
	139: 'Chalchihuites',
	140: 'Sombrerete',
	141: ''   
}
Categorias = {
	11: 'Estado',
	111: 'Municipio',
	1: 'Hiperárido',
	2: 'Árido',
	3: 'Semiárido',
	4: 'Subhúmedo Seco',
	5: 'Húmedo',
	6: 'Total'
}


if __name__ == '__main__':
    prYearActual = sys.argv[1]
    path = sys.argv[2]

    dirPrincipal = path + "/tendencia/data/evaluacion_multicriterio/"+ prYearActual
    inputImage = 'ctab1.html'
    outFile = 'crosstab_municipios_'+prYearActual+'.html'
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
                                    fw.write('<td><b>'+Categorias.get(int(11))+'</b></td>')
                                    fw.write('<td><b>'+Categorias.get(int(111))+'</b></td>')
                                else:
                                    fw.write('<td><b>'+Categorias.get(int(6))+'</b></td>')

        row = 0
        procesaRow = 2
        procesaRowMax = 143
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
                                fw.write('<td><b>'+Municipios.get(rowInteres)+'</b></td>\n')
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


        