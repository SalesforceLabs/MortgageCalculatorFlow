({
    handleMortgageChange : function(component, event) {
        /* when a mortgage field changes, update the aura component attributes so that when passed back to the flow */
        let eventParams = event.getParams('detail');
        component.set("v.mortgageRate", eventParams.rate);
        component.set("v.mortgageYears", eventParams.years);
        component.set("v.mortgagePrincipal", eventParams.principal);
    }
})
