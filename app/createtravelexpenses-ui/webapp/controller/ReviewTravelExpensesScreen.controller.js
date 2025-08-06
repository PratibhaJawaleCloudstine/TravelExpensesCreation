sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",  
    "sap/ui/model/odata/v4/ODataModel" 
  ], function (Controller, MessageBox, ODataModel) {
    "use strict";
  
    return Controller.extend("travel.travelexpenseui.controller.ReviewTravelExpensesScreen", {
  
      onInit: function () {
        this.getOwnerComponent().getRouter().getRoute("ReviewTravelExpensesScreen").attachPatternMatched(this._onRouteMatched, this);
      },
  
      onPreviousStep: function () {
        var oHistory = sap.ui.core.routing.History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();
  
        if (sPreviousHash !== undefined) {
          // Go back to previous route in browser history
          window.history.go(-1);
        } else {
          // No history - navigate to default route (e.g., Home)
          this.getOwnerComponent().getRouter().navTo("CreateTravelExpenseScreen", {
            travelId: this.travelId
          });
        }
      },
  
      _onRouteMatched: function (oEvent) {
        this.travelId = oEvent.getParameter("arguments").travelId;
        console.log("Loaded Travel ID:", this.travelId);
       
        const oModel = this.getOwnerComponent().getModel("expenseModel");
        const aExpenses = oModel.getProperty("/expenses") || [];

        const oActionModel = this.getOwnerComponent().getModel("actionModel");
         this.sAction = oActionModel.getProperty("/actionTaken");
        
        console.log("actionTaken "+ sAction);

        if(sAction == "save"){
          this.byId("Rev_id_saveDraftRadio").setEnabled(false);
          this.byId("Rev_id_saveAndApproveRadio").setEnabled(false);
          this.byId("Rev_id_ApproveRadio").setEnabled(true);
        } else{
          this.byId("Rev_id_saveDraftRadio").setEnabled(true);
          this.byId("Rev_id_saveAndApproveRadio").setEnabled(true);
          this.byId("Rev_id_ApproveRadio").setEnabled(false);
        }
      },

      onActionSelect: function (oEvent) {
        const selectedIndex = oEvent.getParameter("selectedIndex");
  
        const saveAndProceedButton = this.byId("saveAndProceed");
  
        if (selectedIndex === 0) {
          saveAndProceedButton.setText("Save Draft");
          this.selectedOption = "draft";
        } else if (selectedIndex === 1) {
          saveAndProceedButton.setText("Save and Send for Approval");
          this.selectedOption = "SaveApprove";
        } else {
          saveAndProceedButton.setText("Send for Approval");
          this.selectedOption = "Approve";
        }
      },

      
      onSaveAndApprove: function () {
        const oModel = this.getOwnerComponent().getModel("expenseModel");
        const aExpenses = oModel.getProperty("/expenses") || [];

        const oActionModel = this.getOwnerComponent().getModel("actionModel");
        oActionModel.setProperty("/actionTaken", "save");

        console.log("Review expenses");
        console.log(aExpenses);

          if(this.selectedOption=="draft"){

            aExpenses.forEach((item) => {

                var oModelOData = this.getOwnerComponent().getModel(); // OData V4 model
                // Step 1: Create binding to the entity set (TravelRequests)
                var oListBinding = oModelOData.bindList("/TravelExpenses", undefined, undefined, undefined, {
                    $$updateGroupId: "travelExpensesGroup"
                });


                // Step 2: Create entry (this returns a context)
                oListBinding.create({
                    travelRequest_ID: this.travelId,
                    expenseType: item.expenseType,
                    receiptAmount: item.receiptAmount,
                    receiptDate: item.receiptDate,
                    currency: "INR"
                });



                // Step 3: Submit the batch
                oModelOData.submitBatch("travelExpensesGroup").then(() => {
                    sap.m.MessageToast.show("Travel Expenses saved successfully.");
                    // Clear the expenses after successful submission
                    oModel.setProperty("/expenses", []);

                }).catch((oError) => {
                    sap.m.MessageBox.error("Error saving travel request: " + oError.message);
                }).finally(() => {
                    // Hide loader
                    this.getView().setBusy(false);
                });

            });
          } else if(this.sAction=="SaveApprove"){

          } else if(this.sAction=="Approve"){
            
          }

    },
  
  
    });
  
  });  