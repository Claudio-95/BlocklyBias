import subprocess
from typing import List, Optional


def proccess_batch(commands: List):
    command_to_execute = []

    for command, args in commands:
        command_to_execute.extend(command(**args, execute=False))

    command_to_execute = [i for i in command_to_execute if i != "xdotool"]
    command_to_execute = ["xdotool"] + command_to_execute

    subprocess.call(command_to_execute)


def key(
    *,
    keysequence: List[str],
    clearmodifiers: Optional[bool] = None,
    delay: Optional[float | str] = None,
    repeat: Optional[int | str] = None,
    repeat_delay: Optional[float | str] = None,
    window: Optional[str] = None,
    execute: Optional[bool] = True,
) -> List[str]:
    command = ["xdotool", "key"]

    if clearmodifiers:
        command.append("--clearmodifiers")

    if delay:
        command.extend(["--delay", str(delay)])

    if repeat:
        command.extend(["--repeat", str(repeat)])

    if repeat_delay:
        command.extend(["--repeat-delay", str(repeat_delay)])

    if window:
        command.extend(["--window", str(window)])

    command.extend(keysequence)

    print(" ".join(command))

    if execute:
        subprocess.call(command)

    return command


def keydown(
    *,
    keysequence: List[str],
    clearmodifiers: Optional[bool] = None,
    delay: Optional[float | str] = None,
    repeat: Optional[int | str] = None,
    repeat_delay: Optional[float | str] = None,
    window: Optional[str] = None,
    execute: Optional[bool] = True,
) -> List[str]:
    command = ["xdotool", "keydown"]

    if clearmodifiers:
        command.append("--clearmodifiers")

    if delay:
        command.extend(["--delay", str(delay)])

    if repeat:
        command.extend(["--repeat", str(repeat)])

    if repeat_delay:
        command.extend(["--repeat-delay", str(repeat_delay)])

    if window:
        command.extend(["--window", str(window)])

    command.extend(keysequence)

    print(" ".join(command))

    if execute:
        subprocess.call(command)

    return command


def keyup(
    *,
    keysequence: List[str],
    clearmodifiers: Optional[bool] = None,
    delay: Optional[float | str] = None,
    repeat: Optional[int | str] = None,
    repeat_delay: Optional[float | str] = None,
    window: Optional[str] = None,
    execute: Optional[bool] = True,
) -> List[str]:
    command = ["xdotool", "keyup"]

    if clearmodifiers:
        command.append("--clearmodifiers")

    if delay:
        command.extend(["--delay", str(delay)])

    if repeat:
        command.extend(["--repeat", str(repeat)])

    if repeat_delay:
        command.extend(["--repeat-delay", str(repeat_delay)])

    if window:
        command.extend(["--window", str(window)])

    command.extend(keysequence)

    print(" ".join(command))

    if execute:
        subprocess.call(command)

    return command


def selectwindow() -> List[str]:
    command = ["xdotool", "selectwindow", "getmouselocation", "--shell"]
    result = subprocess.check_output(command)
    result = result.decode("utf-8").splitlines()
    return {
        "X": result[0].replace("X=", ""),
        "Y": result[1].replace("Y=", ""),
        "SCREEN": result[2].replace("SCREEN=", ""),
        "WINDOW": result[3].replace("WINDOW=", ""),
    }


def windowactivate(*, window: str | int) -> None:
    command = ["xdotool", "windowactivate", str(window)]
    subprocess.call(command)
