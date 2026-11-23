# Planted issues in fixture-shop (16)

## Security
S1 public/app.js:1 secret Stripe key in client bundle
S2 server.js:11 SQL injection in product search
S3 server.js:22,32 SQL injection in inserts
S4 server.js:16 price taken from client body
S5 server.js:26 /api/admin/users has no auth and returns passwords
S6 server.js:32 passwords stored in plaintext
S7 .gitignore missing .env (.env committed)
S8 server.js:8 SMTP password hardcoded
S9 public/app.js:8 innerHTML with server data (XSS sink)

## Functional
F1 server.js:17-18 SAVE10 discount applied twice
F2 public/app.js:4 qty is a string / element #qty doesn't exist
F3 cart in localStorage never cleared, re-charges old items each buy
F4 no error handling: db callbacks ignore err, sendMail unawaited
F5 no tests (npm test is a stub)

## Architecture
A1 server.js god file: routes + SQL + email in one place
A2 duplicated email validation (checkout + signup)

## Design / UX
D1 img without alt
D2 div used as button (not keyboard reachable)
D3 low contrast #c8c8c8 at 11px
D4 no viewport meta / fixed 420px width, not responsive
D5 input has no label
