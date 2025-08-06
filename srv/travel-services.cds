using travel from '../db/interactions';

service TravelService {

   
  entity TravelRequests as projection on travel.TravelRequests;
  entity TravelExpenses as projection on travel.TravelExpenses;
}
