sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/unified/FileUploader",
    "sap/m/Dialog",
    "sap/m/Button"
], (Controller, FileUploader, Dialog, Button) => {
    "use strict";

    return Controller.extend("createtravelexpenses.createtravelexpensesui.controller.CreateTravelExpenseScreen", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("CreateTravelExpenseScreen").attachPatternMatched(this._onRouteMatched, this);

            const oData = {
                expenses: [],
                expenseTypes: [
                    { key: "Meals/Snacks", text: "Meals/Snacks" },
                    { key: "Air Travel", text: "Air Travel" },
                    { key: "Laundry", text: "Laundry" },
                    { key: "Rail Travel", text: "Rail Travel" },
                    { key: "Road Travel", text: "Road Travel" },
                    { key: "Alcohol", text: "Alcohol" }
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
                receiptDate: "",
                attachmentCount: "0",
                attachments: []
            });

            oModel.setProperty("/expenses", aExpenses);
            console.log(aExpenses);
        },

        onAmountChange: function (oEvent) {
            // 1. Get entered value
            let sValue = oEvent.getParameter("value");
            let fValue = parseFloat(sValue) || 0; // ensure numeric

            console.log("fValue " + fValue);

            const oModel = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel.getProperty("/expenses") || [];

            console.log("aExpenses ----------------------------------");
            console.log(aExpenses);

            this.totalExpenses = 0;

            aExpenses.forEach((item) => {
                this.totalExpenses = this.totalExpenses + parseInt(item.receiptAmount ? item.receiptAmount : 0.00, 10);
            });



            this.byId("id_expense_total").setText("₹ " + this.totalExpenses);
            this.displayTotalAmount();
            console.log("****** 79 **********");
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

            console.log("Review expenses");
            console.log(aExpenses);
            console.log(this.travelId);

            if (aExpenses.length > 0) {
                this.getOwnerComponent().getRouter().navTo("ReviewTravelExpensesScreen", {
                    travelId: this.travelId
                });
            } else {
                sap.m.MessageToast.show("Please add Travel Expenses.");
            }
        },




        onSaveDraft: function () {
            const oModel = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel.getProperty("/expenses") || [];

            const oActionModel = this.getOwnerComponent().getModel("actionModel");
            oActionModel.setProperty("/actionTaken", "save");

            console.log("Save expenses");
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
                        currency: "INR",
                        attachments: item.attachments || []
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

        onAttachmentPress: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("expenseModel");
            this._oSelectedContextPath = oContext.getPath();
            this._oSelectedExpense = oContext.getObject(); // store selected row data
            this._oAttachmentBtn = oButton;


            // Create dialog if not exists
            if (!this._oAttachmentDialog) {
                // VBox with a style class for padding
                var oVBox = new sap.m.VBox({
                    items: [
                        new sap.ui.unified.FileUploader("fileUploader", {
                            width: "100%",
                            sameFilenameAllowed: true,
                            change: this.onFileSelected.bind(this)
                        }),
                        new sap.m.List("attachmentList", {
                            items: {
                                path: "expenseModel>attachments",
                                template: new sap.m.StandardListItem({
                                    title: "{expenseModel>name}",
                                    description: "{expenseModel>type}"
                                })
                            }
                        })
                    ]
                }).addStyleClass("myDialogContentPadding");

                this._oAttachmentDialog = new sap.m.Dialog({
                    title: "Upload Attachment",
                    contentWidth: "400px",
                    content: [oVBox],
                    beginButton: new sap.m.Button({
                        text: "Done",
                        press: function () {
                            // get the button by id

                            // get count of attachments for the selected expense row
                            var iCount = (this._oSelectedExpense.attachments || []).length;
                            console.log("iCount-------------");
                            console.log(iCount);

                            // set button text with count
                            // Update only the clicked row's button
                            this._oAttachmentBtn.setText(iCount + (iCount === 1 ? " Attachment" : " Attachments"));

                            // Update model at the correct path
                            var oModel = this.getOwnerComponent().getModel("expenseModel");
                            oModel.setProperty(this._oSelectedContextPath + "/attachmentCount", iCount);

                            this._oAttachmentBtn.rerender();


                            this._oAttachmentDialog.close();
                        }.bind(this)
                    })
                });
                this.getView().addDependent(this._oAttachmentDialog);
            }

            // Bind list to selected row's attachments
            var oAttachmentList = sap.ui.getCore().byId("attachmentList");
            oAttachmentList.setBindingContext(oContext, "expenseModel");

            this._oAttachmentDialog.open();
        },

        onFileSelected: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oFile = oEvent.getParameter("files")[0];

            if (!oFile || !this._oSelectedExpense) {
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var sBase64 = e.target.result.split(",")[1]; // actual base64 content

                if (!this._oSelectedExpense.attachments) {
                    this._oSelectedExpense.attachments = [];
                }

                this._oSelectedExpense.attachments.push({
                    name: oFile.name,
                    type: oFile.type,
                    size: oFile.size,
                });

                // Refresh the model so list updates
                this.getOwnerComponent().getModel("expenseModel").refresh(true);

                // Clear file uploader
                oFileUploader.clear();
            }.bind(this);

            reader.readAsDataURL(oFile); //  reads file as base64
        },



        _onRouteMatched: function (oEvent) {



            var sTravelId = oEvent.getParameter("arguments").travelId;
            this.travelId = oEvent.getParameter("arguments").travelId;
            const oModel = this.getOwnerComponent().getModel(); // OData V4 model
            console.log("Travel ID in create------------");
            console.log(this.travelId);



            // Step 1: Bind list of expenses for the given travel request
            const oExpenseBinding = oModel.bindList(`/TravelRequests(${sTravelId})/expenses`);

            oExpenseBinding.requestContexts().then(async (aExpenseContexts) => {
                const aExpenses = [];
                console.log("****** aExpenses.length " + aExpenseContexts.length);
                if(aExpenseContexts.length >0){
                    this.byId("id_totalBlock").setVisible(true);
                }else{
                    this.byId("id_totalBlock").setVisible(false);
                }
                // Step 2: Loop through each expense
                for (const oCtx of aExpenseContexts) {
                    const oExpense = oCtx.getObject();
                    this.totalExpenses = this.totalExpenses + parseInt(oExpense.receiptAmount, 10);

                    // Initialize your structure
                    const oExpenseData = {
                        expenseType: oExpense.expenseType,
                        receiptAmount: oExpense.receiptAmount,
                        receiptDate: oExpense.receiptDate,
                        attachmentCount: oExpense.attachmentCount || 0,
                        attachments: []
                    };

                    // Step 3: Fetch attachments of this expense
                    const sExpenseId = oExpense.ID;
                    const oAttachmentBinding = oModel.bindList(
                        `/TravelRequests(${sTravelId})/expenses(${sExpenseId})/attachments`
                    );

                    try {
                        const aAttachmentContexts = await oAttachmentBinding.requestContexts();
                        oExpenseData.attachments = aAttachmentContexts.map(ctx => ctx.getObject());
                    } catch (err) {
                        console.error(`Error fetching attachments for expense ${sExpenseId}:`, err);
                    }

                    // Push into final array
                    aExpenses.push(oExpenseData);
                }

                // Step 4: Store into expenseModel
                const oExpenseModel = new sap.ui.model.json.JSONModel({ expenses: aExpenses });
                this.getView().setModel(oExpenseModel, "expenseModelReview");

                console.log("Final expenses with attachments:", aExpenses);

                if (aExpenses.length > 0) {
                    this.displayTotalAmount();
                    console.log("****** 387 **********");

                    this.byId("id_addExpenses").setVisible(false);
                    this.byId("id_expensesText").setVisible(true);
                    this.byId("id_expReview").setVisible(true);
                    this.byId("id_buttons").setVisible(false);
                } else {
                    this.byId("id_addExpenses").setVisible(true);
                    this.byId("id_expensesText").setVisible(false);
                    this.byId("id_expReview").setVisible(false);
                    this.byId("id_buttons").setVisible(true);
                }





            }).catch((oError) => {
                console.error("Failed to fetch expenses:", oError);
                sap.m.MessageBox.error("Error fetching travel expenses.");
            });


            const travelData = this.getOwnerComponent().getModel("travelData");
            var advance = travelData.advance ? travelData.advance : "0.00"
            this.byId("id_expense_advance").setText("-  ₹ " + advance);

            this.totalExpenses = 0.00;
            this.byId("id_expense_total").setText("₹ " + this.totalExpenses);
            if (this.totalExpenses = 0.00 > 0) {
                this.displayTotalAmount();
                console.log("****** 405 **********");
            }
            const oModel1 = this.getOwnerComponent().getModel("expenseModel");
            const aExpenses = oModel1.getProperty("/expenses") || [];

            if (aExpenses.length > 0) {
                this.byId("idReceiptEntry").setVisible(true);
                this.byId("expenseTable").setVisible(true);


            } else {
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


        },
        displayTotalAmount: function () {
            this.byId("id_totalBlock").setVisible(true);
            this.byId("id_expense_total").setText("₹ " + this.totalExpenses);

            const travelData = this.getOwnerComponent().getModel("travelData");
            var advance = travelData.advance ? travelData.advance : "0.00";
            var totalExp = this.totalExpenses - parseInt(advance, 10);
            this.byId("id_expense_total_exp").setText("₹ " + totalExp);


        }

    });
});
