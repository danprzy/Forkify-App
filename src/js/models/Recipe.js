import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }
    calcTime() {
        //  assuming that for every three ingredients, we need 15 minutes.
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3) // how many 15 minutes periods we have
        this.time = period * 15;
    }
    calcServings() {
        //  assuming that we have four servings on each of the recipes.
        this.serving = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // 2 Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
            
            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); //ES next

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // example 4 1/2 cups, arrCount is [4, 1/2}] --> eva;("4+1/2") --> 4.5
                // 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                //const newCount = Math.round(count * 10000) / 10000;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')).toFixed(2);

                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                };

                objIng = {
                	//count: count.toFixed(2),
                    //count: Math.round(count * 10) / 10)
                	count,
                	unit: arrIng[unitIndex],
                	ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.serving - 1 : this.serving + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.serving);
        });

        this.serving = newServings;
    }
}