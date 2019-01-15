 import axios from 'axios';

 export default class Search {
     constructor(query) {
         this.query = query;
     }
     async getResults(query) {
         const proxy = 'https://cors-anywhere.herokuapp.com/';
         const key = 'b90c9226a4c2ac9c0bdab8ec12ea9c6d';
         try {
             const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
             this.result = res.data.recipes;
             // console.log(this.result);
         } catch (error) {
             alert(error);
         }
     }
 }