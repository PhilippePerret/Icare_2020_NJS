'use strict'

// cf. https://www.npmjs.com/package/mysql-easier
const mySqlEasier = require('mysql-easier')
    , MYSQL_DATA  = require('../private/secret/mysql.json')

class MyMySql {

  static async update(table, id, data){
    if (! this.configured) this.configure()
    if ( ! this.connexion ) {
      this.connexion = await mySqlEasier.getConnection()
    }
    // if ( database ) await this.connexion.query(`USE ${database}`)
    var retour = await this.connexion.updateById(table, id, data)
    return retour
  }

  static async last_insert_id(database){
    var request = `USE ${database};SELECT LAST_INSERT_ID();`
    var retour = await this.processQuery(request)
    return retour[0]
  }

  /**
    Attention : ne retourne que le premier enregistrement trouvé, ce qui
    est logique puisqu'on passe un unique ID.
  **/
  static async get(table, id, columns){
    if ( undefined === columns ) columns = '*'
    else columns = columns.join(', ')
    var request = `SELECT ${columns} FROM ${table} WHERE id = ?`
    var retour = await this.processQuery(request, [id])
    return retour[0]
  }

  static async getWhere(table, wheres, columns) {
    columns = columns || ['*']
    columns = columns.join(', ')
    var whereClause = []
    var valueClause = []
    for (var col in wheres) {
      whereClause.push(`${col} = ?`)
      valueClause.push(wheres[col])
    }
    whereClause = whereClause.join(' AND ')
    var request = `SELECT ${columns} FROM ${table} WHERE ${whereClause}`
    return await this.processQuery(request, valueClause)
  }

  /**
    Retourne tous les éléments de la table, correspondant au filtre s'il
    est défini (une méthode qui va filtrer comme map.filter )
  **/
  static async getAll(table, columns, filtre) {
    if ( undefined === columns || columns == '*') columns = '*'
    else columns = columns.join(', ')
    var request = `SELECT ${columns} FROM ${table}`
    var res = await this.processQuery(request)
    if ( undefined !== filtre ) {
      res = res.filter(filtre)
    }
    return res
  }

  // ---------------------------------------------------------------------
  //  MÉTHODES FONCTIONNELLES

  /**
    Méthode principale pour envoyer une requête
  **/
  static async query(request, params, database){
    console.log("-> DB.query", request, params)
    if ( database ) throw new Error("DB.query doit s'appeler sans database (3e argument). Mettre la table sous la forme <database>.<table>.")
    var retour = await this.processQuery(request, params)
    console.log("Retour de la requête :", retour)
    return retour
  }

  /**

    @param  {String}  table Table dans laquelle faire l'insertion
    @param  {Object}  data  Table object des données à insérer dans la table

    @return {Number} ID de la dernière rangée insérée
  **/
  static async insert(table, data){
    if (! this.configured) this.configure()
    if ( ! this.connexion ) {
      this.connexion = await mySqlEasier.getConnection()
    }
    var retour = await this.connexion.insert(table, data)
    return retour
  }

  /**
    Méthode générique invoquant une requête avec des arguments
    et retournant le résultat tel quel.
  **/
  static async processQuery(request, params){
    if (! this.configured) this.configure()
    if ( ! this.connexion ) {
      this.connexion = await mySqlEasier.getConnection()
    }
    var retour
    if ( undefined === params ) {
      retour = await this.connexion.query(request)
    } else {
      retour = await this.connexion.query(request, ...params)
    }
    return retour
  }

  // Configure la connexion
  static configure(){
    mySqlEasier.configure(this.configuration)
    this.configured = true
  }

  static async getConnexion(){

    if ( undefined === this.connexion ) {
      // Configuration de la connexion
      this.configure()
      // Get a connection from the pool
      this.connexion = await mySqlEasier.getConnection()
    }
    return this.connexion
  }

  static async stop(){
    // All done?  Release the connection
    await this.getConnextion().done();
    // App ready to exit?  Close the pool
    await mySqlEasier.endPool();
    console.log("J'ai stoppé mySql-easier")
  }

  // Retourne la configuration en fonction de l'environnement
  static get configuration(){
    switch (process.env.NODE_ENV) {
      case 'production':
        return MYSQL_DATA.production
      default:
        return MYSQL_DATA.local
    }
  }
}

module.exports = MyMySql
