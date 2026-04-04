
export function AtualizarConteudo() {
    const path = document.getElementById('editor').dataset.pagina;

    function toBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    document.getElementById('salvar').onclick = async (e) => {
        let podeSalvar = confirm('Confirme para Ok para salvar!');
        if (podeSalvar) {
            let user = getCookie('session');
            if (user) {
                user = JSON.parse(user);
                document.querySelectorAll('.btn-edit').forEach(elem => {
                    if (elem.parentNode.tagName == 'LI' && elem.parentNode.innerText.trim() == '') {
                        elem.parentNode.remove();
                    } else
                        elem.remove()
                });

                const login = document.getElementById('login');
                if (login) {
                    login.innerHTML = `<a href="/entrar?ref=${window.location.pathname}">Entrar</a>`;
                }

                const elemAdicionarFoto = document.querySelector('.portfolio-grid div');
                if (elemAdicionarFoto)
                    elemAdicionarFoto.remove();

                document.querySelectorAll('.portfolio-grid button').forEach(x => {
                    x.remove();
                })

                const btnWhats = document.getElementById("btn-whatsapp");
                if (btnWhats) {
                    const ntfWts = btnWhats.querySelector('.ntf-wts');
                    if (ntfWts)
                        ntfWts.remove();
                }

                const itemRemover = document.querySelector('.remover');
                if (itemRemover)
                    itemRemover.remove()

                if (modalEdit)
                    modalEdit.style.display = 'none';

                e.target.style.display = "";

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
                    let value = confirm('Atualizado com sucesso!, as alterações podem demorar para aparecer! aguarde para fazer nova alteração');
                    window.location.reload();
                } else {
                    e.target.style.display = "block";
                    CarregaLogin();
                    ModoEditar();
                }
            }
        }
    };

    document.getElementById('Atualizar').onclick = async () => {
        // Atualiza conteúdo do editor
        const textEdit = document.getElementById('textEdit'); // Certifique-se de ter esse elemento
        const edit = document.querySelector('.edit');
        if (edit) {
            edit.innerHTML = textEdit.value;

            //ver se alteração foi link
            const link = edit.querySelector('a')
            if(link && link.href.indexOf('tel:') > -1){
                link.href = `tel:0${link.textContent.replace('(', '').replace(')', '').replace('-', '').replace(/ /g, '')}`;
            }

            edit.classList.remove('edit');
            textEdit.value = "";
            visualizacaoEdit.innerHTML = "";

            const button = document.createElement('button');
            button.innerHTML = '<img src="/src/img/edit.svg"/>';
            button.className = 'btn-edit';
            button.onclick = (e) => {
                edit.classList.add('edit');
                modalEdit.style.display = 'block';
                textEdit.value = e.target.parentNode.innerHTML.replace(/<button.*?<\/button>/g, "").replace(/\n/g, '').replace(/\r/g, '').replace(/   /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ');
                visualizacaoEdit.innerHTML = e.target.parentNode.outerHTML.replace(/<button.*?<\/button>/g, "");
            }
            edit.appendChild(button);
            if (edit.nodeName == 'LI') {
                const buttonExcluir = document.createElement('button');
                buttonExcluir.innerHTML = '<img src="/src/img/delete.svg"/>';
                buttonExcluir.className = 'btn-edit';
                buttonExcluir.onclick = (e) => {
                    const result = confirm('Deseja excluir esse item?');
                    if (result) {
                        edit.classList.add('remover');
                        document.getElementById('Atualizar').click();
                    }
                }
                edit.appendChild(buttonExcluir);
            }
        }
        modalEdit.style.display = 'none';
    }
}
