/* DAQUI - ESCRITO EM CIMA DO FRONT*/
getDash = () => {
  axios("http://localhost:8080/dashboard", {
    method: "GET",
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic YWRtaW46YWRtaW4="
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer" // no-referrer, *client
  })
    .then(response => {
      console.log("Statistics", response.data.statistics);
      console.log("Ranks", response.data.ranks);
      //return response.json(); não faz - dá erro
    })
    .then(data => { //não está fazendo - 
      console.log("data", data);
      /*this.setState({
        users: data
      });*/
    })
    .catch(err => {
      if (err.response) {
        if (err.response.status === 400) { //precisa - vai passar aqui qdo não tiver 
          alert(err.response.data.message);
        }
      } else {
        console.log("Erro", err);
      }
    });
};
/*ATÉ AQUI*/



// meu primeiro Get statistics to dashboard
const getDash = () => {
  axios({
    method: "get",
    responseType: "json",
    url: "dashboard",
    //daqui auth - o teu auth não sei como vc está fazendo - fiz uma constante fora
    auth: {
      username: authname,
      password: authpass
    },
    //até aqui auth - ignora e pega o teu
    data: {}
  })
    .then(response => {
      if (response.status === 200) {
      //aqui tem o retorno positivo dentro do response.data 
      console.log("JSON Estatísticas", response.data);
      } else { //depois do status 200 tudo é erro ou warning - pode ignorar
        console.log(response.status);
        this.setError();
      }
    })
    .catch(error => {
    //a alteração que o Gabriel fez (retorno 400 quando não há estatísticas) cai no catch
      if (error.response) {//acho importante manter este porque vc tem uma visão das respostas do server qdo erro/inconsistências
      //dentro deste if pode vir vários code status 
      //os 4xx o server respondeu mas houve algum problema - ou dados incompletos ou neste caso nada a apresentar
      //os 5xx são problemas no lado do servidor e precisa tentar novamente a requisição
        if (error.response.status === 400) { //aqui é o retorno de que não existe estatísticas a serem mostradas
          alert(error.response.data.message);
        }
        console.log(error.response.data.message);
        console.log(error.response.status); //code status
        //console.log(error.response.headers);
      } else if (error.request) {
      //erro no request - não encontrou o server, a rota, etc
        console.log("Request error", error.request);
      } else {
        console.log("Erro", error.message);
      }
    });
};
