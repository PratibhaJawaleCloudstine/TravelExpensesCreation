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
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICI2cUZuZnpGdm5Zd0hCcW9CVzRobnRDclN1bGVkZzBzUFY2bjBzT0Y2RS8wPSJ9.eyJqdGkiOiI2NTRkZDhlNGFlMjg0OWNmYjM0OTFlZGQzMzc2Y2FlOSIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU1NDkyOTUwLCJleHAiOjE3NTU1MzYxNTAsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.YYRCh4NtztbCfgWeaxTLNoQMACCEAelaPyXjdDSsqAXWbJ2ewHjUk3sZ7CDvCZXOlAVoXx2TQi9hul0BfnAzq489hC1I9UrXrGRJQarNInlF1YlPYBr8Z__OuT3EV1iS4Ul02dMfDppPR5-mTnP19WOzdIvHqqdNCGmVmZrXd3uejSEG0H1wUG5qUElAInJP8YJIg69M_POYlOhzfrgGnpGI1TdwoITrIccCgg15hp9iYxrADYEMSVu4maKPBTxGgDFo5XqqLWCquuZn-AB0kyqV7SZPlpO2H9P9iP1VMKN4hFwKIgf2pe37t5xb8_8yntZ0HpPFV3ChH1e-DHp4uA` // secure in .env or xsenv
        }
      }
    );

    return result.data;
  } catch (error) {
    console.error("Error triggering BPA:", error.response?.data || error.message);
    return res.status(500).send("BPA Trigger Failed");
  }
};
