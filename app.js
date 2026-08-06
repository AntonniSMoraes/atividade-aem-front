const cenarios = [
    'res/cenarios/aventurasAquaticas.png',
    'res/cenarios/escaladasCorajosas.png',
    'res/cenarios/montanhasNevadas.png',
    'res/cenarios/saltosRadicais.png',
    'res/cenarios/trilhasFlorestais.png',
];

let indexAtual = 0;
const imagemElemento = document.getElementById('imagem-cenario');

function trocarImagem() {
    imagemElemento.classList.add('fade-out');

    setTimeout(() => {
        indexAtual = (indexAtual + 1) % cenarios.length;
        imagemElemento.src = cenarios[indexAtual];

        imagemElemento.classList.remove('fade-out');
    }, 1000); 
}

setInterval(trocarImagem, 5000);