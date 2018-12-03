import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
}
// 'pasta with tomato spinach'
// acc: 0 / acc + cur.lengh = 5 / new Title = ['pasta']
// acc: 5 / acc + cur.lengh = 9 / new Title = ['pasta', 'with']
// acc: 9 / acc + cur.lengh = 15 / new Title = ['pasta', 'with', 'tomato']
// acc: 15 / acc + cur.lengh = 18 / new Title = ['pasta', 'with', 'tomato']

const limitRecipeTitle = (title, limit = 37) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
	<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
                `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);


};

export const renderResults = recipes => {
    //console.log(recipes);
    recipes.forEach(renderRecipe);
};