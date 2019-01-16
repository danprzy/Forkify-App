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
            this.author = res.data.recipe.publsher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingrediens = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }
    calcTime() {
        //  assuming that for every three ingredients, we need 15 minutes.
        const numIng = this.ingrediens.length;
        const period = Math.ceil(numIng / 3) // how many 15 minutes periods we have
        this.time = period * 15;
    }
    calcServings() {
        //  assuming that we have four servings on each of the recipes.
        this.serving = 4;
    }
}