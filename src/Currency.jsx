import { useState, useEffect } from "react";

// Static currency list 150+ codes
const currencyList = [
  "AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL","BSD","BTN","BWP","BYN","BZD",
  "CAD","CDF","CHF","CLP","CNY","COP","CRC","CUC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF",
  "GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD",
  "LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR",
  "PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLL","SOS","SRD","STN","SVC","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD",
  "TZS","UAH","UGX","USD","UYU","UZS","VES","VND","VUV","WST","XAF","XCD","XOF","XPF","YER","ZAR","ZMW","ZWL"
];

export default function Currency() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

        <div className="flex gap-2 mb-3">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="flex-1 p-2 border rounded text-sm"
          >
            {currencyList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="flex-1 p-2 border rounded text-sm"
          >
            {currencyList.map((c) => (
              <option key={c} value={c}>{c}</option>
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