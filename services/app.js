import { buscarAventurasDoAEM, carregarImagemAutenticada } from './api.js';
import { ENV } from '../config.js';

const imagensCenario = document.querySelectorAll('.imagem-cenario');
let indexAtual = 0;

function trocarImagem() {
    if (imagensCenario.length === 0) return;
    imagensCenario[indexAtual].classList.remove('active');
    indexAtual = (indexAtual + 1) % imagensCenario.length;
    imagensCenario[indexAtual].classList.add('active');
}

setInterval(trocarImagem, 5000);

//

const toggleButton = document.getElementById("menu-toggle");
const burguerIcon = document.getElementById("burguer-icon");
const menuMobile = document.getElementById("menu-mobile");

toggleButton.addEventListener("click", () => {
  burguerIcon.classList.toggle("rotated");
  menuMobile.classList.toggle("active");
});


//

const dropdown = document.getElementById('filtro-dificuldade');
const gridAventuras = document.getElementById('grid-aventuras');

async function renderizarAventuras(url) {
    if (!gridAventuras) return;
    
    gridAventuras.innerHTML = '<p>A carregar aventuras do AEM...</p>';

    const dados = await buscarAventurasDoAEM(url);

    gridAventuras.innerHTML = '';

    if (dados && dados.data && dados.data.aventuraList && dados.data.aventuraList.items) {
        const aventuras = dados.data.aventuraList.items;

        if (aventuras.length === 0) {
            gridAventuras.innerHTML = '<p>Nenhuma aventura encontrada para este filtro.</p>';
            return;
        }

        const cardsPromessas = aventuras.map(async (aventura) => {
            const srcImagem = await carregarImagemAutenticada(aventura.imagem?._path);
            const srcInstrutor = await carregarImagemAutenticada(aventura.instrutor?.foto?._path);
            return `
                <div class="card">
                    <img src="${srcImagem}" alt="${aventura.titulo}" class="card-imagem"/>
                    <div style="padding: 10px;">
                        <h3 style="margin: 0px; padding-bottom: 10px; min-height: 2.8em; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${aventura.titulo}</h3>
                        <p style="margin: 0px;"><strong>Dificuldade:</strong> ${aventura.dificuldade}</p>
                        <p style="margin: 0px;"><strong>Preço:</strong> $${aventura.preco}</p>
                    </div>
                    <div style="display: flex; align-items: center;  justify-content: space-between; padding: 10px;">
                        <div>
                            <p style="margin: 0px;"><strong>Instrutor:</strong> ${aventura.instrutor.nome}</p>
                            <p style="margin: 0px;"><strong>Especialidade:</strong> ${aventura.instrutor.especialidades}</p>
                        </div>
                        <img src="${srcInstrutor}" alt="${aventura.instrutor.nome}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"/>
                    </div>
                </div>
            `;
        });

        const cardsHTML = await Promise.all(cardsPromessas);
        gridAventuras.innerHTML = cardsHTML.join('');

    } else {
        gridAventuras.innerHTML = '<p>Erro ao processar dados recebidos do AEM.</p>';
    }
}

if (dropdown) {
    dropdown.addEventListener('change', function() {
        const nivelSelecionado = dropdown.value;
        let endpoint = '';

        if (nivelSelecionado === 'todos') {
            endpoint = `${ENV.AEM_HOST}${ENV.GRAPHQL_ENDPOINT}/allAventuras`;
        } else {
            endpoint = `${ENV.AEM_HOST}${ENV.GRAPHQL_ENDPOINT}/withFilter;nivel=${nivelSelecionado}`;
        }

        renderizarAventuras(endpoint);
    });
}

renderizarAventuras(`${ENV.AEM_HOST}${ENV.GRAPHQL_ENDPOINT}/allAventuras`);