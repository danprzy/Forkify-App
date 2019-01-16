import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
// Global state of the app
// Search object
// Current recipe 
// Shopping List object
// Liked recipes

const state = {};

/* Search controler */
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    if (query) {
        //new serch object and add to state
        state.search = new Search(query);
        // prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // Search for recipes
            await state.search.getResults();
            // render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
        	alert('Something wrong with the search...');
        	clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch()

});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});

//const search = new Search('pizza');
//console.log(search);
//search.getResults();

/* Recipe controler */
//r.getRecipe();
//console.log(r);
const controlRecipe = async () => {
    // get Id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if (id) {
        // prepere UI for changes

        // create new recipe object
        state.recipe = new Recipe(id);

        try {



            //get recipe data
            await state.recipe.getRecipe();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            console.log(state.recipe);
        } catch (err) {
            allert('Error processing recipe!');
        }
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));