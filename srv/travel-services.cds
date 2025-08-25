using travel from '../db/interactions';

service TravelService {

   
  entity TravelRequests as projection on travel.TravelRequests;
  entity TravelExpenses as projection on travel.TravelExpenses;

    @cds.function
  function whoAmI() returns {
    id         : String;
    email      : String;
    givenName  : String;
    familyName : String;
    roles      : array of String;
  };


    action startTravelWorkflow(travelData: LargeString) returns String;

}
