# CURA
CURA is a real-time medicine access and supply-intelligence platform that helps users find nearby pharmacies with available medicines, confirm pickup, and avoid wasted trips. It also helps pharmacies manage stock while Cura Pulse and Cura Radar identify demand trends and potential shortage risks.

Premium near-black medicine access and supply intelligence frontend built from the CURA blueprint and visual brief.

## Run

After installing dependencies, run `npm run build` and then `npm start`. Open http://localhost:3000. This command uses the included static server because this project uses Next.js static export; do not run `next start`.

Requires Node.js 20.9+.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run typecheck
npm run build
```

For restricted Windows runtimes that reject native filesystem resolution, use the scoped compatibility helper:

```powershell
$env:NODE_OPTIONS='--require ./scripts/windows-realpath.cjs'
npm run build
```

The production app is statically exported to `out/`. Host this directory with directory-index routing.

## Demo walkthrough

1. Search Paracetamol or ORS from Discover.
2. Filter pharmacy availability and inspect a confidence score.
3. Open a pharmacy and request a reservation through the staged flow.
4. Open For pharmacies → Reservations and confirm the request.
5. Return to patient Reservations to see Ready for pickup.
6. Open `/demo` and advance the ORS scenario from 91% to 78% to 64% supply health.
7. View Pulse and Radar to inspect the simulated pressure and contributing signals.
8. Inventory → Review allows browser-local stock edits. Analytics shows coverage estimates. WasteWatch highlights expiry risk.
9. Reset demo restores seed records.

## Implementation

- Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Lucide icons.
- `components/Cura.tsx`: responsive application shell and task-specific experiences.
- `lib/data.ts`: typed fixtures and replaceable browser-local service adapter.
- `app/globals.css`: custom design system and responsive map/list presentation.
- All catalog medicine, pharmacy and required experience routes are pre-rendered.
- Reservation and inventory demo state persists in localStorage. Selected medicine and pharmacy persist in sessionStorage.
- Custom vector Delhi schematic supports pharmacy selection and zoom, without a paid map token.

## Scope

Frontend only. No real inventory, reservations, accounts, messages, prescriptions, payments, geolocation or validated forecasting. Network totals and charts are illustrative; four demo pharmacy records and five catalog medicines are interactive. The map is schematic, not a navigation map. Pharmacy verification and confirmation are simulated, not a real-world guarantee. Directions links search the displayed neighbourhood externally.

Production integration requires real catalog and inventory APIs, validated confidence/risk models, authenticated role-based access, reservation allocation/expiry enforcement, supplier data, privacy review, and a real map provider.
