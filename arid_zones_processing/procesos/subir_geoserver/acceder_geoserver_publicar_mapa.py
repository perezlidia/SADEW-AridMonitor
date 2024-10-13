from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import zipfile
import os
import sys
import glob


def constructor(prMapa, prVariable, prYear,prNombreFile,rutaXml):      
    #variable a descargar
    #nombre del archivo
    #ruta del archivo
    mapa = prMapa
    variable = prVariable
    year = prYear    
    nombreFile = prNombreFile
    rutaXml = rutaXml


    # Crear una sesión de Chrome
    driver = webdriver.Chrome(executable_path= "driver_chrome/chromedriver.exe")
    driver.implicitly_wait(30)
    driver.maximize_window()

    # Acceder a la aplicación web
    driver.get("http://localhost:8083/geoserver/web/")

    # asignamos el correo a usar
    username = driver.find_element(By.ID, "username")
    username.send_keys("admin")

    # esperamos 5 segundos
    time.sleep(1)

    # asignamos la contraseña
    password = driver.find_element(By.ID, "password")
    password.send_keys("geoserver")

    # damos click en el boton next
    driver.find_element_by_class_name("button-login").click()

    time.sleep(2)

    driver.get("http://localhost:8083/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.data.store.NewDataPage")

    
    driver.find_element(By.XPATH, '//span[text()="ImageMosaicJDBC"]').click()


    nombre_origen_datos = driver.find_element_by_name('namePanel:border:paramValue')
    nombre_origen_datos.send_keys(mapa)

    conexion = driver.find_element_by_name('parametersPanel:urlPanel:border:paramValue')
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys("\u0008");conexion.send_keys("\u0008");conexion.send_keys("\u0008");
    conexion.send_keys(rutaXml)

    
    driver.find_element(By.XPATH, '//a[text()="Guardar"]').click()

    time.sleep(2)    

    try:
        driver.find_element(By.XPATH, '//span[text()="Publicación"]').click()

        time.sleep(8)


        #EPSG:6372
        srcDeclarado = driver.find_element_by_name('tabs:panel:theList:0:content:referencingForm:declaredSRS:srs')
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("\u0008");
        srcDeclarado.send_keys("EPSG:6372")


        #select srsHandling > FORCE_DECLARED
        selectsrsHandling = driver.find_element(By.ID, "srsHandling")
        for option in selectsrsHandling.find_elements_by_tag_name('option'):
            if option.get_attribute("value") == 'FORCE_DECLARED':
                option.click()
                break


        
        driver.find_element(By.XPATH, '//a[text()="Calcular desde el encuadre nativo"]').click()

        time.sleep(1)
        
        driver.find_element(By.XPATH, '//a[text()="Guardar"]').click()

        #agregamos el estilo

        filter = driver.find_element_by_name("filter")
        filter.send_keys(mapa)
        filter.send_keys(Keys.RETURN)

        time.sleep(1)
    
        driver.find_elements(By.XPATH, '//*[text()="'+mapa+'"]')[1].click()

        time.sleep(1)
        
        driver.find_element(By.XPATH, '//*[text()="Publicación"]').click()

        if variable == "precipitacion":
            valor = 'za_1precipitacion'
        elif variable == "temperatura":            
            valor = 'za_2temperatura'
        elif variable == "indiceDeVegetacion":            
            valor = 'za_3ndvi'
        elif variable == "evapotranspiracion":            
            valor = 'za_4evapotranspiracion'
        else:            
            valor = 'za_5humedad'


        #select tabs:panel:theList:2:content:styles:defaultStyle > za_1precipitacion  za_2temperatura  za_3ndvi  za_4evapotranspiracion  za_5humedad 
        selectsrsHandling = driver.find_element_by_name("tabs:panel:theList:2:content:styles:defaultStyle")
        for option in selectsrsHandling.find_elements_by_tag_name('option'):
            if option.get_attribute("innerText") == valor:
                option.click()
                break
        
        driver.find_element(By.XPATH, '//a[text()="Guardar"]').click()
        
    except NoSuchElementException:
       pass
    
    # Cerrar la ventana del navegador
    driver.quit()



if __name__ == '__main__':
    constructor(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])