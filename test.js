import { decrypt } from "./azure/utils.js";
import dotenv from 'dotenv';
dotenv.config();

const message = "QML8vyRQRenGyMx9bpHoYyvl4ORZUCumFkIBC2fBA7Ar3VZUiVUb9hLJrjtADOB"

const data = "hiWCpnS0TZIPUutLE4SNUHgyqwrgydvozdUXCbscehx"

decrypt(process.env.AZURE_PRIVATE_KEY, message, data)

// process.env.AZURE_ENCRYPTION_CERT.split(String.raw`\n`).join('\n')