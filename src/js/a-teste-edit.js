const modalEdit = document.getElementById('editor');
const visualizacaoEdit = modalEdit.querySelector('#visualizacao');
if (window.location.search.indexOf('modo=editar') > -1) {
    const textEdit = modalEdit.querySelector('#textEdit');
    document.querySelectorAll('main h1, main h2, main p, main h3, main li').forEach(elem => {
        const button = document.createElement('button');
        button.innerHTML = '<img src="/src/img/edit.svg"/>';
        button.className = 'btn-edit';
        button.onclick = (e) => {
            elem.classList.add('edit');
            modalEdit.style.display = 'block';
            textEdit.value = e.target.parentNode.innerHTML.replace(/<button.*?<\/button>/g, "").replace(/\n/g, '').replace(/\r/g, '').replace(/   /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ');
            visualizacaoEdit.innerHTML = e.target.parentNode.outerHTML.replace(/<button.*?<\/button>/g, "");
        }
        elem.appendChild(button);
        if (elem.nodeName == 'LI') {
            const buttonExcluir = document.createElement('button');
            buttonExcluir.innerHTML = '<img src="/src/img/delete.svg"/>';
            buttonExcluir.className = 'btn-edit';
            buttonExcluir.onclick = (e) => {
                const result = confirm('Deseja excluir esse item?');
                if (result) {
                    elem.classList.add('remover');
                    document.getElementById('Atualizar').click();
                }
            }
            elem.appendChild(buttonExcluir);
        }
    });

    textEdit.onkeyup = (e) => {
        visualizacaoEdit.querySelector('h1, h2, p, h3, li').innerHTML = e.target.value;
    };
    function Cancelar() {
        modalEdit.style.display = 'none';
        document.querySelectorAll('main h1.edit, main h2.edit, main p.edit, main h3.edit, main li.edit').forEach(elem => {
            elem.classList.remove('edit');
        })
    }


    document.querySelectorAll('main ul').forEach(ul => {
        const li = document.createElement("li");
        const button = document.createElement('button');
        button.innerHTML = '<img src="/src/img/add.svg"/>';
        button.className = 'btn-edit';
        button.onclick = (e) => {
            li.classList.add('edit');
            modalEdit.style.display = 'block';
            textEdit.value = "";
            visualizacaoEdit.innerHTML = `<li></li>`;//e.target.parentNode.outerHTML.replace('<button class="btn-edit">Editar</button>', '');
        }
        li.appendChild(button);
        ul.appendChild(li);
    });

    const portfolioFotos = document.querySelector('.portfolio-grid');
    if (portfolioFotos) {
        portfolioFotos.innerHTML = `<div><input type="file" id="fileInput" hidden><label for="fileInput" class="upload-btn">
</label></div>` + portfolioFotos.innerHTML;
//<button type="button" class="btn-enviar-foto" onclick="uploadImage()"></button>
        EventoFotos();
        const inputFile = document.getElementById("fileInput");
    //const previewFile = document.getElementById("preview");
    inputFile.addEventListener("change", function () {
        uploadImage();
    });
    }

    
}
async function uploadImage() {
    const file = document.getElementById("fileInput").files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = async function () {
            let user = getCookie('session');
            if (user) {
                user = JSON.parse(user);
                const base64Content = reader.result.split(',')[1];
                const fileName = "img_" + Date.now() + ".png";

                const res = await fetch("https://www.veramiralliacerimonialista.com.br/api/upload", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: fileName, content: base64Content, tipo: 'img', id: user.id })
                }).then(res => res.json()).catch(er => {
                    alert("❌ Erro ao atualizar arquivo: " + err);
                });
                if (res.content && res.content.name == fileName) {
                    document.querySelector('.portfolio-grid input').remove();
                    document.querySelector('.portfolio-grid button').remove();
                    document.querySelector('.portfolio-grid').innerHTML += `<img src="/src/img/eventos/${fileName}" loading="lazy" alt="Evento ${(document.querySelectorAll('.portfolio-grid img').length + 1)}">`;
                    console.log(res);
                    document.getElementById('Atualizar').click();
                }
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Adicione primeiro a imagem para salvar!');
    }



}
