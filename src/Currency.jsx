import { useState, useEffect } from "react";

// Sorted currency list (ascending)
const currencyList = [
  "AED","ARS","AUD","BHD","BDT","BMD","BND","BOB","BRL","BTN","BYN","BWP","BZD",
  "CAD","CHF","CLP","CNY","COP","CRC","CUP","CVE","CZK",
  "DJF","DKK","DOP","DZD",
  "EGP","ERN","ETB","EUR",
  "FJD","FKP",
  "GBP","GEL","GHS","GIP","GNF","GTQ","GYD",
  "HKD","HNL","HRK","HTG","HUF",
  "IDR","ILS","INR","IQD","IRR","ISK",
  "JMD","JOD","JPY",
  "KES","KGS","KHR","KMF","KRW","KWD","KYD","KZT",
  "LAK","LBP","LKR","LRD","LSL","LYD",
  "MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MYR","MZN",
  "NAD","NGN","NIO","NOK","NPR","NZD",
  "OMR",
  "PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR",
  "RON","RSD","RUB","RWF",
  "SAR","SBD","SCR","SEK","SGD","SHP","SLL","SOS","SRD","STN","SVC","SZL",
  "THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS",
  "UAH","UGX","USD","UYU","UZS",
  "VES","VND","VUV",
  "WST","XAF","XCD","XOF","XPF",
  "YER","ZAR","ZMW","ZWL"
];

// Map currency to country code for emoji flags (same mapping, no change)
const currencyToCountry = {
  AED: "AE", ARS: "AR", AUD: "AU", BHD: "BH", BDT: "BD", BMD: "BM", BND: "BN", BOO: "BO", BRL: "BR", BTN: "BT", BYN: "BY", BWP: "BW", BZD: "BZ",
  CAD: "CA", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU", CVE: "CV", CZK: "CZ",
  DJF: "DJ", DKK: "DK", DOP: "DO", DZD: "DZ",
  EGP: "EG", ERN: "ER", ETB: "ET", EUR: "EU",
  FJD: "FJ", FKP: "FK",
  GBP: "GB", GEL: "GE", GHS: "GH", GIP: "GI", GNF: "GN", GTQ: "GT", GYD: "GY",
  HKD: "HK", HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU",
  IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS",
  JMD: "JM", JOD: "JO", JPY: "JP",
  KES: "KE", KGS: "KG", KHR: "KH", KMF: "KM", KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ",
  LAK: "LA", LBP: "LB", LKR: "LK", LRD: "LR", LSL: "LS", LYD: "LY",
  MAD: "MA", MDL: "MD", MGA: "MG", MKD: "MK", MMK: "MM", MNT: "MN", MOP: "MO", MRU: "MR", MUR: "MU", MVR: "MV", MWK: "MW", MXN: "MX", MYR: "MY", MZN: "MZ",
  NAD: "NA", NGN: "NG", NIO: "NI", NOK: "NO", NPR: "NP", NZD: "NZ",
  OMR: "OM",
  PAB: "PA", PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL", PYG: "PY", QAR: "QA",
  RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW",
  SAR: "SA", SBD: "SB", SCR: "SC", SEK: "SE", SGD: "SG", SHP: "SH", SLL: "SL", SOS: "SO", SRD: "SR", STN: "ST", SVC: "SV", SZL: "SZ",
  THB: "TH", TJS: "TJ", TMT: "TM", TND: "TN", TOP: "TO", TRY: "TR", TTD: "TT", TWD: "TW", TZS: "TZ",
  UAH: "UA", UGX: "UG", USD: "US", UYU: "UY", UZS: "UZ",
  VES: "VE", VND: "VN", VUV: "VU",
  WST: "WS", XAF: "CM", XCD: "AG", XOF: "SN", XPF: "PF",
  YER: "YE", ZAR: "ZA", ZMW: "ZM", ZWL: "ZW"
};
// Convert country code to emoji flag
function countryCodeToEmoji(code) {
  if (code === "EU") return "🇪🇺"; // special case for Euro
  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

export default function Currency() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rates from API
  const fetchRates = async (base = fromCurrency) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (data.result !== "success") throw new Error("API error");
      setRates(data.rates);
      setLoading(false);
    } catch {
      setError("Unable to fetch live rates");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(fromCurrency);
  }, [fromCurrency]);

  // Convert amount
  const convert = () => {
    if (!amount || isNaN(amount)) {
      setResult("Enter a valid number");
      return;
    }
    const rate = rates[toCurrency];
    if (rate) {
      setResult(`${amount} ${fromCurrency} = ${(amount * rate).toFixed(4)} ${toCurrency}`);
    } else {
      setResult("Rate not available");
    }
  };

  // Swap currencies
  const swap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-sm">
        <h2 className="text-xl font-bold mb-4 text-center">💱 Currency Converter</h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded text-sm mb-3"
        />

        {/* From / To dropdowns with emoji flags */}
        <div className="flex gap-2 mb-3">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="flex-1 p-2 border rounded text-sm"
          >
            {currencyList.map((c) => (
              <option key={c} value={c}>
                {countryCodeToEmoji(currencyToCountry[c] || "US")} {c}
              </option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="flex-1 p-2 border rounded text-sm"
          >
            {currencyList.map((c) => (
              <option key={c} value={c}>
                {countryCodeToEmoji(currencyToCountry[c] || "US")} {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={convert}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm flex-1"
          >💲 Convert</button>

          <button
            onClick={swap}
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm flex-1"
          >🔄 Swap</button>
        </div>

        {loading && <p className="text-center text-yellow-600">⏳ Loading rates...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {result && <div className="bg-gray-100 dark:bg-gray-700 p-3 mt-2 rounded text-center">{result}</div>}
      </div>
    </div>
  );
}