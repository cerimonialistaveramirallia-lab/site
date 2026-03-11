const btnWts = document.getElementById('btn-whatsapp');
        const modal = document.getElementById("modal-whats");

        function getCookie(name) {
            const cookies = document.cookie.split('; ');
            for (const cookie of cookies) {
                const [key, value] = cookie.split('=');
                if (key === name) return value;
            }
            return null; // cookie não encontrado
        }
        function Editar() {
            window.location.href = window.location.href + '?modo=editar';
        }
        document.addEventListener('DOMContentLoaded', () => {
            btnWts.onclick = function () {
                modal.style.display = "block";
                let ntf = document.querySelector('.ntf-wts');
                if (ntf) {
                    ntf.remove();
                    sessionStorage.setItem('notificao-whatsapp', 'true');
                }
            }
            modal.querySelector('.close-modal').onclick = function () {
                modal.style.display = "none";
            }
            setTimeout(function () {
                let value = sessionStorage.getItem('notificao-whatsapp');
                if (!value) {
                    let elemNtf = document.createElement('div');
                    elemNtf.className = "ntf-wts"
                    elemNtf.textContent = '1';
                    btnWts.appendChild(elemNtf);
                }
            }, 600);
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            let user = getCookie('session');
            if (user) {
                user = JSON.parse(user);

                document.getElementById('login').innerHTML = `<button id="dropdownButton"><img src="/src/img/user.svg" width="24" height="24" /><span class="abreviar">${user.name}</span></button>
<ul id="dropdownMenu" class="dropdown-content">
  <li onclick="Editar()">Editar página</li>
  <li id="logoutBtn">Sair</li>
</ul>
`;
                const button = document.getElementById('dropdownButton');
                const menu = document.getElementById('dropdownMenu');

                button.addEventListener('click', () => {
                    // Toggle display do menu
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                });

                // Fecha o menu se clicar fora dele
                window.addEventListener('click', (e) => {
                    if (!button.contains(e.target) && !menu.contains(e.target)) {
                        menu.style.display = 'none';
                    }
                });

                const logoutBtn = document.getElementById('logoutBtn');

                logoutBtn.addEventListener('click', () => {
                    document.cookie = `session=; path=/; max-age=1; Secure; SameSite=Strict`;
                    window.location.reload();
                });
            }
        });