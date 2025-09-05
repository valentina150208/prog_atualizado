var express = require("express");
var router = express.Router();

let AventureiroDAO = require("../modelo/AventureiroDAO");
let Aventureiro = require("../classes/Aventureiro");

let meuAveDAO = new AventureiroDAO();
//cria alguns objetos
let ave1 = new Aventureiro(1, "Aribaldo", "Pipoqueiro");
let ave2 = new Aventureiro(2, "Firmina", "Quentão Maker");
meuAveDAO.add(ave1);
meuAveDAO.add(ave2);

//Criação do "banco de dados" da Guilda
let GuildaDAO = require('../modelo/GuildaDAO');
let Guilda = require('../classes/Guilda');
let guilda1 = new Guilda(0, 'Guilda dos Aventureiros');
let guilda2 = new Guilda(1, 'Guilda dos Gremistas');

const guildaDAO = new GuildaDAO();
guildaDAO.add(guilda1);
guildaDAO.add(guilda2);


router.get("/digaOla", function (req, res) {
  let resposta = {};
  resposta.msg = "Oi, Cliente!";
  resposta.horaDaResposta = Date.now().toLocaleString("pt-br");
  res.json(resposta); //deu td ok e aqui estão os dados em json
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "ESTE É O NOSSO SITE" });
});

router.get("/pagina", function (req, res) {
  let html = "<HTML><HEADER>SITE DE EXEMPLO</HEADER></HTML>";
  res.contentType = "text/html"; //padrão MIME/TYPE
  res.send(html);
});

/*Rota que retorna todos os aventureiros, em json */
router.get("/aventureiro", function (req, res) {
  const aventureiros = meuAveDAO.getAll();
  res.json(aventureiros);
});

