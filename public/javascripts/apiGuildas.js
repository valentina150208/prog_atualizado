var baseUrl = "https://simulador-guilda.vercel.app/";

async function getAventureiro(id) {
  try {
    let url = '/aventueiro/'+id;
    if(id == undefined){
      url = '/aventureiro'
    }
    const res = await fetch(baseUrl + url);
    const dados = await res.json();

    return dados;
  } catch (err) {
    console.error(err);
  }
}

async function postAventureiro(a) {
  try {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(a),
    };

    const response = await fetch(baseUrl + "/aventureiro", options);
    if (response.ok) {
      const dados = response.json();
      return dados;
    } else {
      return null;
    }
  } catch (error) {
    console.log(`Erro no postAventureiro: ` + error);
  }
}

async function putAventureiro(id, dados) {
  try {
    const res = await fetch(baseUrl + `/aventureiro/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error("Erro ao atualizar");
    const body = await res.json();
    return body;
  } catch (err) {
    console.error(err);
    return null;
  }
}
async function deleteAventureiro(id) {
  try {
    const res = await fetch(baseUrl+`/aventureiro/${id}`, { method: 'DELETE' });
    if (!res.ok){
      return null;
    }
    const dados = await res.json();
    return dados;
  } catch (err) {
    return null;
  }
}

