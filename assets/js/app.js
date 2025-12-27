const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const resultsSection = document.getElementById('results');
const resultsRow = document.getElementById('resultsRow');

class Receta {
	constructor({ idMeal, strMeal, strMealThumb }) {
		this.id = idMeal;
		this.nombre = strMeal;
		this.imagen = strMealThumb;
	}

	toHTML() {
		return `
			<div class="col-lg-4 col-md-6">
				<div class="card h-100">
					<img src="${this.imagen}" class="card-img-top" alt="${this.nombre}">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title">${this.nombre}</h5>
						<p class="card-text">Receta disponible en TheMealDB</p>
						<a href="https://www.themealdb.com/meal.php?c=${this.id}" class="btn btn-primary mt-auto" target="_blank" rel="noopener">Ver receta</a>
					</div>
				</div>
			</div>
		`;
	}
}

const renderMessage = (message) => {
	resultsRow.innerHTML = `
		<div class="col-12">
			<div class="alert alert-info" role="status">${message}</div>
		</div>
	`;
};

const clearResults = () => { resultsRow.innerHTML = ''; };

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const query = input.value.trim();
	if (!query) {
		renderMessage('Ingresa un ingrediente para buscar.');
		return;
	}

	clearResults();
	resultsSection.querySelector('h2').textContent = `Resultados para "${query}"`;

	try {
		const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(query)}`;
		const res = await fetch(url);
		if (!res.ok) throw new Error('Respuesta de red no OK');
		const data = await res.json();
		const { meals } = data;

		if (meals === null) {
			renderMessage('Lo sentimos, no se encontraron recetas. Intenta con otro ingrediente.');
			return;
		}

		const fragment = document.createDocumentFragment();
		meals.forEach(meal => {
			const receta = new Receta(meal);
			const temp = document.createElement('div');
			temp.innerHTML = receta.toHTML();
			fragment.appendChild(temp.firstElementChild);
		});

		resultsRow.appendChild(fragment);
	} catch (err) {
		console.error(err);
		renderMessage('Ocurrió un error al buscar. Intenta nuevamente más tarde.');
	}
});


