import pathlib
b = pathlib.Path("D:/project/app/absen/frontend/src/app/api/attendance")
(b / "check-in" / "route.ts").write_text("hi")
print("ok")