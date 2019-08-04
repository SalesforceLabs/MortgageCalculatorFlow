import { LightningElement, track, api} from 'lwc';
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
    connectedCallback() {
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
        this.sendMortgageValues();
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
        this.monthlyPayment = mortgageUtils.calculateMonthlyPayment(
            this._principal, this._years, this._rate
        );
    }

    get yearOptions() {
       /* Generates the available years for mortgage calculation based on input from flow */
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
        const calculateEvent = new CustomEvent('mortgagechange', {detail: {"years": year, "principal": principal, "rate": rate}});
       // console.log('calculate event ' + JSON.stringify(calculateEvent.detail.years));
        this.dispatchEvent(calculateEvent);
    }
}