sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
    "use strict";

    return Controller.extend("createtravelexpenses.createtravelexpensesui.controller.CreateTravelExpenseScreen", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("CreateTravelExpenseScreen").attachPatternMatched(this._onRouteMatched, this);

            const oData = {
                expenses: [],
                expenseTypes: [
                    { key: "MEALS", text: "Meals/Snacks" },
                    { key: "AIR", text: "Air Travel" },
                    { key: "LAUNDRY", text: "Laundry" },
                    { key: "RAIL", text: "Rail Travel" },
                    { key: "ROAD", text: "Road Travel" },
                    { key: "ALCOHOL", text: "Alcohol" }
                ]
            };

            const oModel = new sap.ui.model.json.JSONModel(oData);
            this.getOwnerComponent().setModel(oModel, "expenseModel");

            const oActionModel = new sap.ui.model.json.JSONModel({
                actionTaken: ""
              });
            this.getOwnerComponent().setModel(oActionModel, "actionModel");
              


        },


        onAddNewExpense: function () {
            this.byId("expenseTable").setVisible(true);
            const oModel = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel.getProperty("/expenses") || [];

            // Push new blank expense row
            aExpenses.push({
                expenseType: "",
                receiptAmount: "",
                receiptDate: ""
            });

            oModel.setProperty("/expenses", aExpenses);
            console.log(aExpenses);
        },

        onEnterReceipts: function () {

            this.byId("idReceiptEntry").setVisible(true);
         },

        onDeleteSelectedExpenses: function () {
            const oTable = this.byId("expenseTable");
            const oModel = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel.getProperty("/expenses") || [];

            // Get selected indices from UI5 table
            const aSelectedContexts = oTable.getSelectedContexts();
            if (aSelectedContexts.length === 0) {
                sap.m.MessageToast.show("Please select at least one entry to delete.");
                return;
            }

            // Get indexes of selected items
            const aSelectedIndexes = aSelectedContexts.map((ctx) =>
                oTable.getItems().indexOf(ctx.getObject())
            );

            // Remove items from model by filtering out selected ones
            const aUpdatedExpenses = aExpenses.filter((_, index) => {
                return !aSelectedContexts.some(ctx => ctx.getObject() === aExpenses[index]);
            });

            // Update the model
            oModel.setProperty("/expenses", aUpdatedExpenses);

            // Clear selection
            oTable.removeSelections();

            const aData = oModel.getProperty("/expenses") || [];
            const bHasData = aData.length > 0;
            this.byId("expenseTable").setVisible(bHasData);
        },


        onPreviousStep: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                // Go back to previous route in browser history
                window.history.go(-1);
            } else {
                // No history - navigate to default route (e.g., Home)
                this.getOwnerComponent().getRouter().navTo("RouteReviewTravelRequestScreen", true);
            }
        },


        onReviewTravelRequest: function () {
            const oModel = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel.getProperty("/expenses") || [];

            const oActionModel = this.getOwnerComponent().getModel("actionModel");
            oActionModel.setProperty("/actionTaken", "review");
          

            if (aExpenses.length > 0) {
                this.getOwnerComponent().getRouter().navTo("ReviewTravelExpensesScreen", {
                    travelId: this.travelId
                });
            }else{
                sap.m.MessageToast.show("Please add Travel Expenses.");
            }
        },

        onSaveDraft: function () {
            const oModel = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel.getProperty("/expenses") || [];

            const oActionModel = this.getOwnerComponent().getModel("actionModel");
            oActionModel.setProperty("/actionTaken", "save");

            console.log("Review expenses");
            console.log(aExpenses);

            if (aExpenses.length > 0) {

                aExpenses.forEach((item) => {

                    console.log("item");
                    console.log(item);


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
                       // oModel.setProperty("/expenses", []);
                            this.getOwnerComponent().getRouter().navTo("ReviewTravelExpensesScreen", {
                            travelId: this.travelId
                        });
                    }).catch((oError) => {
                        sap.m.MessageBox.error("Error saving travel request: " + oError.message);
                    }).finally(() => {
                        // Hide loader
                        this.getView().setBusy(false);
                    });

                });
            } else {
                sap.m.MessageToast.show("Please add Travel Expenses.");
            }

        },


        _onRouteMatched: function (oEvent) {

          

            this.travelId = oEvent.getParameter("arguments").travelId;
            const oModel = this.getOwnerComponent().getModel(); // OData V4 model
            const oContextBinding = oModel.bindContext(`/TravelRequests(${this.travelId})`);

            oContextBinding.requestObject().then((oData) => {
                console.log("Single travel request data:", oData);

                const oJSONModel = new sap.ui.model.json.JSONModel(oData);
                this.getOwnerComponent().setModel(oJSONModel, "travelData");
                console.log(oJSONModel);

            }).catch((oError) => {
                console.error("Failed to fetch specific travel request:", oError);
                sap.m.MessageBox.error("Error fetching data.");
            });

            const oModel1 = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel1.getProperty("/expenses") || [];

            if (aExpenses.length > 0) {
                this.byId("idReceiptEntry").setVisible(true);
                this.byId("expenseTable").setVisible(true);

            }else{
                this.byId("idReceiptEntry").setVisible(false);
                this.byId("expenseTable").setVisible(false);

            }
        },
        onForwardArrowPress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("travelData");
            const oRowData = oContext.getObject();

            this.travelId = oRowData.ID;
            this.getOwnerComponent().getRouter().navTo("CreateTravelExpenseScreen", {
                travelId: travelId
            });


        }

    });
});
