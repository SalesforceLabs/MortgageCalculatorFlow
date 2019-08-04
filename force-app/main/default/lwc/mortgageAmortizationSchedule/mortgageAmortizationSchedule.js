import { LightningElement, api, track } from 'lwc';
import mortgageUtils from 'c/mortgageUtils';

export default class MortgageAmortizationSchedule extends LightningElement {
    @api principal;
    @api rate;
    @api years;
    
    //_currentPage = 1;
    @track _pageSize = 5;
    _totalPages = 0;
    _totalRecords = 0;
    page = 1;


    monthlyPayment;
    amortization =[];
    @track amortizationDisplayed;
    disableFirst = false;
    disableLast = false;

    get defaultPrincipal() {
        return this.principal;
    }
    get defaultRate() {
        return this.rate;
    }
    get defaultYears() {
        return this.years;
    }

    connectedCallback() {
        this.calculateAmortization();
        this.paginationRendering();
        this.refreshDataSet();

    }


    calculateAmortization() {
        console.log('in calcualteAmortization');
        this.monthlyPayment = mortgageUtils.calculateMonthlyPayment(this.principal, this.years, this.rate);
        //const interestRate = this.rate / 100/12;
        console.log('monthly Payment ' +this.monthlyPayment);
        const monthlyRate = this.rate / 100/12;
        let balance = this.principal;
        const amortization = [];
        for (let y = 1; y <= this.years; y++) { 
            let interestY = 0;
            let principalY = 0;
            for (let m = 0; m <12; m++) {
                const interestM = balance * monthlyRate;
                const principalM = this.monthlyPayment - interestM;
                interestY += interestM;
                principalY += principalM;
                balance -= principalM;
            }
            const cssPrincipal = 'flex:' + principalY + ';-webkit-flex:' + principalY + ';';
            const cssInterest = 'flex:' + interestY + ';-webhit-flex:' + interestY + ';';
            amortization.push({
                id: y, 
                cssClasses: {principal: cssPrincipal, interest:cssInterest},
                principalY: Math.round(principalY),
                interestY: Math.round(interestY),
                balance: Math.round(balance)
            });
        }
        this.amortization = amortization;
        

    }

    pageSizeOptions = [{label: '5', value: 5},
        {label: '10', value: 10},
        {label: '25', value: 25},
        {label: '50', value: 50}];

    paginationRendering() {
        //if (this.localCurrentPage === this.currentPage)
        console.log('in pageinationRendering ' + this.amortization.length);
        //this.localCurrentPage = this.currentPage;
        this._totalRecords = this.amortization.length;
        console.log('total records ' + this._totalRecords);
    
        this.page = 1;
        //if(this._totalRecords >0 && !isNaN(this._totalRecords))
       // {
            this._totalPages = Math.ceil(this._totalRecords / this._pageSize);
           

       // }
        console.log('this.totalRecords ' + this._totalRecords + ' totalPages ' + this._totalPages + ' pageSize ' + this._pageSize);



    }

    handlePageSizeChange(event) {
        console.log('handlePageSize Change ');
        this._pageSize = event.target.value;
        this.page = 1;
        console.log('new pageSize ' + this._pageSize);
        this.paginationRendering();
        this.refreshDataSet();
    }

    handlePrevious() {
        console.log('handle previous');
        if(this.page > 1) 
        {
            this.page = this.page - 1;
            this.refreshDataSet();
        }
    }

    handleNext() {
        if (this.page < this._totalPages) {
            this.page = this.page + 1;
            this.refreshDataSet();
        }
    }
    handleFirst() {
        this.page = 1;
        this.refreshDataSet();
        
    }
    handleLast() {
        this.page = this._totalPages;
        this.refreshDataSet();
    }

    refreshDataSet() {
        console.log('in refresh data set - page ' + this.page + ' totalPages ' + this._totalPages);
        this.amortizationDisplayed = new Array();
        let startSize = 0;
        
       // if (this.page > 0 && this._totalPages >0)
       // {
           console.log('page ' + this.page);
            if(this.page === 1) {
                startSize = 0;
            }
            else {
                startSize = (this.page - 1) * parseInt(this._pageSize,10);
            }
      //  }
        console.log('start size  + ' + startSize);
        let endPlace = 0;
        endPlace = parseInt(startSize,10) + parseInt(this._pageSize,10);
        console.log('end place ' + endPlace);
        for (let i = startSize; i < endPlace && i < this.amortization.length; i++) {
            this.amortizationDisplayed.push(this.amortization[i]);
        }
        console.log('amortizationDisplay ' + this.amortizationDisplayed.length);
        
        if (this.page === 1 && this.page !== this._totalPages) {
            this.disableFirst = true;
            this.disableLast = false;
        }
        else if (this.page === 1 && this.page === this._totalPages)
        {
            this.disableFirst = true;
            this.disableLast = true;
        }
        else if(this.page === this._totalPages)
        {
            this.disableFirst = false;
            this.disableLast = true;
        }
        else {
            this.disableFirst = false;
            this.disableLast = false;
        }

        
    }

    get currentPage() {
        return this.page;

    }
    get totalRecords() {
        return this._totalRecords;
    }
    get totalPages() {
        return this._totalPages;
    }
    get selectedPageSize() {
        console.log('page size get ' + this._pageSize);
        return this._pageSize;
    }
}