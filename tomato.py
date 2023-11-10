import argparse
import os
import subprocess

from dotenv import load_dotenv

load_dotenv()


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
    project_id = os.environ.get("SUPABASE_PROJECT_ID")
    f = open("tsutils/supabase_types.ts", "w")
    if not project_id:
        print("Error: SUPABASE_PROJECT_ID environment variable not set.")
        return

    subprocess.run(
        [
            "npx",
            "supabase",
            "gen",
            "types",
            "typescript",
            "--project-id",
            project_id,
            "--schema",
            "public",
        ],
        stdout=f,
    )


COMMANDS = {
    "db_types": generate_supabase_types,
}


def main():
    args = parse_command(COMMANDS)
    command = args["command"]
    command_args = args["command_args"]

    COMMANDS[command](*command_args)


if __name__ == "__main__":
    main()
