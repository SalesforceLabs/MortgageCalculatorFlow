import { LightningElement, track, api} from 'lwc';
import {FlowAttributeChangeEvent,FlowNavigationNextEvent} from 'lightning/flowSupport';
import mortgageUtils from 'c/mortgageUtils';
const DELAY = 300;
export default class MortgageCalculator extends LightningElement {
   @api initPrincipal;
   @api initRate;
   @api initYears;
   @api mortgageYearsOptions;

    _principal = 0;
    _years = 0;
    _rate = 0;

    @track monthlyPayment = 0.0;

    get defaultPrincipal() {
        return this._principal;
    }

    get defaultRate() {
        return this._rate;

    }

    get defaultYear(){
        return this._years;
    }

    connectedCallback() {
        console.log('this.initPrincipal'+this.initPrincipal);
        console.log('this.initRate'+this.initRate);
        console.log('this.initYears'+this.initYears);

        if(this.initPrincipal)
        {
            this._principal = this.initPrincipal;
        }
        if(this.initRate)
        {
            this._rate = this.initRate;
        }
        if(this.initYears)
        {
            this._years = this.initYears;
        }
        this.calculateMonthlyPayment();
        //this.sendMortgageValues();
    }

    handleYearChange(event) {
        this._years = event.target.value;
        this.calculateMonthlyPayment();
        this.sendMortgageValues();
    }

    handleRateChange(event) {
        this._rate = event.target.value;
        //this.calculateMonthlyPayment();
        //this.sendMortgageValues();
       window.clearTimeout(this.delayTimeout);
        //const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            //this.searchKey = searchKey;
            this.calculateMonthlyPayment();
            this.sendMortgageValues();
        }, DELAY);
    }
    handlePrincipalChange(event) {
        this._principal = event.target.value;
        window.clearTimeout(this.delayTimeout);
        //const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            //this.searchKey = searchKey;
            this.calculateMonthlyPayment();
            this.sendMortgageValues();
        }, DELAY);
        //this.calculateMonthlyPayment();
        //this.sendMortgageValues();
    }

    calculateMonthlyPayment() {
        console.log('Calculation');
        this.monthlyPayment = mortgageUtils.calculateMonthlyPayment(
            this._principal, this._years, this._rate
        );

        // if (this._principal && this._years && this._rate && this._rate >0) {
        //     const monthlyRate = this._rate/100/12;
        //     this.monthlyPayment = (this._principal * monthlyRate) / (1 - Math.pow(1/ (1 + monthlyRate), this._years * 12));
        // }
        // console.log('Calculation');
        // this.monthlyPayment = this._calculateMonthlyPayment(
        //     this._principal, this._years, this._rate
        // );
    }

    _calculateMonthlyPayment(principal,years,rate) {
        conole.log('Calculation Method');
        if (principal && years && rate && this._rate >0) {
            console.log('Calculation Happening');
            const monthlyRate = rate/100/12;
            const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1/ (1 + monthlyRate), years * 12));
            return monthlyPayment;
        }
        return 0;
    }

    get yearOptions() {
       /* Generates the available years for mortgage calculation based on input from flow */
       conole.log('Options::'+this.mortgageYearsOptions);
       let options = [];
       let yearValues = this.mortgageYearsOptions.split(',');
       for (let y = 0; y < yearValues.length; y++) {
        let yr = {"label": yearValues[y], "value": yearValues[y]};
        options.push(yr);
       }
       return options;
    }


    sendMortgageValues() {
       // console.log('in calculateMonthlyPayment '+ this.monthlyPayment);
        const year = this._years;
        const principal = this._principal;
        const rate = this._rate;
    //     const calculateEvent = new CustomEvent('mortgagechange', {detail: {"years": year, "principal": principal, "rate": rate}});
    //    // console.log('calculate event ' + JSON.stringify(calculateEvent.detail.years));
    //     this.dispatchEvent(calculateEvent);
        console.log('Updating values');
        // notify the flow of the new todo list
        const yearattributeChangeEvent = new FlowAttributeChangeEvent('initYears',year);
        this.dispatchEvent(yearattributeChangeEvent);
        // notify the flow of the new todo list
        const rateattributeChangeEvent = new FlowAttributeChangeEvent('initRate',rate);
        this.dispatchEvent(rateattributeChangeEvent);
        // notify the flow of the new todo list
        const principalattributeChangeEvent = new FlowAttributeChangeEvent('initPrincipal',principal);
        this.dispatchEvent(principalattributeChangeEvent);
    }
}
