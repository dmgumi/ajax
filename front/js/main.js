// une des problématiques d'AJAX, c'est la gestion des évènements sur
// des éléments qui n'existent pas lors du chargement du document; ils vont exister plus tard
// solution -> mettre un écouteur d'évènements* sur tout le documents dès que l'élément va être crée;
// il va lui rattacher les gestionnaire d'évènements
// *syntaxe : $(document).on(évènement, sélecteur, cb);
// si l'élément n'existe pas encore, je lui rattache
// le gestionnaire d'évènements automatiquement à partir du moment où il va exister

// si la route admet la réception des données il faut les lui transmettre au format .json dans l'attribut data (voir param AJAX)
// -> voir ligne 82

// pour le TP: adresse mail tel categorie (famille, amis, travail, autres)

$("section").hide();

$("section #tableau").show();

$(document).on("click", "#liste-contacts", function (e) {
    e.preventDefault();
    liste();
});

$(document).on("click", "#nv-contact", function (e) {
    e.preventDefault();
    $("section").hide();
    $(".ajout-contact").show();
});

$(document).on("submit", ".ajout-contact form", function (e) {
    e.preventDefault();
    ajoutContact();
});

$(document).on("click", "button.modif-contact ", function (e) {
    $("section").hide();
    $("section.modif-contact").show();
    modifContact($(this).attr("id"));
});

$(document).on("submit", ".modif-contact form", function (e) {
    e.preventDefault();
    majContact($(".modif-contact .maj-contact ").attr("id"));
});

$(document).on("click", ".supp-contact", function () {
    suppContact($(this).attr("id"));
});

$(document).on("click", "#tableau", function (e) {
    e.preventDefault();
    tableau();
});

function liste() {
    let request = $.ajax({
        type: "GET",
        url: "http://localhost:3000/contacts",
        dataType: "json",
    });

    request.done(function (response) {
        let html = "";
        if (response.length !== 0) {
            html += ` 
			<span id="haut"></span>
			<h1 class="font-weight-bold">Liste des contacts </h1>
			<table class="table table-striped">
				<thead class="thead-dark">
					<tr>
						<th scope="col">Nom</th>
						<th scope="col">Prénom</th>
						<th scope="col">Adresse</th>
						<th scope="col">Email</th>
						<th scope="col">Téléphone</th>
						<th scope="col" class="text-center">Catégorie</th>
						<th scope="col"></th>
					</tr>
				</thead>
				<tbody>
					`;
            response.map((contact) => {
                html += `
			<tr>
					<td>${contact.nom}</td>
					<td>${contact.prenom}</td>
					<td>${contact.adresse}</td>
					<td>${contact.email}</td>
					<td>${contact.telephone}</td>
					<td>
						<span class="badge badge-success w-100 p-3">${contact.categorie}</span>
					</td>
					<td>
						<button type="button" class="btn btn-primary modif-contact" id="${contact.id}"><i class="fas fa-edit mr-1"></i></button>

						<button type="button" class="btn btn-danger supp-contact" id="${contact.id}"><i class="fas fa-trash-alt mr-1"></i></button>
										
					</td>
			</tr>
			`;
            });

            html += `	
						</tbody>
						<a href="#haut" id="retour" class="btn btn-success" ><i class="fas fa-angle-double-up"></i> Retour en haut</a>
					</table>`;
        } else {
            html = `
			<div class="alert alert-danger" role="alert">
  			Aucun contact ne figure dans la liste.
			</div>`;
        }
        $(".liste").html(html);
        $("section").hide();
        $(".liste").show();
    });

    request.fail(function (http_error) {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
    });
}
function ajoutContact() {
    let request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/contacts",
        data: {
            id: new Date().getTime(),
            nom: $("#nom").val(),
            prenom: $("#prenom").val(),
            adresse: $("#address").val(),
            email: $("#email").val(),
            telephone: $("#phone").val(),
            categorie: $("#category").val(),
        },
        dataType: "json",
    });

    request.done(function (response) {
        liste();
    });

    request.fail(function (http_error) {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
    });
}

