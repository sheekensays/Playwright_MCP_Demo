# Playwright MCP Demo

A small end-to-end test project built as a way to learn the
**[Playwright MCP](https://github.com/microsoft/playwright-mcp)** server. The
tests run against the public GlobalsQA AngularJS banking demo:

<https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login>

The point of the repo is the **workflow**, not the app: scenarios are explored
live in a real browser through the MCP server, then the verified flow is
codified into TypeScript Page Objects and specs.

---

## How this project was built

### 1. Bare‑minimum Playwright first

TypeScript, Chromium only, HTML reporter. Nothing else scaffolded.

### 2. Driven with Playwright MCP

The [`.mcp.json`](.mcp.json) file registers the MCP server so an AI agent
(Claude Code, here) can control a live browser:

```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

For each scenario the loop was:

1. Describe the scenario in plain English (the pre‑assessment questions Q1/Q2 below).
2. The agent drives a real browser with MCP tools — `browser_navigate`,
   `browser_snapshot`, `browser_click`, `browser_select_option`,
   `browser_handle_dialog`, etc. — and confirms every step and assertion works.
3. Only then is the flow written into a spec + Page Object methods, using the
   selectors that were proven during exploration.

This catches app quirks *before* they become flaky tests — e.g. the Deposit /
Withdraw tab buttons share their labels with the form submit buttons, and the
"Add Customer" action fires a native `alert()`.

### 3. Refactored to Page Object Model

All locators and interactions live in `pages/*.page.ts`. Specs contain only the
flow and the assertions — no selectors.

### 4. Test data extracted to JSON

The customer list and the transaction list live in `testdata/*.json`. Changing
*what* is tested never means touching a `.ts` file.

---

## Project structure

```
Playwright_MCP_Demo/
├── .mcp.json                          # Playwright MCP server registration
├── playwright.config.ts               # Chromium project, HTML reporter, baseURL
├── tsconfig.json                      # strict; moduleResolution "bundler"
├── package.json
│
├── pages/                             # Page Object Model (no test runner code)
│   ├── login.page.ts                  # landing screen + customer name select
│   ├── manager.page.ts                # Add Customer form + Customers table
│   ├── customer-account.page.ts       # account switch, deposit/withdraw, balance
│   └── types.ts                       # Customer / Transaction interfaces + helpers
│
├── testdata/                          # scenario data, no logic
│   ├── q1-customers.json              # customers to add + customers to delete
│   └── q2-transactions.json           # customer, account, transaction list
│
└── tests/
    ├── fixtures.ts                    # extends `test` to inject the page objects
    ├── login.spec.ts                  # smoke test: page opens
    ├── q1-bank-manager-customers.spec.ts
    └── q2-customer-transactions.spec.ts
```

### How the layers connect

```
spec  ──imports──▶ tests/fixtures.ts ──new──▶ pages/*.page.ts ──▶ Playwright Page
  │                                                  ▲
  └──imports data──▶ testdata/*.json                 │
  └──imports types─▶ pages/types.ts ────────────────┘
```

A spec asks for the page objects it needs as fixture arguments:

```ts
test('...', async ({ loginPage, customerAccountPage }) => {
  await loginPage.goto();
  await loginPage.loginAsCustomer(customerName);
  await customerAccountPage.selectAccount(account);
  // ...
});
```

`fixtures.ts` builds each Page Object from the built‑in `page` fixture, so every
test gets a fresh browser context (and the AngularJS app re‑initialises to its
default data).

---

## Setup

```bash
npm install
npx playwright install chromium
```

### Using the MCP server (optional — only to build new scenarios)

The MCP server is separate from running the tests. It lets an MCP‑capable client
drive a browser.

- **Claude Code / other clients that read `.mcp.json`**: it is picked up
  automatically from this repo; approve the `playwright` server when prompted.
- **Manual CLI registration**:

  ```bash
  claude mcp add playwright -- npx @playwright/mcp@latest
  ```

The first tool call downloads `@playwright/mcp` via `npx`.

---

## Running the tests

```bash
npm test                 # headless, all projects
npm run test:headed      # watch the browser
npm run report           # open the last HTML report
npm run typecheck        # tsc --noEmit
```

Run one file:

```bash
npx playwright test tests/q2-customer-transactions.spec.ts
```

Check for flakiness:

```bash
npx playwright test --repeat-each=3
```

---

## The scenarios

### Q1 — Bank Manager (`q1-bank-manager-customers.spec.ts`)

1. Log in as **Bank Manager**.
2. Add every customer in `testdata/q1-customers.json`.
3. Open the **Customers** tab and verify each one is in the table.
4. Delete the customers listed under `toDelete` and verify they are gone while
   the rest remain.

### Q2 — Customer transactions (`q2-customer-transactions.spec.ts`)

1. **Customer Login** as the `customerName` from `testdata/q2-transactions.json`.
2. Select the `account`.
3. Apply each transaction (`Credit` → Deposit, `Debit` → Withdraw).
4. After **every** transaction, assert that the balance we compute matches the
   balance shown in the account header.
5. Assert the final balance equals `expectedFinalBalance`.

To test different data, edit only the JSON files.

---

## Notes on the target app

- **In‑memory data** resets on a fresh browser context (so every Playwright test
  starts clean) but **persists across plain reloads** within one context — worth
  knowing when exploring manually through MCP.
- Adding a customer triggers a native `alert()`; `ManagerPage` auto‑accepts it.
- Tab buttons and form submit buttons share labels. Page Objects address tabs by
  their AngularJS handler (`button[ng-click="deposit()"]`, `…="withdrawl()"`,
  `…="addCust()"`, `…="showCust()"`) and submits via `form button[type="submit"]`.
- Account `1003` (Hermoine Granger) starts at balance `0`, currency Rupee.
- Account header: `.center strong` → `[0]` account number, `[1]` balance, `[2]` currency.
