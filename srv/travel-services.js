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
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICJ2b251TnBkbWhnUzYrU1dGc1F6K3hqc3JwRTcrR2RQUzVTV1MxMmNTWDVBPSJ9.eyJqdGkiOiIwY2NkMzJlN2MwN2I0NjY0OWNiMzg2NjE2NzJiZjg0NCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU4Nzk5MTgzLCJleHAiOjE3NTg4NDIzODMsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.NPY9EtHMdcYt6ZvqnJenpayi12bEzo0yaBagvDIfBk9nfzBiEwv8hQq1blid_x_cN5YcPAbvoTm_0a1u7OA3h5W5rpDJnfQJoovJI0GZHcrKNYL-oNKmvfL990jgLwmdjT2Mn6OHTsNA9lv6U8W-gRUxIibgJ5Vtzg4azvs5C6UMQfvM1AOjI8NkP5eXHSdUa9myPoUHZvOfNj0PxpekTQt3jsDatO0bgRSLtnKxQNCK4Vdb1Hq5EwxjRscrLqzpqRubOm00Dnq2mQqb2qgom5abgOD6L8RL1EpZItU-rqELa44fTwEJTpi1Ws6FdENbpAUqMe7KzECCiPm1tiP9UA'
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

