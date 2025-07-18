import fs from 'fs/promises'

export async function carregarHTML(caminho, dados = {}) {
    let html = await fs.readFile(caminho, 'utf-8');

    for (const chave in dados) {
        const valor = dados[chave];
        html = html.replaceAll(`{{${chave}}}`, valor);
    }

    return html;
}