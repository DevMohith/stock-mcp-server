import { FastMCP } from "fastmcp";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.STOCK_API;
const BASE_URL = process.env.URL;

const server = new FastMCP({
  name: "Stock Market MCP",
  version: "1.0.0",
});


server.addTool({
  name: "get_stock_quote",
  description: "Returns the latest stock price information",

  parameters: z.object({
    symbol: z.string().describe("Stock Symbol (Example: AAPL, TSLA, MSFT)")
  }),

  execute: async ({ symbol }) => {

    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    const data = response.data;

    return JSON.stringify({
      symbol,
      currentPrice: data.c,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t
    }, null, 2);
  },
});


server.addTool({
  name: "get_company_profile",
  description: "Returns company profile details",

  parameters: z.object({
    symbol: z.string().describe("Stock Symbol")
  }),

  execute: async ({ symbol }) => {

    const response = await axios.get(`${BASE_URL}/stock/profile2`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    const company = response.data;

    return JSON.stringify({
      name: company.name,
      ticker: company.ticker,
      exchange: company.exchange,
      country: company.country,
      currency: company.currency,
      industry: company.finnhubIndustry,
      marketCap: company.marketCapitalization,
      ipo: company.ipo,
      website: company.weburl
    }, null, 2);
  },
});


server.start({
  transportType: "stdio",
});