import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [3, 2, 5] splice(1, 2) --> returns [2, 5] oryginal array [3]
        // [3, 2, 5] splice(1, 2) --> returns 2, oryginal array [3, 2, 5]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
    	this.items.find(el => el.id === id).count = newCount;
    }

}