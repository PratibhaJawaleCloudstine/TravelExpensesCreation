// // srv/triggerBPA.js
const axios = require("axios");

module.exports = async function (req, res) {
  const { travelData } = req.data;

  try {
    const result = await axios.post(
      "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
      {
        definitionId: "us10.6440fac5trial.travelexpapproval1.travelExpensesProcess",
        context: travelData
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICJQdGVMOGtxK3VaZDRvcTJpamhCbHVtOGphekNGNkJBNTk0aU5ta2RUcGpnPSJ9.eyJqdGkiOiIyOWIwZDU1MzM0YTU0MjczYmNiMDZmMTliMWE0ZmU1MCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU1MTUwNDk1LCJleHAiOjE3NTUxOTM2OTUsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.lvhudfD6MMC0Fd4SmqoNeChDjlHhZpIPN4IVQmA0dHNBYhw2TP6yJys4SwGkT9x0YSx3RakESKe9vF2C8qARkT0eg31YfmUHgXuWonusBj1dJwW0f91h-Y88C2IbhblJM_G4-kZo_hEt5HmGwNPUBD0s0Q7242nG_rGi8adKZPgFzgUiC9d7YvM6uhJ2hLVlB3qOB8m5oRZ5tMBEkN_xa0mwOh2H3U2v6G-7qLMWXTUbDccRV-O7wDbT05CNjpusk8AHqEK_wi14BMkkYAMGwXUiDdEuE0q-LDyUwbw5U3aPA_7-OLzMuviz_uHSD2X2eM5sTPOSWh7DJfGQdorJvQ` // secure in .env or xsenv
        }
      }
    );

    return result.data;
  } catch (error) {
    console.error("Error triggering BPA:", error.response?.data || error.message);
    return res.status(500).send("BPA Trigger Failed");
  }
};
