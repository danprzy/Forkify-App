import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
    // const query = 'pizza';

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

/* testing
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch()
}); */

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
       	recipeView.clearRecipe(); 
        renderLoader(elements.recipe); //pass in the parent

        // highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);
        //Testing
        //window.r = state.recipe;

        try {
            //get recipe data and parse ingrediens
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);

            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            alert('Error processing recipe!');
        }
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));