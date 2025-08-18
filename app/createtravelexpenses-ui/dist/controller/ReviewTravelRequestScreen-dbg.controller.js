sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
    "use strict";

    return Controller.extend("createtravelexpenses.createtravelexpensesui.controller.ReviewTravelRequestScreen", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteReviewTravelRequestScreen").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {

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
            
        
        },
        onForwardArrowPress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("travelData");
            const oRowData = oContext.getObject();

            this.travelId = oRowData.ID;
            this.getOwnerComponent().getRouter().navTo("CreateTravelExpenseScreen", {
                travelId: this.travelId
              });

       
          }
          
    });
});