/*rota que retorna um aventureiro, pelo seu ID*/
router.get("/aventureiro/:id", function (req, res) {
  try {
    let id = req.params.id;
    let retorno = meuAveDAO.get(id);
    if( retorno != null  ){
      res.status(200).json(retorno);
    }else{
      //significa que não econtrou objeto com id
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao processar requisição." });
  }
});

/*Rota que cria um aventureiro*/
router.post("/aventureiro", function (req, res) {
  try {
    //pegar os dados vindos da req (Parser)
    let dados = req.body;
    //verificar dados
    if (!dados.id || !dados.nome || !dados.classe) {
      res.status(400).json({ mensagem: "Os campos não estão completos!" });
    }
    //criar um aventureiro com os dados
    let aventureiro = new Aventureiro(dados.id, dados.nome, dados.classe);
    //persistir os dados
    meuAveDAO.add(aventureiro);
    //retornar uma resposta
    res.status(201).json({ mensagem: "Aventureiro criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao processar requisição." });
  }
});

/*Rota para atualizar um aventureiro*/
router.put("/aventureiro/:id", function (req, res) {
  try {
    const { id } = req.params;
    let dados = req.body;

    let aventureiroAtualizado = meuAveDAO.update(id, dados);

    if (aventureiroAtualizado == null) {
      res.status(404).json({ mensagem: "Aventureiro não encontrado." });
    } else {
      res.json({
        mensagem: "Atualização do objeto bem-sucedida",
        aventureiro: aventureiroAtualizado,
      });
    }
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao processar update" });
  }
});

/* Rota para deletar um aventureiro pelo ID 
:id --> vai capturar o dado da requisição para uma variável
de parâmetro. (params)
*/
router.delete("/aventureiro/:id", function (req, res) {
  try {
    let id = req.params.id;
    let queries = req.query.varQuery;
    console.log(`Esta é a query que veio na requisição: ${queries} `);

    //verificar se o objeto existe
    if (meuAveDAO._procuraAventureiro(id)) {
      //faz a exclusão
      let retorno = meuAveDAO.delete(id);
      if (retorno != null) {
        res.status(200).json(retorno);
      } else {
        //se deu problema
        res.status(500).json({ mensagem: "Erro ao realizar exclusão." });
      }
    } else {
      //se objeto não for encontrado (não existir)
      res.status(404);
    }
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao processar delete. " + erro });
  }
});

//ROTAS DAS Guildas

//GET /guilda --> retorna todas as guildas

router.get('/guilda', getAllGuildas);

function getAllGuildas(req, res){
  //DONE:parser

  //executar processamento
  let guildas = guildaDAO.getAll();
  //escrever resposta
  //enviar resposta
  res.status(200).json(guildas);
}

//GET /guilda/:id --> retorna uma guilda específica
router.get('/guilda/:id', function(req, res){
  try{
    const { id } = req.params;
    const lista = guildaDAO.getAll();
    const g = lista.find(g => g.id == id);
    if(!g){
      return res.status(404).json();
    }
    return res.status(200).json(g);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao processar requisição.' });
  }
});

//POST /guilda --> cria uma nova guilda
router.post('/guilda', function(req, res){
  try{
    const dados = req.body || {};
    if(dados.id == null || dados.nome == null){
      return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes.' });
    }
    const nova = new Guilda(dados.id, dados.nome, dados.especialidade);
    const inserida = guildaDAO.add(nova);
    if(!inserida){
      return res.status(409).json({ mensagem: 'Guilda com este ID já existe.' });
    }
    return res.status(201).json(inserida);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao criar guilda.' });
  }
});

//PUT /guilda/:id --> atualiza dados da guilda
router.put('/guilda/:id', function(req, res){
  try{
    const { id } = req.params;
    const dados = req.body || {};
    const lista = guildaDAO.getAll();
    const g = lista.find(g => g.id == id);
    if(!g){
      return res.status(404).json({ mensagem: 'Guilda não encontrada.' });
    }
    if(dados.nome != null){ g.nome = dados.nome; }
    if(dados.especialidade != null){ g.especialidade = dados.especialidade; }
    if(dados.dataCriacao != null){ g.dataCriacao = dados.dataCriacao; }
    return res.status(200).json(g);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao atualizar guilda.' });
  }
});

//DELETE /guilda/:id --> exclui uma guilda
router.delete('/guilda/:id', function(req, res){
  try{
    const { id } = req.params;
    const lista = guildaDAO.getAll();
    const index = lista.findIndex(g => g.id == id);
    if(index === -1){
      return res.status(404).json();
    }
    const removida = lista.splice(index, 1)[0];
    return res.status(200).json(removida);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao excluir guilda.' });
  }
});

//ROTAS de membros da guilda
//GET /guilda/:id/membros --> lista membros da guilda
router.get('/guilda/:id/membros', function(req, res){
  try{
    const { id } = req.params;
    const lista = guildaDAO.getAll();
    const g = lista.find(g => g.id == id);
    if(!g){
      return res.status(404).json();
    }
    return res.status(200).json(g.membros || []);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao listar membros da guilda.' });
  }
});

//POST /guilda/:id/membros --> recruta aventureiro existente para a guilda
router.post('/guilda/:id/membros', function(req, res){
  try{
    const { id } = req.params; // id da guilda
    const lista = guildaDAO.getAll();
    const g = lista.find(g => g.id == id);
    if(!g){
      return res.status(404).json({ mensagem: 'Guilda não encontrada.' });
    }

    const dados = req.body || {};
    const aventureiroId = dados.aventureiroId ?? dados.idAventureiro ?? dados.id;
    if(aventureiroId == null){
      return res.status(400).json({ mensagem: 'Campo aventureiroId é obrigatório.' });
    }

    const aventureiro = meuAveDAO.get(aventureiroId);
    if(!aventureiro){
      return res.status(404).json({ mensagem: 'Aventureiro não encontrado.' });
    }

    const ok = g.recrutarAventureiro(aventureiro);
    if(!ok){
      return res.status(409).json({ mensagem: 'Aventureiro já faz parte da Guilda.' });
    }
    return res.status(201).json(g);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao recrutar aventureiro.' });
  }
});

//DELETE /guilda/:id/membros/:aventureiroId --> remove membro da guilda
router.delete('/guilda/:id/membros/:aventureiroId', function(req, res){
  try{
    const { id, aventureiroId } = req.params;
    const lista = guildaDAO.getAll();
    const g = lista.find(g => g.id == id);
    if(!g){
      return res.status(404).json({ mensagem: 'Guilda não encontrada.' });
    }
    const idx = (g.membros || []).findIndex(m => m.id == aventureiroId);
    if(idx === -1){
      return res.status(404).json({ mensagem: 'Membro não encontrado na guilda.' });
    }
    const removido = g.membros.splice(idx, 1)[0];
    // remover referência da guilda no aventureiro
    if(removido && Array.isArray(removido.guildas)){
      const gi = removido.guildas.findIndex(gg => gg.id == g.id);
      if(gi !== -1){
        removido.guildas.splice(gi, 1);
      }
    }
    return res.status(200).json(removido);
  }catch(err){
    return res.status(500).json({ mensagem: 'Erro ao remover membro da guilda.' });
  }
});

module.exports = router;
