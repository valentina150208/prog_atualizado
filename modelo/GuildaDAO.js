
const Guilda = require('../classes/Guilda');


class GuildaDAO{
    constructor(){
        this.guildaDB = [];
    }

    add(guilda){
        let tem = false;
        let id = guilda.id;
        //TODO: verificar campos e etc...
         this.guildaDB.forEach( (g) =>{
            if(g.id == id){
                tem = true;
            }
        });
        if( !tem ){
            this.guildaDB.push(guilda);
            return guilda;
        }else{
            return null;
        }

    }

    getAll(){
        return this.guildaDB;
    }

    get(id){
        this.guildaDB.forEach( (guilda) =>{
            if(guilda.id == id){
                return guilda;
            }
        });
        return null;
    }
}

module.exports = GuildaDAO;