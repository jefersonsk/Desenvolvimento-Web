function popularSecoes() {
    var params = '{}';
    $.ajax({
        type: "GET",
        url: "https://servicodados.ibge.gov.br/api/v2/cnae/secoes",
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg, status) {    
            $("#secao option.sec").remove();        
            for (var i=0; i<msg.length; i++) {
                $("#secao").append("<option class=\"sec\" value=\""+msg[i].id+"\">"+msg[i].descricao+"</option>");
            }
        },
        error: function(xhr, msg, e) {
            alert(xhr.responseJSON.message);
            $("#secao li.sec").remove();
        }
    });
}

function popularGrupos() {
    alert('opa');
}

function validarCnpj() {
    $('#cnpj').mask('00.000.000/0000-00')
}