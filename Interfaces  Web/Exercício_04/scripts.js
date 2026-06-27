function validar() {
    let verificar_sigla = document.getElementById('sigla')
    const regexSigla = /^[A-Z]{3,5}$/;
    const dataInicio = new Date ('1890-1-1')

    var controle = true

    var s = document.getElementById("sigla")
    var n = document.getElementById("nome")
    var e = document.getElementById("erros")

    e.innerHTML = '';

    if (regexSigla.test(s.value) === false) {
        e.innerHTML += '<li>Erro: Sigla deve conter de 3 a 5 letras maiúsculas.<\li>'
        controle = false
    }

    if (verificar_sigla.value == '') {
        e.innerHTML += '<li>Erro: Sigla obrigatória.<\li>'
        controle = false
    }

    if (verificar_nome.value == '') {
        e.innerHTML += '<li>Erro: Sigla obrigatória.<\li>'
        controle = false
    }

}