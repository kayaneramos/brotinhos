const homeScreen = document.getElementById("homeScreen");
const gardenScreen = document.getElementById("gardenScreen");
const finalScreen = document.getElementById("finalScreen");

const startBtn = document.getElementById("startBtn");
const finishBtn = document.getElementById("finishBtn");
const backBtn = document.getElementById("backBtn");
const finalText = document.getElementById("finalText");
const pixelProgress = document.getElementById("pixelProgress");
const clickSound = document.getElementById("clickSound");
const bloomSound = document.getElementById("bloomSound");

startBtn.addEventListener("click", function () {

  playClick();

  homeScreen.classList.remove("active");
  gardenScreen.classList.add("active");
});

finishBtn.addEventListener("click", function () {

   playClick();

  const total = sproutList.children.length;
  const concluidos = sproutList.querySelectorAll(".done").length;

  let porcentagem = 0;

  if (total > 0) {
    porcentagem = Math.round((concluidos / total) * 100);
  }

  finalText.innerHTML =
    `Hoje floresceram ${concluidos} de ${total} brotinhos.
    <img src="assets/flor.png" class="final-flower">
    <br>Crescimento do jardim: ${porcentagem}%`;

  gardenScreen.classList.remove("active");
  finalScreen.classList.add("active");
});

backBtn.addEventListener("click", function () {

  playClick();

  sproutList.innerHTML = "";
  sproutInput.value = "";

  atualizarProgresso();

  finalScreen.classList.remove("active");
  homeScreen.classList.add("active");
});


// data atual


const dateText = document.getElementById("dateText");

const hoje = new Date();

dateText.innerHTML =
  hoje.getDate() + "<br>" +
  hoje.toLocaleString("pt-BR", { month: "long" });


  // elementos brotinhos


const sproutInput = document.getElementById("sproutInput");
const addBtn = document.getElementById("addBtn");
const sproutList = document.getElementById("sproutList");
const progressText = document.getElementById("progressText");


// plantar brotinho


addBtn.addEventListener("click", function () {

  playClick();

  const texto = sproutInput.value;

  if(texto === ""){
    return;
  }

  const novoBrotinho = document.createElement("li");

 novoBrotinho.innerHTML = `
  <img src="assets/brotinho.png.png" class="task-icon">
  <span>${texto}</span>
  <button class="delete-btn">✕</button>
`;


const deleteBtn = novoBrotinho.querySelector(".delete-btn");

deleteBtn.addEventListener("click", function(event){

    event.stopPropagation();

    playClick();

    novoBrotinho.remove();

    atualizarProgresso();
    salvarBrotinhos();

});


  novoBrotinho.addEventListener("click", function () {

  if(novoBrotinho.classList.contains("done")){
    novoBrotinho.classList.remove("done");
    novoBrotinho.innerHTML = `
  <img src="assets/brotinho.png.png" class="task-icon">
  <span>${texto}</span>
`;
  } else {
    novoBrotinho.classList.add("done");

    playBloom();

    novoBrotinho.innerHTML = `
  <img src="assets/flor.png" class="task-icon flower-animation">
  <span>${texto}</span>
  <button class="delete-btn">✕</button>
`;
  }

  atualizarProgresso();

  salvarBrotinhos();

});

  sproutList.appendChild(novoBrotinho);

sproutInput.value = "";

atualizarProgresso();

salvarBrotinhos();

});

function atualizarProgresso() {
  const total = sproutList.children.length;
  const concluidos = sproutList.querySelectorAll(".done").length;

  let porcentagem = 0;

  if (total > 0) {
    porcentagem = Math.round((concluidos / total) * 100);
  }

  progressText.textContent = porcentagem + "%";

  const blocos = document.querySelectorAll(".pixel-block");
  const blocosAtivos = Math.round((porcentagem / 100) * blocos.length);

  blocos.forEach((bloco, index) => {
    if (index < blocosAtivos) {
      bloco.classList.add("active");
    } else {
      bloco.classList.remove("active");
    }
  });
  
}

function criarBarraPixel() {
  pixelProgress.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const bloco = document.createElement("span");
    bloco.classList.add("pixel-block");
    pixelProgress.appendChild(bloco);
  }
}

criarBarraPixel();

carregarBrotinhos();


function playClick(){
    if (!clickSound) return;

    clickSound.currentTime = 0;
    clickSound.volume = 0.3;

    clickSound.play().catch(function(error){
        console.log("Som bloqueado ou arquivo não encontrado");
    });
}


function playBloom(){
    if (!bloomSound) return;

    bloomSound.currentTime = 0;
    bloomSound.volume = 0.4;

    bloomSound.play().catch(function(error){
        console.log("Som de florescer bloqueado ou arquivo não encontrado");
    });
}


function salvarBrotinhos(){
    const brotinhos = [];

    sproutList.querySelectorAll("li").forEach(function(item){
        const texto = item.querySelector("span").textContent;
        const concluido = item.classList.contains("done");

        brotinhos.push({
            texto: texto,
            concluido: concluido
        });
    });

    localStorage.setItem("brotinhos", JSON.stringify(brotinhos));
}


function carregarBrotinhos(){

    const dados = localStorage.getItem("brotinhos");

    if(!dados){
        return;
    }

    const brotinhos = JSON.parse(dados);

    brotinhos.forEach(function(item){

        const novoBrotinho = document.createElement("li");

        if(item.concluido){

            novoBrotinho.classList.add("done");

            novoBrotinho.innerHTML = `
                <img src="assets/flor.png" class="task-icon">
                <span>${item.texto}</span>
            `;

        } else {

            novoBrotinho.innerHTML = `
                <img src="assets/brotinho.png.png" class="task-icon">
                <span>${item.texto}</span>
            `;

        }

        novoBrotinho.addEventListener("click", function(){

            if(novoBrotinho.classList.contains("done")){

                novoBrotinho.classList.remove("done");

                novoBrotinho.innerHTML = `
                    <img src="assets/brotinho.png.png" class="task-icon">
                    <span>${item.texto}</span>
                `;

            } else {

                novoBrotinho.classList.add("done");

                playBloom();

                novoBrotinho.innerHTML = `
                    <img src="assets/flor.png" class="task-icon flower-animation">
                    <span>${item.texto}</span>
                `;

            }

            atualizarProgresso();
            salvarBrotinhos();

        });

        sproutList.appendChild(novoBrotinho);

    });

    atualizarProgresso();

}