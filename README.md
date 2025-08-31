# Nosen  
**Crypto-Native Income Verification & Reporting**

Nosen bridges the gap between **onchain earnings** and the **traditional financial system**.  
We help freelancers, creators, and crypto earners turn wallet activity into **bank-compliant income proofs** (payslips, reports, and tax-ready documents).  



##  Problem  
- Crypto users struggle to prove income to banks, landlords, or embassies.  
- Onchain data is transparent but **not formatted for regulators**.  
- Lack of income proofs prevents access to **credit, visas, and compliance**.  



## Solution  
Nosen indexes wallet inflows, fetches historical token prices, and generates **verifiable proof documents**.  
Each report can be tied to an **ENS subdomain**, making proofs portable, onchain-verifiable, and human-readable.  


## MVP Flow  
1. **Connect Wallet**  
   User connects their wallet to Nosen.  

2. **Index Past Inflows**  
   Nosen aggregates wallet income events (ERC-20 transfers, stablecoin payments, exchange inflows, etc.).  

3. **Create ENS Subdomain**  
   User generates an **ENS subdomain** (e.g., `alice.nosen.eth`) which is **linked to their proof record**.  
   This acts as a decentralized identifier for their verified income history.  

4. **Generate Proof Document**  
   Nosen fetches historical prices (batched & cached), normalizes income, and generates exportable reports (PDF/CSV).  



## 🛠️ Tech Stack  
- **Backend:** Node.js, Express  
- **Blockchain Indexing:** The Graph / Covalent / custom indexer  
- **Database:** Postgres (caching token-day prices)  
- **Frontend:** React + Tailwind  
- **ENS Integration:** ENS.js / wagmi hooks  
- **Docs:** PDFKit / ReportLab  



##  Example Use Cases  
- Freelancers → Generate payslips for loan/credit  
- Crypto creators → Proof of income for rental or visa  
- DAOs → Issue verified payment records to contributors  
- Developers → Portable onchain proof of income via ENS subdomain  



##  Roadmap  
- MVP: Wallet connect + ENS subdomain + proof generator  
- V2: Multi-wallet + API integrations (Binance, Bybit)  
- V3: Optional tax filing + DAO attestations  
- V4: Full compliance rails (KYC/KYB, payroll processor license)  



