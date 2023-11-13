# tomato

`main` branch for prod
`dev` branch for dev

**DON'T FORGET TO FILL ALL .ENV**

# Run the web app

## Install dependencies

`pnpm install`

## Fill .env file

You need to create a `.env.local` file with the following the `.env.example` file. If you haven't start supabase locally, go to the [Run supabase locally](#run-supabase-locally) section.

## Run the app

`pnpm run dev`

# How to use supabase

## Run supabase locally

### Install supabase CLI

`npm install -g supabase-cli` or `brew install supabase-cli`

### Run supabase

Before running supabase you need to create a `.env` file with the following variables following the `.env.example` file.

Then you can start supabase with:

`supabase start`

### Errors

1. `Error: Error evaluating "env(DISCORD_CLIENT)": environment variable DISCORD_CLIENT is unset.`

Because we are using env variable in the supabase config file, you need to first source the `.env` file with `source .env`.

For example if you are at the root of the project you can run this command to source the `.env` file.

`source ./supabase/.env`

Then you can restart the supabase server.


## Deployments

If you have a PR with a new migrations you don't need to do something special. When you will merge your new branch on `dev` a github action will start and check if the current file `supabase_types` is up to date.

The migration will be automatically applied when you merge on `main`.

## Migrations

### Automatic migrations (Recommanded)

Unlike manual migrations, auto schema diff creates a new migration script from changes already applied to your local database.

Create an employees table under the public schema using Studio UI, accessible at localhost:54323 by default.

Next, generate a schema diff by running the following command:

`supabase db diff -f new_employee`

### Manual migrations

#### Create a new migration script by running:

`supabase migration new name_of_migration`

You should see a new file created: `supabase/migrations/<timestamp>_name_of_migration.sql`. You can then write SQL statements in this script using a text editor:

```sql
create table public.example (
  id integer primary key generated always as identity,
  name text
);
```

Apply the new migration to your **local database**:

`supabase db reset`

This command recreates your local database from scratch and applies all migration scripts under supabase/migrations directory. Now your local database is up to date.

# Tomato helper

This `tomato.py` file is a custom CLI for repetitive tasks. 
To use it you need to follow this steps:

1. Install python requirements: `pip install -r requirements.txt`

2. Create a `.env` file with the following variables:

```
SUPABASE_PROJECT_ID=
```

3. Run the script with `python tomato.py` or create an alias in your `.bashrc` (or `.zshrc`) file:

```
alias tomato="python /path/to/tomato.py"
```

4. Now you can use the CLI with `tomato` command

### Available commands

- `tomato db_types` : Generate typescript types for supabase tables 
