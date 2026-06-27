function validar() {
    
    const regexSigla = /^[A-Z]{3,5}$/;
    const dataInicio = new Date('1890-01-01');

    var controle = true;
    var s = document.getElementById("sigla");
    var n = document.getElementById("nome");
    var uf = document.getElementById("estado");
    var d = document.getElementById("data");
    var dataFim = new Date(d.value);

    var e = document.getElementById("erros");

    e.innerHTML = '';

    if (s.value == '' || regexSigla.test(s.value) === false) {
        e.innerHTML += "<li>Sigla é obrigatória e conter de três a cinco letras maiúsculas!!!</li>";
        s.style = "background-color: #FF0000";
        controle = false;
    } else {
        s.style = "background-color: #FFFFFF";
    }

    if (n.value == '' || n.value.length < 20 || n.value.length > 100) {
        e.innerHTML += "<li>Nome é obrigatório e ter de 20 a 100 caracteres!!!</li>";
        n.style = "background-color: #FF0000";
        controle = false;
    } else {
        n.style = "background-color: #FFFFFF";
    }

    if (d.value == '' || (dataFim.getTime() < dataInicio.getTime())) {
        e.innerHTML += "<li>Data de fundação é obrigatória e ser marior que 01 de janeiro de 1890!!!</li>";
        d.style = "background-color: #FF0000";
        controle = false;
    } else {
        d.style = "background-color: #FFFFFF";
    }

    if (uf.value == '') {
        e.innerHTML += "<li>Estado é obrigatório!!!</li>";
        uf.style = "background-color: #FF0000";
        controle = false;
    } else {
        uf.style = "background-color: #FFFFFF";
    }

    return controle;
}

function validarJQuery() {
    $('#erros').empty();

    const regexSigla = /^[A-Z]{3,5}$/;

    var x = $('.obg');
    for (var i=0; i<x.length; i++) {
        if (x[i].value == '') {
            $('#erros').append('<li>Campus "'+$('label[for="'+x[i].id+'"]').text()+'" obrigatório!!!</li>');
            x[i].style = 'background-color: #FF0000';
        } else {
            x[i].style = 'background-color: #FFFFFF';
        }
    }
    
    if ($('#sigla').val() == '' || regexSigla.test($('#sigla').val()) === false) {
        $('#sigla').after('<p>Sigla deve conter de três a cinco letras maiúsculas!!!</p>');
        $('#sigla').css('background-color', 'red');
        controle = false;
    } else {
        $('#sigla').css('background-color', 'white');
    }

    return controle;
}

function buscarcep() {
    var params = '{}';
    $.ajax({
        type: "GET",
        url: "https://viacep.com.br/ws/"+$('#cep').val()+"/json/",
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg, status) {    
            $('#logradouro').val(msg.logradouro);
            $('#bairro').val(msg.bairro);
            $('#cidade').val(msg.localidade);
            $('#estado').val(msg.uf);
        },
        error: function(xhr, msg, e) {
            alert(xhr.responseJSON.message);
        }
    });
}

function popularEstudantes() {
    var params = '{}';

   $('#corpotab').empty();

    $.ajax({
        type: "GET",  
        url: "https://ensino.ifrs.edu.br/auxilioestudantil/ws/ApiEstudantes.php?nome="+$('#nome').val()+"&unidade=11",
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg, status) {
            for (var i=0; i<msg.length; i++) {
                $('#corpotab').append("<tr><td>"+msg[i].id+"</td><td>"+msg[i].nome+"</td><td>"+msg[i].cpf+"</td></tr>")
            }
        },
        error: function(xhr, msg, e) {
            alert(JSON.stringify(xhr));
        }
    });  
}

$(document).ready(function () {
    popularEstudantes();
    
    $('.DataTable').each(function () {
        var table = $(this);

        table.DataTable({
            paging: true,
            ordering: true,
            language: { 
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json"
            },
            columnDefs: [
                { orderable: true, targets: 0 } 
            ],
			order: [[1, 'asc']]
        });
    });
});