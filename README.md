# tomato

`main` branch for prod
`dev` branch for dev

**DON'T FORGET TO FILL ALL .ENV**

# Run the web app

## Install dependencies

```bash
pnpm install
```

## Fill .env file

You need to create a `.env.local` file with the following the `.env.example` file. If you haven't start supabase locally, go to the [Run supabase locally](#run-supabase-locally) section.

## Run the app

```bash
pnpm run dev
```

# How to use supabase

## Run supabase locally

### Install supabase CLI

```bash
npm install -g supabase-cli
```
or 
```bash
brew install supabase-cli
```

### Run supabase

Before running supabase you need to create a `.env` file with the following variables following the `.env.example` file.

Then you can start supabase with:

```bash
supabase start
```

### Errors

1. `Error: Error evaluating "env(DISCORD_CLIENT)": environment variable DISCORD_CLIENT is unset.`

Because we are using env variable in the supabase config file, you need to first source the `.env` file with `source .env`.

For example if you are at the root of the project you can run this command to source the `.env` file.

```bash
source ./supabase/.env
```

Then you can restart the supabase server.

## Deployments

If you have a PR with a new migrations you don't need to do something special. When you will merge your new branch on `dev` a github action will start and check if the current file `supabase_types` is up to date.

The migration will be automatically applied when you merge on `main`.

## Migrations

### Automatic migrations (Recommanded)

Unlike manual migrations, auto schema diff creates a new migration script from changes already applied to your local database.

Create an employees table under the public schema using Studio UI, accessible at localhost:54323 by default.

Next, generate a schema diff by running the following command:

```bash
supabase db diff -f new_employee
```

### Manual migrations

#### Create a new migration script by running:

```bash
supabase migration new name_of_migration
```

You should see a new file created: `supabase/migrations/<timestamp>_name_of_migration.sql`. You can then write SQL statements in this script using a text editor:

```sql
create table public.example (
  id integer primary key generated always as identity,
  name text
);
```

Apply the new migration to your **local database**:

```bash
supabase db reset
```

This command recreates your local database from scratch and applies all migration scripts under supabase/migrations directory. Now your local database is up to date.

# Tomato helper

The `tomato.py` file in the `cli` directory is a custom CLI for repetitive tasks.
To use it you need to follow this steps:

1. Install python requirements: `pip install -r cli/requirements.txt`

2. Create a `.env` file with the following variables (see https://app.supabase.com/dashboard/project/_/settings/general):

```
SUPABASE_PROJECT_ID=
```

3. Source the `source_me` file every time you start a new working session:

```bash
source source_me
```

Or add this line to your `.bashrc` or `.zshrc` depending on which on you use:

```bash
alias tmt="python3 /path/to/tomato/cli/tomato.py"
```

4. Now you can use the CLI with `tmt` command

### Available commands

- `tmt db_types` : Generate typescript types for supabase tables
- `tmt db_migrate` : Apply pending database migration to your local supabase instance
- `tmt db_reset` : Reset your local database and apply all the migrations
- `tmt db_types` : Generates the supabase database types for typescript development
- `tmt setup` : Install all the project dependencies needed by node.js
- `tmt start` : Start the supabase local instance with the environments loaded
- `tmt stop` : Stop the supabase local instance

You can see each one off these by doing:

- `tmt -h`

### Finder flow

# Step to use the feature in local 

1. `tmt db_reset`
2. Aller sur http://localhost:54323/project/default/database/hooks et Cliquer sur modifier le webhook
3. Changer l'url avec `http://host.docker.internal:54321/functions/v1/handle_scan_insert`
4. Remplacer le header Authorization avec `Bearer your_anon_token`
5. Remplir le `tomato-x-edge-token` avec `super-secret-jwt-token-with-at-least-32-characters-long`
6. Creer un `.env` dans `./supabase` et le remplir avec
```bash
export RESEND_API_KEY=ask_me_in_dm
export TOMATO_EDGE_TOKEN=super-secret-jwt-token-with-at-least-32-characters-long
export TOMATO_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
```
7. Inserer le jwt token dans supabase, tu va dans l'invite de commande sql de supabase en local et tu execute ça 
```sql
insert into vault.secrets (name, secret)
values ('tomato-jwt-token', 'super-secret-jwt-token-with-at-least-32-characters-long') returning *;
```
9. Ouvrir un nouveau terminal et lancer `tmt fn_run`
8. Et apres tu creers un item, tu le marque en lost et tu ouvre la page de qrcode sur une nav privée. Si t'as besoin d'aide demande
