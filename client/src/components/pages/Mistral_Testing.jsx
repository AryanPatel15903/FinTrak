// const axios = require("axios");
// const { Check } = require("lucide-react");
import { Mistral } from "@mistralai/mistralai";

// Set your Mistral API URL and API key
// const apiUrl = "https://api.mistral.ai/v1/query"; // Replace with the correct Mistral API endpoint
const apiKey = "hiirJwgJlEBEXxj7SlGS7fAsr27wocwr"; // Replace with your Mistral API key
const ocrText = `il Turnpike
- p Turnpike Designs
Designs Co. 156 University Ave, Toronto
ON, Canada , M5H 2H7
416-555-1212
BILLTO Invoice Number: 14
Jiro Doi P.0./S.0. Number: AD29094
1954 Bloor Street West Invoice Date: 2018-09-25
Toronto, ON, M6P 3K9 Payment Due: Upon receipt
Canada
Amount Due (USD): $2,608.20
j_doi@example.com
416-555-1212
Services Quantity Price Amount
Platinum web hosting package 1 $65.00 $65.00
Down 35mb, Up 100mb
2 page website design 3 $2,100.00 $2,100.00
Includes basic wireframes, and responsive templates
Mobile designs 1 $250.00 $250.00
Includes responsive navigation
‘Subtotal: $2,145.00
Tax 8%: $193.20
Total: $2,608.20
Amount due (CAD): $2,608.20`;

const client = new Mistral({
  apiKey: apiKey,
});
export default function Mistral_Testing() {
  async function check() {
    const chatResponse = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `The following is a receipt text: ${ocrText}
    Please extract the following fields:
    - Vendor Name
    - Total Amount`
        },
      ],
    });

    console.log("JSON:", chatResponse.choices[0].message.content);
  }

  return (
    <>
      <button onClick={check}>click</button>
    </>
  );
}
