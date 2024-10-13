class Config {
  	static isLocal() { return true; }
  	static isLogeoDummy() { return false; }
  	static getHost() { return '0.0.0.0'; }
  	static getPuerto() { return 1235; }
  	static getServidorGeoserver() { return '127.0.0.1:8083'; }
  	static getConfigPostgres() { 
  		return {
		    idleTimeoutMillis: 30000,
		    max: 25, // max number of clients in the pool
		    host     : '127.0.0.1',
		    port     : '5432',
		    user     : 'sadew', 
		    password : '********', 
		    database : 'zonas_aridas'
		}
	}
	static getPathProyect(){
		return 'file:////zonas_aridas/zonas_aridas_web/';
	}
	static getPathProyectPython(){
		return '/zonas_aridas/zonas-aridas/';
	}
}	

module.exports = Config;