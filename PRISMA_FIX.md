# Prisma Build Fix Checklist

1) Dependencies  
- Ensure `@prisma/client` is listed in `dependencies` and `prisma` in `devDependencies` (already present in `package.json`).  
- If reinstalling from scratch:  
  ```bash
  npm install
  ```

2) Client generation  
- Schema: `prisma/schema.prisma` (SQLite datasource via `DATABASE_URL`).  
- Generate client (also runs on postinstall):  
  ```bash
  npx prisma generate
  ```  
- `package.json` has `"postinstall": "prisma generate"` for deployments.

3) Environment  
- Copy `env.example` → `.env.local` and set:  
  ```bash
  DATABASE_URL="file:./prisma/dev.db"
  AUTH_SECRET=replace-with-strong-secret
  ```

4) Migrations (optional for local DB creation)  
```bash
npx prisma migrate dev --name init_auth_profile
```

5) Prisma singleton  
- Server-only client lives at `src/lib/prisma.ts` using the global cache pattern to avoid hot-reload leaks.
- Import it only in server routes/server actions (e.g., `src/app/api/auth/verify/route.ts`).

6) Build/run sanity  
```bash
npm run build
npm run start
```

If `npx prisma generate` fails with network errors, re-run when online (needs access to npm registry).
