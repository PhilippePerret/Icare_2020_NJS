'use strict'
/**
  |
  | Class News
  |
  | Gestion des actualités du site
  |
**/
const File = System.require('controllers/File')


class News {

  /**
    Création d'une actualité
    ------------------------
    L'actualité est créée dans la table icare_hot.actualites et elle est
    ajoutée au fichier des 20 dernières actualités
    @param {String}   message Le message à afficher
    @param {Integer}  status Le statut de l'actualité, de 0 à 3 (cf. manuel)
    @param {Integer}  uid  ID de l'icarien concerné (ou null)

    @return {News} Instance créée
  **/
  static async create(message, status, uid){
    status = status || 1 // par défaut : seulement sur la page d'accueil
    var news = new News({user_id:uid, message:message, status:status})
    await news.create()
    this.addNewToLastNews(news)
    return news
  }

  static addNewToLastNews(news) {
    var dNews
    let lpath = Icare.lastNewsPath
    File.execWithLock(lpath, function(){
      try{dNews = require(lpath)} catch(err){dNews = [] /* lancement du site */}
      dNews.length < 20 || dNews.pop()
      dNews.unshift(`<div class="news" data-id="${news.id}"><span class="date">${news.formatedDate}</span><span class="content">${news.message}</span></div>`)
      this.write(JSON.stringify(dNews))
    })

    // On doit actualiser le fichier HTML
    let lhpath = Icare.lastNewsHtmlPath
    File.execWithLock(lhpath, function(){
      this.write(dNews.join(''))
    })

  }

  /**
    |
    | ---------------------------------------------------------------------
    |   INSTANCE
    |
    |
  **/
  constructor(data){
    this.user_id = data.user_id
    this.message = data.message
    this.status  = data.status
  }
  /**
    Création de l'actualité
  **/
  async create(){
    let reqData = [...this.dataList]
    this.created_at = Date.now()
    reqData.push(this.created_at) // pour created_at
    var retour = await DB.query("INSERT LOW_PRIORITY INTO icare_hot.actualites SET user_id = ?, message = ?, status = ?, data = ?, created_at = ?, updated_at = ?", reqData)
    this.id = retour.insertId
  }

  save(){
    let reqData = [...this.dataList]
    this.updated_at = Date.now()
    reqData.push(this.updated_at, this.id)
    DB.query("UPDATE LOW_PRIORITY icare_hot.actualites SET user_id = ?, message = ?, status = ?, data = ?, updated_at = ? WHERE id = ?")
  }

  // Retourne la date de l'actualité formatée
  get formatedDate(){
    if (undefined === this._formateddate) {
      this._formateddate = Date.formate(null, this.created_at)
    }
    return this._formateddate
  }
  get dataList(){
    return [this.user_id||null, this.message, this.status||2, this.data||null, Date.now()]
  }
}

module.exports = News
