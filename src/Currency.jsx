import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Alphabetically sorted currency list
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
].sort();

// Currency to country mapping
const currencyToCountry = {
  AED: "AE", ARS: "AR", AUD: "AU", BHD: "BH", BDT: "BD", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BTN: "BT", BYN: "BY", BWP: "BW", BZD: "BZ",
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

// Convert country code to emoji
function countryCodeToEmoji(code) {
  if (code === "EU") return "🇪🇺";
  return code.toUpperCase().replace(/./g, (char) =>
    String.fromCodePoint(127397 + char.charCodeAt())
  );
}

// Format date
const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function Currency() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalRates, setHistoricalRates] = useState({ dates: [], values: [] });

  // Fetch latest rates
  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await res.json();
      if (!res.ok || data.result !== "success") throw new Error("API error");
      setRates(data.rates);
    } catch {
      setError("Unable to fetch live rates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch 7-day historical rates
  const fetchHistoricalRates = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6); // last 7 days

      const url = `https://api.exchangerate.host/timeseries?start_date=${formatDate(
        startDate
      )}&end_date=${formatDate(endDate)}&base=${fromCurrency}&symbols=${toCurrency}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.rates) {
        const dates = Object.keys(data.rates).sort();
        const values = dates.map((d) => data.rates[d][toCurrency]);
        setHistoricalRates({ dates, values });
      } else {
        setHistoricalRates({ dates: [], values: [] });
      }
    } catch {
      setHistoricalRates({ dates: [], values: [] });
    }
  };

  useEffect(() => {
    fetchRates();
    fetchHistoricalRates();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (!amount || isNaN(amount)) {
      setResult("");
      return;
    }
    if (rates[toCurrency]) {
      setResult(`${amount} ${fromCurrency} = ${(amount * rates[toCurrency]).toFixed(4)} ${toCurrency}`);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

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
          placeholder="💰 Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded text-sm mb-3"
        />

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
            onClick={swap}
            className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex-1"
          >
            🔄 Swap
          </button>
        </div>

        {loading && <p className="text-center text-yellow-600">⏳ Loading rates...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {result && <div className="bg-gray-100 dark:bg-gray-700 p-3 mt-2 rounded text-center font-semibold text-lg">{result}</div>}

        {/* Historical chart */}
        {historicalRates.values.length > 0 && (
          <div className="mt-4">
            <h3 className="text-center font-semibold mb-2">📈 Last 7 Days</h3>
            <Line
              data={{
                labels: historicalRates.dates,
                datasets: [
                  {
                    label: `${fromCurrency} → ${toCurrency}`,
                    data: historicalRates.values,
                    borderColor: "rgba(59, 130, 246, 1)",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: true } } }}
            />
          </div>
        )}
      </div>
    </div>
  );
}