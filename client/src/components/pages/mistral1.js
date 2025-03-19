const apiKey = "hiirJwgJlEBEXxj7SlGS7fAsr27wocwr"; // Replace with your Mistral API key

// Sample data (this is the raw receipt data you provided)
const rawData = `D: Mart
Avenue Supepmarts Limited:
CIN No : L51900M12000PLE126473
GSTIN : 24AACCAB492H1ZW
FSSAT No ¢ 10723026000820
T DMART GOTA
H,
4 MENGE SuphugTS LTD
PLOT No. 433 ANDEMATARAM
EGETARLE MARKET BESIDE
fo TOWNSHIP,
UASKOL, AHHEDABAD, 362481
yy 6274330765627 FT NES.
Esirs it nls =
FARCE
BALI No : 383301007-006267 B11 Ot : 23/01/2025( 9:48PM
Vou. No : 5337007-0268 Cashier : ASH/337162
HSN Particulars Qty/Kg N/Rate Value
1) CGST @ 6.00%, SGST & 6.00%
640220 DIAMOND MEN SLT-ns 1 99.00 99.00
2) CGST @ 9.00%, SGST E 9.00%
190532 NESTLE KITKAT-16.4§ 2 18.00 36.00
340120 SANTOOR CLASS-200n1 1 49.50 49.50
340540 REFLECT DISHWA-500¢ 1 38.00 35.00
392410 PL SEALING CLIP BAG 1 59.00 59.00
3) 06ST 0.00% SGSTE 0.00%
SALE ROUND OFF ACCOUNT (-)o..x 0.50
Items: 5 Qty: 6 278.00
<oemenee 0ST Breakup Detalls => (Anaunt TNR)
or Twable CT ST rg poe
IND Anaunt Amount
oe AD AT B80. &
ARNE CEE yi 9.00
RARE 179.50
Sal ns -0.50
- 10.9 18.9 -
no uo (8 218.00
< Anount Recetved Fyn Custonep: .... > =
Cash ; 50 WER
ance Patd In Cagh 200 /-
sl 22.00
« Gaved Rs. 124 qq)`;

const extractData = async (data) => {
  try {
    const response = await fetch('https://api.mistral.ai/v1/extract-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text: data }), // sending raw data as text
    });

    const result = await response.json();

    // Log the full response to see what data is returned
    console.log(result);

    // Assuming Mistral API returns the vendor name and amount as key-value pairs.
    const vendorName = result.entities.vendor_name; // or look for vendor-related entity
    const totalAmount = result.entities.total_amount; // or look for amount-related entity

    console.log('Vendor Name:', vendorName);
    console.log('Total Amount:', totalAmount);
  } catch (error) {
    console.error('Error extracting data:', error);
  }
};

// Call the function with the raw data
extractData(rawData);
