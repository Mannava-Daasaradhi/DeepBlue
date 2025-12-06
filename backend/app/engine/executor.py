import sys
import io
import contextlib
import traceback
import multiprocessing

def _run_script(code, queue):
    output_buffer = io.StringIO()
    # Secure Sandbox
    safe_globals = {"__builtins__": {
        "print": print, "range": range, "len": len, "int": int, "float": float,
        "str": str, "list": list, "dict": dict, "set": set, "bool": bool,
        "abs": abs, "round": round, "min": min, "max": max, "sum": sum,
    }}

    try:
        with contextlib.redirect_stdout(output_buffer):
            exec(code, safe_globals)
        queue.put({"success": True, "output": output_buffer.getvalue()})
    except Exception:
        queue.put({"success": False, "output": traceback.format_exc()})

def execute_code_safely(code: str, timeout: float = 2.0) -> dict:
    queue = multiprocessing.Queue()
    process = multiprocessing.Process(target=_run_script, args=(code, queue))
    process.start()
    process.join(timeout)

    if process.is_alive():
        process.terminate()
        return {"success": False, "output": "⏱️ Time Limit Exceeded: Check for infinite loops!"}

    if not queue.empty():
        return queue.get()

    return {"success": False, "output": "Unknown execution error."}