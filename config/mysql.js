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

  /**
    Attention : ne retourne que le premier enregistrement trouvé, ce qui
    est logique puisqu'on passe un unique ID.
  **/
  static async get(table, id, columns){
    if ( undefined === columns ) columns = '*'
    else columns = columns.join(', ')
    var request = `SELECT ${columns} FROM ${table} WHERE id = ?`
    var retour = await this.processQuery(request, id)
    return retour[0]
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
    if (! this.configured) this.configure()
    if ( ! this.connexion ) {
      this.connexion = await mySqlEasier.getConnection()
    }
    if ( database ) await this.connexion.query(`USE ${database}`)
    var retour = await this.connexion.query(request, params)
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
    var retour = await this.connexion.query(request, params)
    return retour
  }

  // static async query(request, params, database){
  //   if (! this.configured) this.configure()
  //   const connexion = await mySqlEasier.getConnection()
  //   if ( database ) await connexion.query(`USE ${database}`)
  //   var retour = await connexion.query(request, params)
  //   return retour
  // }
  //
  // Configure la connexion
  static configure(){
    mySqlEasier.configure(this.configuration)
    this.configured = true
  }

  // static async connexion(){
  //   if ( undefined === this._connexion ) {
  //     this._connexion = await this.getConnexion()
  //   }
  //   return this._connexion
  // }

  static async getConnexion(){

    if ( undefined === this.connexion ) {
      // Configuration de la connexion
      this.configure()
      // Get a connection from the pool
      // const connexion = await mySqlEasier.getConnection()
      this.connexion = await mySqlEasier.getConnection()
      // console.log("Connexion:",myConn)
      // var retour = await connexion.query("SHOW DATABASES;")
      // console.log("database:", retour)
      // retour = await connexion.query('USE icare_users;')
      // console.log("Premier utilisateur : ", await connexion.query('SELECT * FROM users WHERE id = ?', [1]))
    }
    return this.connexion
  }

  static async stop(){
    console.log("Je stoppe mySql-easier")
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
