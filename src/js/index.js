import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
// Global state of the app
// Search object
// Current recipe 
// Shopping List object
// Liked recipes

const state = {};

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    if (query) {
        //new serch object and add to state
        state.search = new Search(query);
        // prepare UI for result

        // Search for recipes
        await state.search.getResults();
        // render results on UI
        searchView.renderResult(state.search.result)
        //console.log(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch()

});
//const search = new Search('pizza');
//console.log(search);
//search.getResults();