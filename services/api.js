import { ENV } from '../config.js';

export async function buscarAventurasDoAEM(endpointUrl) {
    try {
        const response = await fetch(endpointUrl, {
            method: 'GET',
            headers: ENV.HEADERS,
        });

        if (!response.ok) {
            throw new Error(`Status HTTP: ${response.status}`);
        }
        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Erro na requisição ao AEM:', error);
        return null;
    }
}

export async function buscarMagazineDoAEM() {
    try {
        const response = await fetch(`${ENV.AEM_HOST}${ENV.ULTIMAS_JSON}`, {
            method: 'GET',
            headers: ENV.HEADERS,
        });

        if (!response.ok) {
            throw new Error(`Status HTTP: ${response.status}`);
        }
        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Erro na requisição ao AEM:', error);
        return null;
    }
}

export async function carregarImagemAutenticada(caminhoImagem) {
    if (!caminhoImagem) return 'res/cenarios/aventurasAquaticas.png';

    const urlCompleta = `${ENV.AEM_HOST}${caminhoImagem}`;

    try {
        const response = await fetch(urlCompleta, {
            method: 'GET',
            headers: ENV.HEADERS
        });

        if (!response.ok) throw new Error('Erro ao carregar imagem');

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Erro ao carregar imagem do AEM:', error);
        return 'res/cenarios/aventurasAquaticas.png';
    }
}