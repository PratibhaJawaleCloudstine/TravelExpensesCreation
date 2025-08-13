// // srv/triggerBPA.js
const axios = require("axios");

module.exports = async function (req, res) {
  const { travelData } = req.data;

  try {
    const result = await axios.post(
      "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
      {
        definitionId: "us10.6440fac5trial.travelexpenses.tavelExpensesProcess",
        context: travelData
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICI3OWovQ0VYUzMxeldxaFlwUlZ3S05waFBpMEF6bmRPYS9MZGFhdFVlNmJzPSJ9.eyJqdGkiOiI3N2FiZTA3OGRlNzQ0YWY5YjQ3NDA4YTFkOWZiNjk3OCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU1MDAzODc3LCJleHAiOjE3NTUwNDcwNzcsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.dxrh_naPMYEHLzkxUYdsEVMQdfQ7OTuB2dkFjOMOYtDhqRqMWtjF_9vHyk-QtYWncY_i0AHgVg8y6bOZLvDJfnCj9WOGUufS2sYZfR8Sn2FtYKr8kYV5h7fnBgPbK74jL95lhJQsXoCri2Ejn3vkKCDwgIhXrZRVmtlidNjf0RyMXymoDc2uspr9anjNfl0aQbJ-kSWkxpbXSl9a_7nO6c7uhrjeGQAVnvB-X5QC1jv05MFkLPt1udOZ9Rg7G70xH0FpFhpPygwPZWIqK2I4co42PfXwU7Fa-9fz2fubR96ynjnjLTYNJ8Kuz0gsmXhGKwU249uTrgw4GW0oN64BHg` // secure in .env or xsenv
        }
      }
    );

    return result.data;
  } catch (error) {
    console.error("Error triggering BPA:", error.response?.data || error.message);
    return res.status(500).send("BPA Trigger Failed");
  }
};
