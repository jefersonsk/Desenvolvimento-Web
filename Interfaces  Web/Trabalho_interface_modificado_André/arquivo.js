const form = document.getElementById('form-aluno');
const inputMatricula = document.getElementById('matricula');
const inputNome = document.getElementById('nome-aluno');
const inputCpf = document.getElementById('cpf-aluno');
const inputDataNasc = document.getElementById('data-nasc');
const inputCep = document.getElementById('cep-aluno');
const btnCep = document.getElementById('btn-consultar-cep');

// Inputs de endereço para preenchimento automático
const inputLogradouro = document.getElementById('logradouro');
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');

// Elementos do componente Associação
const selectDisponiveis = document.getElementById('cursos-disponiveis');
const selectAssociados = document.getElementById('cursos-associados');
const btnRight = document.getElementById('move-right');
const btnLeft = document.getElementById('move-left');

// 1. Transformação dinâmica em Caixa Alta para o Nome
inputNome.addEventListener('input', function() {
  this.value = this.value.toUpperCase();
});

// 2. Máscara e Validação de Entrada da Matrícula (Formato XX.XXXXXX)
inputMatricula.addEventListener('input', function() {
  let v = this.value.replace(/\D/g, "");
  if (v.length > 2) v = v.substring(0,2) + "." + v.substring(2,8);
  this.value = v;
});

// 3. Máscara de Entrada para o CPF (Formato XXX.XXX.XXX-XX)
inputCpf.addEventListener('input', function() {
  let v = this.value.replace(/\D/g, "");
  if (v.length > 9) {
    v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  } else if (v.length > 6) {
    v = v.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
  } else if (v.length > 3) {
    v = v.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
  }
  this.value = v;
});

// 4. Somente Números no campo CEP
inputCep.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, "");
});

// 5. Integração com o WebService da API ViaCEP
btnCep.addEventListener('click', () => {
  const cep = inputCep.value.trim();
  if (cep.length !== 8) {
    alert('Por favor, informe um CEP válido contendo exatamente 8 dígitos numéricos.');
    return;
  }

  inputLogradouro.value = "Buscando...";
  inputBairro.value = "Buscando...";
  inputCidade.value = "Buscando...";
  inputEstado.value = "Buscando...";

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(dados => {
      if (dados.erro) {
        alert('CEP não localizado.');
        limparCamposEndereco();
      } else {
        inputLogradouro.value = dados.logradouro || '';
        inputBairro.value = dados.bairro || '';
        inputCidade.value = dados.localidade || '';
        inputEstado.value = dados.uf || '';
      }
    })
    .catch(() => {
      alert('Falha ao consultar o serviço de CEP.');
      limparCamposEndereco();
    });
});

function limparCamposEndereco() {
  inputLogradouro.value = ''; 
  inputBairro.value = ''; 
  inputCidade.value = ''; 
  inputEstado.value = '';
}

// Ao limpar o formulário (botão cancelar), limpa também os campos readonly
form.addEventListener('reset', () => {
  limparCamposEndereco();
});

// 6. Carga do Serviço Web de Cursos do IFRS para o campo Associação
window.addEventListener('DOMContentLoaded', () => {
  fetch('https://ingresso.ifrs.edu.br/prematricula/ws/listarCursosIW20242.php')
    .then(res => res.json())
    .then(cursos => {
      selectDisponiveis.innerHTML = '';
      cursos.forEach(curso => {
        const opt = document.createElement('option');
        // Usa o código do curso como valor e trata o nome do curso vindo da API
        opt.value = curso.codigo || curso.id;
        opt.textContent = curso.nome || curso.curso;
        selectDisponiveis.appendChild(opt);
      });
    })
    .catch(() => {
      console.error("Erro ao popular o catálogo de cursos IFRS.");
      selectDisponiveis.innerHTML = '<option disabled>Erro ao carregar cursos</option>';
    });
});

// Lógica de manipulação de itens da Associação (Dual List)
btnRight.addEventListener('click', () => moverItens(selectDisponiveis, selectAssociados));
btnLeft.addEventListener('click', () => moverItens(selectAssociados, selectDisponiveis));

function moverItens(origem, destino) {
  const selecionados = Array.from(origem.selectedOptions);
  selecionados.forEach(opt => {
    destino.appendChild(opt);
    opt.selected = false;
  });
}

// 7. Algoritmo Oficial de Validação do CPF da Receita Federal
function validaCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/^(\d)\1{10}$/)) return false;
  
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

// 8. Validação Geral do Formulário no Evento Submit (Salvar)
form.addEventListener('submit', function(event) {
  // Validação da máscara da Matrícula
  const regexMatricula = /^\d{2}\.\d{6}$/;
  if (!regexMatricula.test(inputMatricula.value)) {
    event.preventDefault();
    alert('A Matrícula deve obrigatoriamente seguir o formato XX.XXXXXX');
    inputMatricula.focus();
    return;
  }

  // Validação Matemática do CPF
  if (!validaCPF(inputCpf.value)) {
    event.preventDefault();
    alert('Algoritmo de Segurança: O número de CPF informado é inválido de acordo com a Receita Federal.');
    inputCpf.focus();
    return;
  }

  // Validação da Idade Mínima de 14 Anos
  if (!inputDataNasc.value) {
    event.preventDefault();
    alert('Por favor, insira a data de nascimento.');
    inputDataNasc.focus();
    return;
  }

  const dataNasc = new Date(inputDataNasc.value);
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }

  if (idade < 14) {
    event.preventDefault();
    alert('Incompatibilidade cadastral: O Instituto não admite matrículas de alunos menores de 14 anos.');
    inputDataNasc.focus();
    return;
  }

  // Validação para garantir que o endereço foi consultado e preenchido
  if (!inputLogradouro.value || inputLogradouro.value === "Buscando...") {
    event.preventDefault();
    alert('Por favor, informe um CEP válido e clique em "Consultar CEP" antes de salvar.');
    inputCep.focus();
    return;
  }

  // Validação da Caixa de Associação (Mínimo de 1 curso selecionado)
  if (selectAssociados.options.length === 0) {
    event.preventDefault();
    alert('O aluno deve estar associado a pelo menos um curso.');
    selectDisponiveis.focus();
    return;
  }

  // Requisito Técnico Crucial: Seleciona todos os itens da caixa de destino
  // para garantir que os valores sejam enviados no payload HTTP POST (no array cursos_vinculados[])
  Array.from(selectAssociados.options).forEach(opt => opt.selected = true);
});