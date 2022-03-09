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

function liste() {
	let request = $.ajax({
		type: "GET",
		url: "http://localhost:3000/contacts",
		dataType: "json",
	});

	request.done(function (response) {
		let html = "";
		if (response.length !== 0) {
			html += ` <h1>Liste des contacts </h1>
			<table class="table table-striped">
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

			html += `	</tbody>
					</table>`;
		}
		else {
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
		data: { id: new Date().getTime(), nom: $("#nom").val(), prenom: $("#prenom").val() },
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
		data: { nom: $(".modif-contact #nom").val(), prenom: $(".modif-contact #prenom").val() },
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
