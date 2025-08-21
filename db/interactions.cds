namespace travel;


entity TravelRequests {
  key ID          : UUID;
      employee    : String;
      startDate   : Date;
      endDate     : Date;
      postingDate : Date;
      selfTravel  : String;
      placeOfVisit: String;
      estimatedCost: Decimal(10,2);
      action      : Integer;
      createdAt   : Timestamp;
      departure: String;
      arrival:String;
      travelType: String;
      purposeOfTravel: String;
      additionalTravellers: String;
      advances: String;
      costAssignment: String;
      status: String; //review, draft, approval
      Approvedstatus: String; //Approved, Rejected
        // Add association to TravelExpenses
      expenses    : Composition of many TravelExpenses
                      on expenses.travelRequest = $self;
}

entity TravelExpenses {
  key ID          : UUID;
      travelRequest : Association to TravelRequests;
      expenseType   : String;
      receiptAmount : Decimal(10,2);
      receiptDate   : Date;
      currency      : String;
}