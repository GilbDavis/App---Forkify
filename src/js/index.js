import Search from './models/Search';
import * as searchView from './views/searchViews';
import Recipe from './models/Recipe';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';

/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};

/**
 * Search Controller
 */

const controlSearch = async () => {
    //1. Get the query from the view
    const query = searchView.getInput(); //TODO

    if (query) {
        //2. New search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //4. Search for recipes
            await state.search.getResults();
    
            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Recipe Controller
 */

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI for changes

        //Create a new recipe object
        state.recipe = new Recipe(id);

        try {
            //Get the recipe data
            await state.recipe.getRecipe();
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Render the recipe
            console.log(state.recipe);
        } catch (error) {
            alert('Error processing recipe!');
        }
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['haschange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));