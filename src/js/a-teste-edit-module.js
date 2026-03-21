
export function AtualizarConteudo() {
    const path = document.getElementById('editor').dataset.pagina;

    function toBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    document.getElementById('Atualizar').onclick = async () => {
        let podeSalvar = confirm('Confirme para Ok para salvar!');
        if (podeSalvar) {
            let user = getCookie('session');
            if (user) {
                user = JSON.parse(user);
                // Atualiza conteúdo do editor
                const textEdit = document.getElementById('textEdit'); // Certifique-se de ter esse elemento
                const edit = document.querySelector('.edit');
                if (edit) {
                    edit.innerHTML = textEdit.value;
                    edit.classList.remove('edit');
                    document.querySelectorAll('.btn-edit').forEach(elem => {
                        if (elem.parentNode.tagName == 'LI' && elem.parentNode.innerText.trim() == '') {
                            elem.parentNode.remove();
                        } else
                            elem.remove()
                    });
                    textEdit.value = "";
                    visualizacaoEdit.innerHTML = "";
                }

                const elemAdicionarFoto = document.querySelector('.portfolio-grid div');
                if(elemAdicionarFoto)
                    elemAdicionarFoto.remove();
                
                const btnWhats= document.getElementById("btn-whatsapp");
                if(btnWhats){
                    const ntfWts = btnWhats.querySelector('.ntf-wts');
                    if(ntfWts)
                        ntfWts.remove();
                }

                const itemRemover = document.querySelector('.remover');
                if (itemRemover)
                    itemRemover.remove()

                if (modalEdit)
                    modalEdit.style.display = 'none';

                // Pega HTML da página
                const conteudo = document.documentElement.outerHTML;
                const base64 = toBase64(conteudo);



                const res = await fetch("https://www.veramiralliacerimonialista.com.br/api/upload", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path, content: base64, tipo: 'html', id: user.id })
                }).then(res => res.json()).catch(er => {
                    alert("❌ Erro ao atualizar arquivo: " + err);
                });

                if (res.content) {
                    let value = confirm('Atualizado com sucesso!, as alterações podem demorar para aparecer!');
                    if (value) {
                        window.location.reload();
                    }
                }
            }

        }
    }
}
