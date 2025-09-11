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
        
        console.log("actionTaken "+ this.sAction);
         const saveAndProceedButton = this.byId("Rev_saveAndProceed");
        if(this.sAction == "save"){
          this.byId("Rev_id_saveDraftRadio").setEnabled(false);
          this.byId("Rev_id_saveAndApproveRadio").setEnabled(false);
          this.byId("Rev_id_ApproveRadio").setEnabled(true);

          this.byId("Rev_id_saveDraftRadio").setSelected(false);
          this.byId("Rev_id_saveAndApproveRadio").setSelected(false);
          this.byId("Rev_id_ApproveRadio").setSelected(true);

          saveAndProceedButton.setText("Send for Approval");
          this.selectedOption = "Approve";
        } else{
          this.byId("Rev_id_saveDraftRadio").setEnabled(true);
          this.byId("Rev_id_saveAndApproveRadio").setEnabled(true);
          this.byId("Rev_id_ApproveRadio").setEnabled(false);

          this.byId("Rev_id_saveDraftRadio").setSelected(false);
          this.byId("Rev_id_saveAndApproveRadio").setSelected(true);
          this.byId("Rev_id_ApproveRadio").setSelected(false);

          saveAndProceedButton.setText("Save and Send for Approval");
          this.selectedOption = "SaveApprove";
        }
      },

      onActionSelect: function (oEvent) {
        const selectedIndex = oEvent.getParameter("selectedIndex");
  
        const saveAndProceedButton = this.byId("Rev_saveAndProceed");
  
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
          } else if(this.selectedOption=="SaveApprove"){
              var count = 0;
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
                    currency: "INR",
                    attachmentCount: item.attachmentCount || 0,
                    attachments: (item.attachments || []).map(att => ({
                       name: att.name,
                       type: att.type,
                       size: att.size
                    }))
                });

                count = count + 1;

                // Step 3: Submit the batch
                oModelOData.submitBatch("travelExpensesGroup").then(() => {
                    sap.m.MessageToast.show("Travel Expenses saved successfully.");
                    // Clear the expenses after successful submission
                   // oModel.setProperty("/expenses", []);
                      console.log("count of Expenses stored "+count);
                      if (count == aExpenses.length){
                          const oModelTravel = this.getOwnerComponent().getModel("travelData");
                          console.log("oModelTravel");
                          console.log(oModelTravel);
                          const oData = oModelTravel.getData();
                          console.log("oData");
                          console.log(oData);


                           //start workflow (Build process)
                            const travelDataObj = {
                              travelRequest: {
                                      TravelRequestId: oData.ID,
                                      TravelStartDate:  oData.startDate,
                                      TravelEndDate: oData.endDate,
                                      TravelDeparture: oData.departure,
                                      TravelArrival:  oData.arrival,
                                      TravelPlaceOfVisit:  oData.placeOfVisit,
                                       TravelEstimationCost:oData.estimatedCost,
                                      TravelSelfTravel:oData.selfTravel,
                                      TravelPurposeOfTravel:oData.purposeOfTravel,
                                      TravelEmployeeId:"EMP001",
                                      TravelEmployeeEmail:"pratibhapsarode@gmail.com",
                                      TravelEmployeeName:"Pratibha Jawale"
                                  },
                                  travelExpenses: aExpenses.map(exp => ({
                                      expenseType: exp.expenseType || "",
                                      receiptAmount: exp.receiptAmount || "",
                                      receiptDate: exp.receiptDate || "",
                                      attachmentCount: exp.attachmentCount || 0,
                                      attachments: (exp.attachments || []).map(att => ({
                                        name: att.name,
                                        type: att.type,
                                        size: att.size,
                                      }))
                                  }))
                            };
                          
                          console.log(travelDataObj);
                            $.ajax({
                              url: "/odata/v4/travel/startTravelWorkflow",
                              method: "POST",
                              contentType: "application/json",
                              data: JSON.stringify({ travelData: JSON.stringify(travelDataObj) }),
                              success: function (response) {
                                sap.m.MessageToast.show("Travel request " + this.travelId + " is send for approval.");
                              },
                              error: function (xhr, status, error) {
                                sap.m.MessageBox.error("Failed to start workflow: " + xhr.responseText);
                              }
                            });


                      }

                }).catch((oError) => {
                    sap.m.MessageBox.error("Error saving travel request: " + oError.message);
                }).finally(() => {
                    // Hide loader
                    this.getView().setBusy(false);
                });

            });

          } else if(this.selectedOption=="Approve"){
             const oModelTravel = this.getOwnerComponent().getModel("travelData");
                          console.log("oModelTravel");
                          console.log(oModelTravel);
                          const oData = oModelTravel.getData();
                          console.log("oData");
                          console.log(oData);


                           //start workflow (Build process)
                            const travelDataObj = {
                              travelRequest: {
                                      TravelRequestId: oData.ID,
                                      TravelStartDate:  oData.startDate,
                                      TravelEndDate: oData.endDate,
                                      TravelDeparture: oData.departure,
                                      TravelArrival:  oData.arrival,
                                      TravelPlaceOfVisit:  oData.placeOfVisit,
                                      TravelEstimationCost:oData.estimatedCost,
                                      TravelSelfTravel:oData.selfTravel,
                                      TravelPurposeOfTravel:oData.purposeOfTravel,
                                      TravelEmployeeId:"EMP001",
                                      TravelEmployeeEmail:"pratibhapsarode@gmail.com",
                                      TravelEmployeeName:"Pratibha Jawale"
                                  },
                                  travelExpenses: aExpenses.map(exp => ({
                                      expenseType: exp.expenseType || "",
                                      receiptAmount: exp.receiptAmount || "",
                                      receiptDate: exp.receiptDate || "",
                                      attachmentCount: exp.attachmentCount || 0,
                                      attachments: (exp.attachments || []).map(att => ({
                                        name: att.name,
                                        type: att.type,
                                        size: att.size,
                                      }))
                                  }))
                            };
                          console.log(travelDataObj);
                          
                            $.ajax({
                              url: "/odata/v4/travel/startTravelWorkflow",
                              method: "POST",
                              contentType: "application/json",
                              data: JSON.stringify({ travelData: JSON.stringify(travelDataObj) }),
                              success: function (response) {
                                sap.m.MessageToast.show("Travel request " + oData.ID + " is send for approval.");
                              },
                              error: function (xhr, status, error) {
                                sap.m.MessageBox.error("Failed to start workflow: " + xhr.responseText);
                              }
                            });
          }

    },
  
  
    });
  
  });  