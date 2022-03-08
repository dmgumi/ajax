// une des problématiques d'AJAX, c'est la gestion des évèhnements sur
// des éléments qui n'existent pas lors du chargement du document; ils vont exister plus tard
// solution -> mettre un écouteur d'évènements* sur tout le documents dès que l'élément va être crée;
// il va lui rattacher les gestionnaire d'évènements
// *syntaxe : $(document).on(évènement, sélecteur, cb);
// si l'élément n'existe pas encore, je lui rattache
// le gestionnaire d'évènements automatiquement à partir du moment où il va exister

$(document).on("click", "#liste-contacts", function (e) {
    e.preventDefault();
    liste();
});

function liste() {
    request = $.ajax({
        type: "GET",
        url: "http://localhost:3000/contacts",
        dataType: "json",
    });

    request.done(function (response) {
        let html = `<table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">#ID</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>`;
        response.map((contact) => {
            html += `
            <tr>
                    <th scope="row">${contact.id}</th>
                    <td>${contact.nom}</td>
                    <td>${contact.prenom}</td>
                    <td>
                        <button type="button" class="btn btn-info modif-contact" id="${contact.id}">
                        <i class="fas fa-edit mr-1"></i>Modifier</button>

                        <button type="button" class="btn btn-danger supp-contact" id="${contact.id}">
                        <i class="fas fa-trash-alt mr-1"></i>Supprimer</button>
                                        
                    </td>
            </tr>
        `;
        });
        html += `    </tbody>
                    </table>`;
        $(".liste").html(html);
    });

    request.fail(function (http_error) {
        let serv_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + serv_msg);
    });
}
