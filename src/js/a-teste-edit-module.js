import { Octokit } from "https://esm.sh/@octokit/core";

export function AtualizarConteudo() {
    const token = "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"; // ⚠️ nunca exponha isso em produção!
    const owner = "tiago-creator";
    const repo = "cerimonialista";
    const path = document.getElementById('editor').dataset.pagina;
    const octokit = new Octokit({ auth: token });

    function toBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    document.getElementById('Atualizar').onclick = async () => {
        let podeSalvar = confirm('Confirme para Ok para salvar!');
        if (podeSalvar) {
            // Atualiza conteúdo do editor
            const textEdit = document.getElementById('textEdit'); // Certifique-se de ter esse elemento
            const edit = document.querySelector('.edit');
            if (edit) {
                edit.innerHTML = textEdit.value;
                edit.classList.remove('edit');
                document.querySelectorAll('.btn-edit').forEach(elem => {
                    if(elem.parentNode.tagName == 'LI' && elem.parentNode.innerText.trim() == 'Adicionar novo item'){
                        elem.parentNode.remove();
                    } else
                        elem.remove()
                });
                textEdit.value = "";
                visualizacaoEdit.innerHTML = "";
            }

            const itemRemover = document.querySelector('.remover');
            if (itemRemover)
                itemRemover.remove()

            if(modalEdit)
                modalEdit.style.display = 'none';

            // Pega HTML da página
            const conteudo = document.documentElement.outerHTML;
            const base64 = toBase64(conteudo);

            // Pega SHA do arquivo existente (se houver)
            let sha;
            try {
                const arquivo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                    owner,
                    repo,
                    path
                });
                sha = arquivo.data.sha;
            } catch (error) {
                if (error.status !== 404) throw error;
                // 404 = arquivo não existe
            }

            try {
                const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner,
                    repo,
                    path,
                    message: "Atualiza arquivo via Octokit",
                    committer: {
                        name: "Tiago Creator",
                        email: "tiago@exemplo.com"
                    },
                    content: base64,
                    sha // apenas se o arquivo existe
                });

                console.log("✅ Arquivo atualizado com sucesso!");
                console.log("Commit URL:", response.data.commit.html_url);
                let value = confirm('Atualizado com sucesso!, as alterações podem demorar para aparecer!');
                if (value) {
                    window.location.reload();
                }
            } catch (err) {
                alert("❌ Erro ao atualizar arquivo: " + err);
            } finally {
                //modalEdit.style.display = 'block';
            }
        }
    }
}