function modifContact(id) {
    let request = $.ajax({
        type: "GET",
        url: `http://localhost:3000/contacts/${id}`,
        dataType: "json",
    });

    request.done(function (response) {
        $(".modif-contact #nom").val(response.nom);
        $(".modif-contact #prenom").val(response.prenom);
        $(".modif-contact #address").val(response.adresse);
        $(".modif-contact #email").val(response.email);
        $(".modif-contact #phone").val(response.telephone);
        $(".modif-contact #category").val(response.categorie);
        $("button.maj-contact").attr("id", response.id);
    });

    request.fail(function (http_error) {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
    });
}

function majContact(id) {
    let request = $.ajax({
        type: "PUT",
        url: `http://localhost:3000/contacts/${id}`,
        data: {
            nom: $(".modif-contact #nom").val(),
            prenom: $(".modif-contact #prenom").val(),
            adresse: $(".modif-contact #address").val(),
            email: $(".modif-contact #email").val(),
            telephone: $(".modif-contact #phone").val(),
            categorie: $(".modif-contact #category").val(),
        },
        dataType: "json",
    });

    request.done(function (response) {
        liste();
    });

    request.fail(function (http_error) {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
    });
}

function suppContact(id) {
    let request = $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/contacts/${id}`,
        dataType: "json",
    });

    request.done(function (response) {
        liste();
    });

    request.fail(function (http_error) {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
    });
}

function tableau() {
    let request = $.ajax({
        type: "GET",
        url: "http://localhost:3000/contacts",
        dataType: "json",
    });

    request.done(function (response) {
        let famille = 0;
        let amis = 0;
        let travail = 0;
        let autres = 0;

        response.map((contact) => {
            if (contact.categorie === "Famille") {
                famille += 1;
            }
            if (contact.categorie === "Amis") {
                amis += 1;
            }
            if (contact.categorie === "Travail") {
                travail += 1;
            }
            if (contact.categorie === "Autres") {
                autres += 1;
            }
        });

        html = `
<div class="container row mx-auto">

    <div class="col-md-4 p-3">
        <div class="jumbotron p-4">
            <div class="p-3">
                <h5>
					Nombre de catégories: 
					<span class="badge badge-success col-md-2 ml-auto">${$("#category").children().length}</span>
				</h5>
            </div>
            <div class="p-3">
                <h5 class="card-text">
					Nombre de contacts: 
					<span class="badge badge-success col-md-2 ml-auto">${response.length}</span>
				</h5>
            </div>
        </div>
        <div class="jumbotron">
			${config}
        </div>
    </div>


    <div class="jumbotron col-md-8">
        <h2 class="font-weight-bold p-3">Nombre de contacts | catégorie</h2>
        <h4><span class="col-md-8">Contacts dans la catégorie </span>
            <span class="btn btn-secondary col-md-2">Famille</span>
			<span class="col-md-1"> : </span>
            <span class="badge badge-success col-md-1"> ${famille}</span>
        </h4>
        <h4><span class="col-md-8">Contacts dans la catégorie </span>
            <span class="btn btn-secondary col-md-2">Amis</span>
			<span class="col-md-1"> : </span>
            <span class="badge badge-success col-md-1">${amis}</span>
        </h4>
        <h4><span class="col-md-8">Contacts dans la catégorie </span>
            <span class="btn btn-secondary col-md-2">Travail</span>
			<span class="col-md-1"> : </span>
            <span class="badge badge-success col-md-1">${travail}</span>
        </h4>
        <h4><span class="col-md-8">Contacts dans la catégorie </span>
            <span class="btn btn-secondary col-md-2">Autres</span>
			<span class="col-md-1"> : </span>
            <span class="badge badge-success col-md-1">${autres}</span>
        </h4>
    </div>

</div>
		`;
		
        $(".tableau").html(html);
        $("section").hide();
        $(".tableau").show();
    });

    request.fail(function (http_error) {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
    });
}

// $.getJSON( "http://localhost:3000/contacts", function(data) {

// }
// CAMEMBERT

const graph = document.getElementById('graph').getContext('2d');
    let myChart = new Chart(graph, {
        type: 'pie',
        data: {
            labels: ['Objet1', 'Objet2', 'Objet3'],
            datasets: [
                {
                    label: "Categories",
                    data: [10, 20, 30],
                    backgroundColor: [
                        "red",
                        "blue",
                        "yellow"
                    ]
                }
            ]
        },
    });