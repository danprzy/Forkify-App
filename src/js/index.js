import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
// Global state of the app
// Search object
// Current recipe 
// Shopping List object
// Liked recipes

const state = {};
window.state = state;

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
            // console.log(state.recipe.ingredients);

            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(
            	state.recipe,
            	state.likes.isLiked(id)
            );

        } catch (err) {
        	console.log(err);
            alert('Error processing recipe!');
        }
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/* List controler */
const controlList = () => {
    // create a new list if there is none yet
    if (!state.list) state.list = new List();

    //add each ingr. to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // habdle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);

        // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/* Like controler */
// for testing
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );

        // toggle the like button
        likesView.toggleLikeBtn(true);
        // add like to UI list
        likesView.renderLike(newLike);
        
        // User has liked current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);
        // remove like from UI list
        likesView.deleteLike(currentID);

    }
likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.serving > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingrediens to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //like controller
        controlLike();
    }
    // console.log(state.recipe);
});


window.l = new List();