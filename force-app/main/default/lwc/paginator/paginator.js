import { LightningElement, api } from 'lwc';

export default class Paginator extends LightningElement {

    @api totalpages;
    @api currentpage;
    @api disablefirst;
    @api disablelast;

    lastPage = false;
    firstPage = false;

    get showCurrentPage() {
        return this.currentpage;
    }

    get showTotalPages() {
        return this.totalpages;
    }

    get showFirstButton() {
        return this.disablefirst;
    }

    get showLastButton() {
        return this.disablelast;
    }

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    handleFirst() {
        this.dispatchEvent(new CustomEvent('first'));
    }

    handleLast() {
        this.dispatchEvent(new CustomEvent('last'));
    }

}