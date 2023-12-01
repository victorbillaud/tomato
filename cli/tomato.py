import argparse
import os
import subprocess

from dotenv import load_dotenv


def parse_command(commands):
    """Parse the cli arguments and return them"""
    longest_command_name = max(len(cmd) for cmd in COMMANDS.keys())
    commands_description = [
        f"  {name:{longest_command_name}}   {fn.__doc__}"
        for name, fn in sorted(COMMANDS.items())
    ]
    epilog = "\n".join(["commands:"] + commands_description)

    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=epilog,
    )
    parser.add_argument("command", choices=list(commands.keys()), metavar="command")
    parser.add_argument("command_args", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    return {"command": args.command, "command_args": args.command_args}


def generate_supabase_types():
    """Generates the supabase database types for typescript development"""
    type_file = open("./utils/lib/supabase/supabase_types.ts", "w+")

    os.chdir("./web")

    project_id = os.environ.get("SUPABASE_PROJECT_ID")
    if not project_id:
        print("Error: SUPABASE_PROJECT_ID environment variable not set.")
        return

    # Ask user for locale or remote database
    user_choice = input(
        "Do you want to generate types for your local database? (y/n): "
    )

    if user_choice == "y":
        subprocess.run(
            [
                "pnpm",
                "dlx",
                "supabase",
                "gen",
                "types",
                "typescript",
                "--local",
            ],
            stdout=type_file,
        )
    else:
        subprocess.run(
            [
                "pnpm",
                "dlx",
                "supabase",
                "gen",
                "types",
                "typescript",
                "--project-id",
                project_id,
                "--schema",
                "public",
            ],
            stdout=type_file,
        )
    type_file.close()
    os.chdir("../")


def apply_db_change_to_migration(migration_name: str):
    """Create a new migration with your local db schema changes"""
    user_choice = input(
        f"Do you want to create a new migration named '{migration_name}'? (y/n): "
    )
    if user_choice == "y":
        subprocess.run(["supabase", "db", "diff", "-f", migration_name])


def migrate_db_changes():
    """Apply pending database migration to your local supabase instance"""
    subprocess.run(["supabase", "migration", "up", "--local"])


def reset_database():
    """Reset your local database and apply all the migrations"""
    user_choice = input("Are you sure you want to reset your local database ? (y/n): ")
    if user_choice == "y":
        subprocess.run(["supabase", "db", "reset"])


def install_dependencies():
    """Install all the project dependencies needed by node.js"""
    # Move to utils directory
    os.chdir("./utils")
    # Install node dependencies via pnpm
    subprocess.run(["pnpm", "install"])
    # Move to web directory
    os.chdir("../web")
    # Install node dependencies via pnpm
    subprocess.run(["pnpm", "install"])
    # Move back to original directory
    os.chdir("../")


def start_supabase():
    """Start the supabase local instance with the environments loaded"""
    # TODO check the envs and give better error message
    # Move to supabase directory
    os.chdir("./supabase")
    # Start supabase local install
    subprocess.run(["supabase", "start"])
    # Move back to original directory
    os.chdir("../")


def stop_supabase():
    """Stop the supabase local instance"""
    # TODO check the envs and give better error message
    # Move to supabase directory
    os.chdir("./supabase")
    # Stop the supabase local install
    subprocess.run(["supabase", "stop"])
    # Move back to original directory
    os.chdir("../")


def create_edge_function(function_name: str):
    """Create a new edge function"""
    user_choice = input(
        f"Do you want to create a new supabase function named '{function_name}'? (y/n): "
    )
    if user_choice == "y":
        # Move to supabase directory
        os.chdir("./supabase")
        # Create a new supabase function
        subprocess.run(["supabase", "functions", "new", function_name])

    os.chdir("../")


def run_edge_function():
    """Run a supabase function"""
    # Move to supabase directory
    os.chdir("./supabase")
    # Create a new supabase function
    subprocess.run(
        [
            "supabase",
            "functions",
            "serve",
            "--no-verify-jwt",
            "--env-file",
            "supabase/.env",
        ]
    )

    os.chdir("../")


def deploy_edge_function():
    """Deploy a supabase function"""
    # Move to supabase directory
    os.chdir("./supabase")
    # Create a new supabase function
    subprocess.run(
        [
            "supabase",
            "functions",
            "deploy",
        ]
    )

    os.chdir("../")


COMMANDS = {
    "db_types": generate_supabase_types,
    "db_apply": apply_db_change_to_migration,
    "db_reset": reset_database,
    "db_migrate": migrate_db_changes,
    "fn_new": create_edge_function,
    "fn_run": run_edge_function,
    "fn_deploy": deploy_edge_function,
    "setup": install_dependencies,
    "start": start_supabase,
    "stop": stop_supabase,
}


def main():
    # Determine the absolute path to the directory where tomato.py is located
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Change the current working directory to the script directory
    os.chdir(script_dir)
    os.chdir("../")
    load_dotenv("./.env")
    load_dotenv("./supabase/.env")

    # Rest of your main function follows
    args = parse_command(COMMANDS)
    command = args["command"]
    command_args = args["command_args"]

    COMMANDS[command](*command_args)


if __name__ == "__main__":
    main()
