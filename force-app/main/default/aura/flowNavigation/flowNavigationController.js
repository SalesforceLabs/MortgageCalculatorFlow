({
    doInit : function(component, event, helper) {
        /* Initialize the navigation button creation 
         * Navigation options are passed in via attribute in a comma/semi-colon format
         * Each button is separated by semi-colon.
         * Each button's label is left of comma, button's auraId is right of comma
         */
        let buttons = component.get("v.buttonFields");
        /* Create array of buttons */
        let buttonArray = buttons.split(";");
        //console.log("button array " + JSON.stringify(buttonArray) + buttonArray.length);
        /* for each button in array, create the button component */
        for (let i=0; i< buttonArray.length; i++) {
            /* separate label from auraId */
            let indButton = buttonArray[i].split(",");
            /* Verify that there is a label and auraId prior to trying to create button */
            if (indButton.length > 1)
            {
                $A.createComponent("lightning:button" ,
                {
                    "aura:id": indButton[1],
                    "label": indButton[0],
                    "onclick": component.getReference("c.handleChange")
                }, function(newButton, status, errorMessage) {
                    if(status==="SUCCESS") {
                        /* IF creation of component was successful, add it to the button group on aura component */
                        let buttonGroup = component.find("btnGroup");
                        let body = buttonGroup.get("v.body");
                        body.push(newButton);
                        buttonGroup.set("v.body", body);
                    }
                    else if (status==="ERROR")
                    {
                        console.log('error ' + status + ' ' + errorMessage);
                    }
                });
            }
            
        }
    },
    handleChange : function(component, event, helper) {
        /* retrieves the button aura:id to determine navigation step */
        let response = event.getSource().getLocalId();
        /* sets the btnSelected variable so that the decision element knows where to navigate next */
        component.set("v.btnSelected", response);
        /* fires flow navigation event */
        let navigate = component.get("v.navigateFlow");
        navigate("NEXT");
        

    }
})
