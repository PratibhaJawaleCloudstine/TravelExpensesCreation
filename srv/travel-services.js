const axios = require('axios');
const cds = require('@sap/cds');


module.exports = async function (srv) {

 
  srv.on('startTravelWorkflow', async (req) => {
    try {
      const payload = JSON.parse(req.data.travelData);

      const response = await axios.post(
        'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances',
        {
          definitionId: "us10.6440fac5trial.travelexpapproval1.travelExpensesProcess",
          context: payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICJZWGJ1VkhFbnBHd2Z4QUF1NG9ua1pNNERoNkVBcjBtSmtQdWg4dENmU0g4PSJ9.eyJqdGkiOiJkMzM3NTdiZTRiYzc0ODZiYjg3Y2ZmYTZlYzIzNTBiNiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU3MzA2ODk2LCJleHAiOjE3NTczNTAwOTYsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.BA1HOc67xrZqVjnVorJ42_LL19VWe7QVEhEeOSzmkETAgv6-IEDj2rX97jjgcHv3tQzOF8FjUp6pVkqXhi39xJjjmhtQh-MhFxJkrvlV0dNjeJL_yhSvZCTSveS5cZmnhS2ZZeGmdv-WTtvKQXcJsAah8A9I8y5OLaqFRPlzoQ8pbk63baCiFLDMmW8hH5H-uGm8GK4S80csHH8jNXADvTAkFD3dLXShM4bQO1ygYLQtrxocY8XwzglZ2XgrN0u0N7IW3poz0R7Gn19ltk6NT-iQy8B6SGHzbxPLaIvv1pD6YwT48xUypJCScRbXmFQ5e42Cb_CGLfcmIkYhCFhOfw'
          }
        }
      );

      return `Workflow started with ID: ${response.data.id}`;
    } catch (err) {
      console.error("Workflow trigger error:", err.response?.data || err.message);
      return `Error: ${err.message}`;
    }
  });

   // === Action to get current user info from XSUAA ===
  srv.on('whoAmI', async (req) => {
    const user = req.user; // user context from CAP + XSUAA
    return {
      id: user.id,
      email: user.attr?.email,
      givenName: user.attr?.given_name,
      familyName: user.attr?.family_name,
      roles: user.roles
    };
  });
};

