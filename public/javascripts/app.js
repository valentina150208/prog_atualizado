
getAventureiros();

async function getAventureiros() {
  try {
    let pMain = document.querySelector("#main");
    let aventureiros = await getAventureiro();
    if (aventureiros) {
      console.log(JSON.stringify(aventureiros));
      renderizaAventureiros(aventureiros, pMain);
    }
  } catch (error) {
    console.log(`Erro getAventureiros: ${error}`);
  }
}

/**Renderiza no HTML todos os aventureiros obtidos
 * @param aventureiros JSON de aventureiros
 */
async function renderizaAventureiros(aventureiros, element) {
  //para cada aventueiro
  let sectionAventureiro = element;
  console.log(`aventureiros: ${aventureiros}`)
  aventureiros.forEach((a) => {
    let card = criaCardAventueiro(a);
    let divCard = document.createElement("div");
    divCard.id = "cardAventureiro" + a.id;
    divCard.innerHTML = card;
    sectionAventureiro.appendChild(divCard);
  });
  //criar um card
  //para cada card
  //adicionar no elemento html
}

function criaCardAventueiro(aventueiro) {
  /**"id":1,"nome":"Aribaldo","classe":"Pipoqueiro","nivel":1 */
  let card = `<div class=card-aventureiro> 
     <p>${aventueiro.id} - ${aventueiro.nome} Classe: ${aventueiro.classe} </p>
     </div> `;

  return card;
}
