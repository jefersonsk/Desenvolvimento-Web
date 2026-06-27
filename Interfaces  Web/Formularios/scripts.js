function validar() {
    let a = document.getElementById('cpf');
    let p = document.getElementById('peso');
    let q = document.getElementById('erros');

    const regex = /\d{3}.\d{3}.\d{3}-\d{2}/;

    q.innerHTML = '';
    
    let flag = true;

    if (a.value == '' || regex.test(a.value) == false) {
        //alert('CPF é obrigatório');
        q.innerHTML += '<li>CPF é obrigatório e deve conter apenas núemros</li>';
        a.classList.toggle("borda_erro");
        flag = false;
    } else {
        a.classList.remove("borda_erro");
    }

    if (p.value == '' || isNaN(p.value) || p.value <= 0) {
        //alert('Peso deve ser maior que 0 e um número');
        q.innerHTML += '<li>Peso deve ser maior que 0 e um número</li>';
        p.style = "border: 3px solid red"; 
        flag = false;
    } else {
        p.style = ""; 
    }

    return flag;
}

function mascaraCPF(input) {
    // 1. Remove tudo que não é número
    let valor = input.value.replace(/\D/g, '');

    // 2. Limita a 11 dígitos
    valor = valor.substring(0, 11);

    // 3. Aplica a máscara (###.###.###-##)
    valor = valor.replace(/^(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após 3º dígito
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3'); // Adiciona ponto após 6º dígito
    valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4'); // Adiciona traço após 9º dígito

    // 4. Atualiza o valor do input
    input.value = valor;
}