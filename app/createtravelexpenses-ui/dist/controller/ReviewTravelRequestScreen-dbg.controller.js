sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
    "use strict";

    return Controller.extend("createtravelexpenses.createtravelexpensesui.controller.ReviewTravelRequestScreen", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteReviewTravelRequestScreen").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {

            const oData = {
              name: "Pratibha Jawale",
              id: "EMP001"
            };

            // Create JSON Model
            const empModel = new sap.ui.model.json.JSONModel(oData);

            // Set model with name 'employeeModel'
            this.getOwnerComponent().setModel(empModel, "employeeModel");

            const oModel = this.getOwnerComponent().getModel(); // OData V4 model

            // Bind the list (collection) context
            const oListBinding = oModel.bindList("/TravelRequests");
            
            oListBinding.requestContexts().then((aContexts) => {
              // Convert contexts to plain JSON objects
              const aData = aContexts.map(oContext => oContext.getObject());

            
              console.log("All TravelRequests:", aData);
            
              const oJSONModel = new sap.ui.model.json.JSONModel({ travelRequests: aData });
              this.getOwnerComponent().setModel(oJSONModel, "travelData");

            
            }).catch((oError) => {
              console.error("Failed to fetch TravelRequests:", oError);
              sap.m.MessageBox.error("Error fetching travel requests.");
            });

            try {
              const oModel = this.getOwnerComponent().getModel("expenseModel");
              oModel.setProperty("/expenses", []);
            } catch (error) {
              
            }
                  
             const oModel1 = this.getOwnerComponent().getModel(); // OData V4 Model

              // Note: function import -> must be deferred
              const oContextBinding = oModel1.bindContext("/whoAmI(...)");  

              oContextBinding.execute().then(() => {
                  const oContext = oContextBinding.getBoundContext();
                  const oData = oContext.getObject();
                  console.log("User Info:", oData);

                  sap.m.MessageToast.show("Hello " + oData.givenName);
              }).catch(err => {
                  console.error("Error fetching user:", err);
              });

              
        },
        onForwardArrowPress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("travelData");
            const oRowData = oContext.getObject();

            if(oRowData.Approvedstatus == 'approved'){
            this.travelId = oRowData.ID;
            this.getOwnerComponent().getRouter().navTo("CreateTravelExpenseScreen", {
                travelId: this.travelId
              });
            } else if(oRowData.Approvedstatus == 'rejected'){
              sap.m.MessageToast.show("You cannot add expenses to rejected travel request.");
            } else {
              sap.m.MessageToast.show("This travel request is not reviewed yet to add travel expenses.");
            }
          }
          
    });
});
